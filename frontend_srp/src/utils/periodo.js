/**
 * Devuelve el nombre legible de un periodo.
 * Si el periodo tiene 'nombre', se usa.
 * Si no, se construye con el id como fallback.
 *
 * @param {Object} periodo - objeto Periodo del backend
 * @param {Object} options
 * @param {boolean} options.includeFechas - si incluir las fechas entre paréntesis
 * @returns {string}
 */
export function nombrePeriodo(periodo, { includeFechas = false } = {}) {
  if (!periodo) return "Sin periodo";
  const base =
    periodo.nombre ||
    periodo.nombre_display ||
    `Periodo ${periodo.id_periodo || periodo.id}`;
  if (includeFechas && periodo.fecha_inicio && periodo.fecha_fin) {
    return `${base} (${periodo.fecha_inicio} → ${periodo.fecha_fin})`;
  }
  return base;
}

/**
 * Busca un periodo por su id y devuelve su nombre legible.
 * @param {Array} listaPeriodos
 * @param {number|string} id
 */
export function nombrePeriodoPorId(listaPeriodos, id) {
  if (!listaPeriodos || !id) return `Periodo ${id || ""}`.trim();
  const p = listaPeriodos.find(
    (x) => String(x.id_periodo || x.id) === String(id)
  );
  return p ? nombrePeriodo(p) : `Periodo ${id}`;
}
