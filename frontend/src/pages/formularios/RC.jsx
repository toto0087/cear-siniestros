import api from '../../api';
import { FormBase, FInput, FTextarea, FCheckbox, Divider } from './FormBase';

export default function FormRC() {
  const submit = (fd) => api.post('/formularios/rc', fd);

  return (
    <FormBase titulo="Responsabilidad Civil" subtitulo="Denuncia de daños causados a terceros" colorClass="text-purple-700"
      onSubmit={submit}>
      <Divider label="Datos del siniestro" />
      <FInput label="Fecha del siniestro" name="fecha_siniestro" type="date" required />
      <FTextarea label="Descripción del hecho" name="descripcion" placeholder="Describí qué ocurrió y cómo se generó el daño al tercero..." required />

      <Divider label="Datos del tercero reclamante" />
      <div className="grid grid-cols-2 gap-4">
        <FInput label="Nombre y apellido" name="tercero_nombre" required />
        <FInput label="DNI" name="tercero_dni" placeholder="12.345.678" required />
      </div>
      <FInput label="Dirección" name="tercero_direccion" placeholder="Domicilio del reclamante" />

      <Divider label="Detalles del reclamo" />
      <FInput label="Monto reclamado" name="monto_reclamado" type="number" placeholder="Monto en pesos" />
      <FCheckbox label="¿Hay actuación judicial en curso?" name="actuacion_judicial" />
    </FormBase>
  );
}
