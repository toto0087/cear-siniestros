require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY son requeridas');
}

// Wrapper para mantener compatibilidad con queries existentes usando REST API de Supabase
class SupabasePool {
  async query(sql, params = []) {
    try {
      const normalizedSql = sql.trim().toUpperCase();
      
      if (normalizedSql.startsWith('SELECT')) {
        return await this._handleSelect(sql, params);
      } else if (normalizedSql.startsWith('INSERT')) {
        return await this._handleInsert(sql, params);
      } else if (normalizedSql.startsWith('UPDATE')) {
        return await this._handleUpdate(sql, params);
      } else if (normalizedSql.startsWith('DELETE')) {
        return await this._handleDelete(sql, params);
      } else {
        throw new Error(`Tipo de query no soportada: ${normalizedSql.substring(0, 20)}`);
      }
    } catch (error) {
      console.error('Error en query:', error.message);
      throw error;
    }
  }

  async _handleSelect(sql, params) {
    // Extraer tabla: SELECT ... FROM usuarios ...
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (!tableMatch) throw new Error('No se pudo extraer tabla de SELECT');
    
    const table = tableMatch[1];
    let filter = '';
    let order = '';

    // Procesar WHERE si existe
    const whereIndex = sql.toUpperCase().indexOf('WHERE');
    if (whereIndex !== -1) {
      const orderByIndex = sql.toUpperCase().indexOf('ORDER BY');
      const whereClause = orderByIndex !== -1 
        ? sql.substring(whereIndex + 5, orderByIndex).trim()
        : sql.substring(whereIndex + 5).trim();
      
      filter = this._buildFilter(whereClause, params);
    }

    // Procesar ORDER BY si existe
    const orderByMatch = sql.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    if (orderByMatch) {
      const field = orderByMatch[1];
      const direction = orderByMatch[2]?.toUpperCase() === 'DESC' ? 'desc' : 'asc';
      order = `order=${field}.${direction}`;
    }

    let url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
    if (filter) url += `&${filter}`;
    if (order) url += `&${order}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Supabase error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return [data || []];
  }

  async _handleInsert(sql, params) {
    // INSERT INTO usuarios (nombre, apellido, ...) VALUES (?, ?, ...)
    const tableMatch = sql.match(/INSERT\s+INTO\s+(\w+)\s*\((.*?)\)/i);
    if (!tableMatch) throw new Error('No se pudo parsear INSERT');

    const table = tableMatch[1];
    const columns = tableMatch[2].split(',').map(c => c.trim());
    
    const data = {};
    columns.forEach((col, idx) => {
      data[col] = params[idx];
    });

    const url = `${SUPABASE_URL}/rest/v1/${table}?select=id`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Supabase error: ${error.message || response.statusText}`);
    }

    const result = await response.json();
    return [{ insertId: result?.[0]?.id || null }];
  }

  async _handleUpdate(sql, params) {
    // UPDATE usuarios SET nombre = ?, apellido = ? WHERE id = ?
    const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
    if (!tableMatch) throw new Error('No se pudo extraer tabla de UPDATE');
    const table = tableMatch[1];

    const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
    if (!setMatch) throw new Error('No se pudo extraer SET de UPDATE');

    const setClause = setMatch[1];
    const updates = setClause.split(',').map(s => s.trim());
    
    const data = {};
    let paramIdx = 0;
    updates.forEach(update => {
      const [field] = update.split('=').map(s => s.trim());
      data[field] = params[paramIdx++];
    });

    const whereMatch = sql.match(/WHERE\s+(.+?)$/i);
    if (!whereMatch) throw new Error('No se encontró WHERE en UPDATE');

    const whereClause = whereMatch[1].trim();
    const [whereField] = whereClause.split('=').map(s => s.trim());
    const whereValue = params[paramIdx];

    const filter = `${whereField}=eq.${whereValue}`;
    const url = `${SUPABASE_URL}/rest/v1/${table}?${filter}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Supabase error: ${error.message || response.statusText}`);
    }

    return [{ affectedRows: 1 }];
  }

  async _handleDelete(sql, params) {
    // DELETE FROM usuarios WHERE id = ?
    const tableMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
    if (!tableMatch) throw new Error('No se pudo extraer tabla de DELETE');
    const table = tableMatch[1];

    const whereMatch = sql.match(/WHERE\s+(.+?)$/i);
    if (!whereMatch) throw new Error('No se encontró WHERE en DELETE');

    const whereClause = whereMatch[1].trim();
    const [field] = whereClause.split('=').map(s => s.trim());

    const filter = `${field}=eq.${params[0]}`;
    const url = `${SUPABASE_URL}/rest/v1/${table}?${filter}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Supabase error: ${error.message || response.statusText}`);
    }

    return [{ affectedRows: 1 }];
  }

  _buildFilter(whereClause, params) {
    // Parsear WHERE clause: "username = ? AND activo = 1"
    const conditions = whereClause.split(/\s+AND\s+/i);
    let paramIdx = 0;
    const filters = [];

    conditions.forEach(condition => {
      const match = condition.match(/(\w+)\s*=\s*(.+)/);
      if (match) {
        const field = match[1];
        const value = match[2].trim();
        
        if (value === '?') {
          filters.push(`${field}=eq.${params[paramIdx++]}`);
        } else {
          // Valor literal (ej: "1" para activo = 1)
          filters.push(`${field}=eq.${value}`);
        }
      }
    });

    return filters.join('&');
  }
}

const pool = new SupabasePool();

module.exports = pool;
