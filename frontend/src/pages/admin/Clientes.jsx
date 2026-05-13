import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, UserX, UserCheck } from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../api';
import Toast from '../../components/Toast';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/usuarios').then(r => setClientes(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleActivo = async (c) => {
    await api.put(`/usuarios/${c.id}`, { activo: !c.activo });
    setToast({ message: `Cliente ${!c.activo ? 'activado' : 'desactivado'}`, type: 'success' });
    load();
  };

  const filtered = clientes.filter(c =>
    `${c.nombre} ${c.apellido} ${c.username} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3568]">Clientes</h1>
          <p className="text-slate-500 mt-1 text-sm">Gestión de cuentas de clientes</p>
        </div>
        <Link to="/admin/clientes/nuevo"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1B3568] text-white text-sm font-semibold
                     rounded-xl hover:bg-[#162654] transition shadow-md shadow-[#1B3568]/20">
          <Plus size={16} /> Nuevo cliente
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, usuario o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#1B3568]/20 focus:border-[#1B3568] transition"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No se encontraron clientes</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Nombre', 'Usuario', 'CUIL', 'Email', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-800">{c.apellido}, {c.nombre}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">{c.username}</td>
                    <td className="py-3.5 px-4 text-slate-500">{c.cuil || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-500">{c.email || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold
                        ${c.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/clientes/${c.id}`}
                          className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#1B3568] transition">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => toggleActivo(c)}
                          className={`p-2 rounded-lg transition ${c.activo
                            ? 'text-slate-500 hover:bg-red-50 hover:text-red-600'
                            : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}>
                          {c.activo ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
