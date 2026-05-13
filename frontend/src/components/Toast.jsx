import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const base = 'fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl max-w-sm transition-all duration-300';
  const styles = type === 'success'
    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
    : 'bg-red-50 border border-red-200 text-red-800';
  const Icon = type === 'success' ? CheckCircle : XCircle;
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className={`${base} ${styles} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <Icon size={20} className={`mt-0.5 shrink-0 ${iconColor}`} />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="shrink-0 opacity-50 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}
