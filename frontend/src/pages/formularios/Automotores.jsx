import api from '../../api';
import { FormBase, FInput, FTextarea, FSelect, FCheckbox, Divider } from './FormBase';

export default function FormAutomotores() {
  const submit = (fd) => api.post('/formularios/automotores', fd);

  return (
    <FormBase titulo="Siniestro · Automotores" subtitulo="Completá todos los datos del accidente vehicular" colorClass="text-blue-700"
      onSubmit={submit}>
      <Divider label="Datos del siniestro" />
      <div className="grid grid-cols-2 gap-4">
        <FInput label="Fecha del siniestro" name="fecha_siniestro" type="date" required />
        <FInput label="Patente del vehículo" name="patente" placeholder="ABC 123" required />
      </div>
      <FTextarea label="Descripción del siniestro" name="descripcion" placeholder="Describí qué ocurrió, cómo y dónde..." required />

      <Divider label="Datos del conductor" />
      <div className="grid grid-cols-2 gap-4">
        <FInput label="Nombre y apellido" name="conductor_nombre" required />
        <FInput label="DNI" name="conductor_dni" placeholder="12.345.678" required />
      </div>
      <FInput label="N° de licencia" name="conductor_licencia" placeholder="Número de carnet de conducir" />

      <Divider label="Terceros involucrados" />
      <FCheckbox label="¿Hubo terceros involucrados?" name="hubo_terceros" />
      <div className="grid grid-cols-2 gap-4">
        <FInput label="Nombre del tercero" name="tercero_nombre" />
        <FInput label="Patente del tercero" name="tercero_patente" />
      </div>
      <FInput label="Aseguradora del tercero" name="tercero_aseguradora" />
    </FormBase>
  );
}
