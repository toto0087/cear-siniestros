import { useState } from 'react';
import { ArrowLeft, Send, Paperclip, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

export function FormBase({ titulo, subtitulo, colorClass = 'text-[#1B3568]', onSubmit, children }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (i) => setFiles(f => f.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      files.forEach(f => formData.append('archivos', f));
      await onSubmit(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el formulario. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Enviado exitosamente!</h2>
          <p className="text-slate-500 text-sm mb-8">
            Tu formulario fue enviado a los asesores de CEAR. Te van a contactar a la brevedad.
          </p>
          <button onClick={() => navigate('/cliente')}
            className="px-8 py-3 bg-[#1B3568] text-white font-semibold rounded-xl hover:bg-[#162654] transition">
            Volver al inicio
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center gap-3 mb-7">
        <button onClick={() => navigate('/cliente')}
          className="p-2 rounded-xl hover:bg-slate-200 text-slate-600 transition">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${colorClass}`}>{titulo}</h1>
          {subtitulo && <p className="text-slate-500 text-sm mt-0.5">{subtitulo}</p>}
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-5">
          {children}

          {/* File upload */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Adjuntar archivos (fotos, documentos) — máx. 5 archivos
            </label>
            <label className="flex items-center gap-2 w-fit cursor-pointer px-4 py-2.5 rounded-xl border-2 border-dashed
                              border-slate-300 text-slate-500 text-sm hover:border-[#1B3568] hover:text-[#1B3568] transition">
              <Paperclip size={16} />
              Seleccionar archivos
              <input type="file" multiple onChange={handleFiles} className="hidden" accept="image/*,.pdf,.doc,.docx" />
            </label>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                    <Paperclip size={13} className="text-slate-400" />
                    <span className="flex-1 truncate">{f.name}</span>
                    <span className="text-xs text-slate-400">{(f.size / 1024).toFixed(0)} KB</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-[#1B3568] text-white font-semibold text-sm
                         rounded-xl hover:bg-[#162654] transition disabled:opacity-60 shadow-md shadow-[#1B3568]/20
                         hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200">
              <Send size={16} />
              {loading ? 'Enviando...' : 'Enviar formulario'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm
  focus:outline-none focus:ring-2 focus:ring-[#1B3568]/20 focus:border-[#1B3568] transition placeholder:text-slate-400`;

export function FInput({ label, required, ...props }) {
  return (
    <Field label={label} required={required}>
      <input className={inputClass} required={required} {...props} />
    </Field>
  );
}

export function FSelect({ label, required, children, ...props }) {
  return (
    <Field label={label} required={required}>
      <select className={inputClass} required={required} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function FTextarea({ label, required, ...props }) {
  return (
    <Field label={label} required={required}>
      <textarea className={`${inputClass} resize-none`} rows={3} required={required} {...props} />
    </Field>
  );
}

export function FCheckbox({ label, name }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700">
      <input type="checkbox" name={name} value="true" className="w-4 h-4 accent-[#1B3568] rounded" />
      {label}
    </label>
  );
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <hr className="flex-1 border-slate-200" />
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <hr className="flex-1 border-slate-200" />
    </div>
  );
}
