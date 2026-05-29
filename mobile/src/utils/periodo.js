/**
 * Devuelve el nombre legible de un periodo.
 * Si el periodo tiene 'nombre', se usa.
 * Si no, se construye con el id como fallback.
 */
export function nombrePeriodo(periodo, { includeFechas = false } = {}) {
    if (!periodo) return 'Sin periodo';
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
 * Busca un periodo en una lista por id y devuelve su nombre legible.
 */
export function nombrePeriodoPorId(listaPeriodos, id) {
    if (!listaPeriodos || !id) return `Periodo ${id || ''}`.trim();
    const p = listaPeriodos.find(
        (x) => String(x.id_periodo || x.id) === String(id)
    );
    return p ? nombrePeriodo(p) : `Periodo ${id}`;
}
