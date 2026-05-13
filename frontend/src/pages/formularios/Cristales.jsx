import api from '../../api';
import { FormBase, FInput, FTextarea, FSelect, Divider } from './FormBase';

export default function FormCristales() {
  const submit = (fd) => api.post('/formularios/cristales', fd);

  return (
    <FormBase titulo="Siniestro · Cristales" subtitulo="Denuncia de rotura de vidrios o ventanas" colorClass="text-teal-700"
      onSubmit={submit}>
      <Divider label="Datos del siniestro" />
      <FInput label="Fecha del siniestro" name="fecha_siniestro" type="date" required />
      <FSelect label="Tipo de cristal afectado" name="tipo_cristal" required>
        <option value="">Seleccioná una opción</option>
        <option>Ventana</option>
        <option>Puerta vidriada</option>
        <option>Vidriera / escaparate</option>
        <option>Espejo</option>
        <option>Techo de vidrio</option>
        <option>Otro</option>
      </FSelect>
      <FInput label="Dimensiones aproximadas" name="dimensiones" placeholder="Ej: 1.20m x 0.80m" />
      <FTextarea label="Descripción del hecho" name="descripcion" placeholder="¿Cómo ocurrió la rotura?" required />
      <FTextarea label="Causa identificada" name="causa_identificada" placeholder="Si se identificó la causa, describila aquí..." />
    </FormBase>
  );
}
