import api from '../../api';
import { FormBase, FInput, FTextarea, FCheckbox, Divider } from './FormBase';

export default function FormIncendio() {
  const submit = (fd) => api.post('/formularios/incendio', fd);

  return (
    <FormBase titulo="Siniestro · Incendio" subtitulo="Completá los datos del siniestro por incendio" colorClass="text-orange-700"
      onSubmit={submit}>
      <Divider label="Datos del siniestro" />
      <div className="grid grid-cols-2 gap-4">
        <FInput label="Fecha del siniestro" name="fecha_siniestro" type="date" required />
      </div>
      <FInput label="Dirección donde ocurrió" name="direccion" placeholder="Calle, número, localidad" required />
      <FTextarea label="Descripción del siniestro" name="descripcion" placeholder="Describí qué ocurrió, la magnitud del daño..." required />

      <Divider label="Detalles adicionales" />
      <FTextarea label="Bienes afectados" name="bienes_afectados" placeholder="Listá los bienes dañados o destruidos..." required />
      <div className="space-y-2">
        <FCheckbox label="¿Hubo víctimas o heridos?" name="hubo_victimas" />
        <FCheckbox label="¿Intervino Bomberos o Defensa Civil?" name="intervino_bomberos" />
      </div>
    </FormBase>
  );
}
