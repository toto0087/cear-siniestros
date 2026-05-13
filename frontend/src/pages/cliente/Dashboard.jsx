import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Flame, GlassWater, Scale, Plane, Lock, ArrowRight } from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const FORMULARIOS = [
  { id: 'automotores', label: 'Automotores', desc: 'Denuncia de siniestro vehicular', icon: Car,
    color: 'from-blue-500 to-blue-700', check: (p) => p.some(x => x.tipo === 'automotores') },
  { id: 'incendio', label: 'Incendio', desc: 'Denuncia por daños de incendio', icon: Flame,
    color: 'from-orange-500 to-red-600', check: (p) => p.some(x => x.tipo === 'integral_comercio' && x.cubre_incendio) },
  { id: 'cristales', label: 'Cristales', desc: 'Rotura de vidrios o ventanas', icon: GlassWater,
    color: 'from-cyan-500 to-teal-600', check: (p) => p.some(x => x.tipo === 'integral_comercio' && x.cubre_cristales) },
  { id: 'rc', label: 'Responsabilidad Civil', desc: 'Daños causados a terceros', icon: Scale,
    color: 'from-purple-500 to-purple-700', check: (p) => p.some(x => x.tipo === 'integral_comercio' && x.cubre_rc) },
  { id: 'aviso-viaje', label: 'Aviso de Viaje', desc: 'Notificación de viaje escolar', icon: Plane,
    color: 'from-emerald-500 to-green-700', check: (p) => p.some(x => x.tipo === 'integral_comercio' && x.cubre_aviso_viaje) },
];

export default function ClienteDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [polizas, setPolizas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/polizas/mis-polizas').then(r => setPolizas(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1B3568]">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Seleccioná el tipo de formulario que querés completar
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Cargando pólizas...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FORMULARIOS.map(({ id, label, desc, icon: Icon, color, check }) => {
            const habilitado = check(polizas);
            return (
              <button
                key={id}
                onClick={() => habilitado && navigate(`/formulario/${id}`)}
                disabled={!habilitado}
                className={`group relative text-left rounded-2xl overflow-hidden shadow-sm border transition-all duration-200
                  ${habilitado
                    ? 'border-transparent hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                    : 'border-slate-200 opacity-60 cursor-not-allowed bg-white'}`}
              >
                {habilitado ? (
                  <>
                    <div className={`bg-gradient-to-br ${color} p-6 pb-10`}>
                      <Icon size={32} className="text-white mb-3" />
                      <h3 className="text-white font-bold text-lg">{label}</h3>
                      <p className="text-white/80 text-sm mt-1">{desc}</p>
                    </div>
                    <div className="bg-white px-6 py-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Completar formulario</span>
                      <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </>
                ) : (
                  <div className="p-6 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-slate-100">
                      <Icon size={22} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-600">{label}</h3>
                        <Lock size={13} className="text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{desc}</p>
                      <p className="text-xs text-slate-400 mt-2 italic">No cubierto por tus pólizas</p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Mis pólizas */}
      {!loading && polizas.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wider mb-4">Mis pólizas vigentes</h2>
          <div className="space-y-3">
            {polizas.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`p-2 rounded-lg ${p.tipo === 'automotores' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  {p.tipo === 'automotores' ? <Car size={16} className="text-blue-600" /> : <Scale size={16} className="text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    {p.tipo === 'automotores' ? 'Automotores' : 'Integral de Comercio'} · N° {p.numero_poliza}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Vigente hasta {p.fecha_fin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
