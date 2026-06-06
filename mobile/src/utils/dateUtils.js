/**
 * Utilidades para manejo de fechas
 */

/**
 * Formatea una fecha al formato DD/MM/YYYY
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha al formato DD/MM/YYYY HH:mm
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha y hora formateadas
 */
export const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Convierte una fecha al formato ISO para la API (YYYY-MM-DD)
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} Fecha en formato ISO
 */
export const toISODate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Obtiene el nombre del día de la semana
 * @param {Date|string} date - Fecha
 * @returns {string} Nombre del día
 */
export const getDayName = (date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const d = new Date(date);
    return days[d.getDay()];
};

/**
 * Obtiene el nombre del mes
 * @param {Date|string} date - Fecha
 * @returns {string} Nombre del mes
 */
export const getMonthName = (date) => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const d = new Date(date);
    return months[d.getMonth()];
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {Date|string} date1 - Primera fecha
 * @param {Date|string} date2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
export const daysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Verifica si una fecha es hoy
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} True si es hoy
 */
export const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
};

/**
 * Formatea una fecha de forma relativa (hace X días, ayer, hoy)
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada de forma relativa
 */
export const formatRelativeDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isToday(d)) {
        return 'Hoy';
    }

    if (d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear()) {
        return 'Ayer';
    }

    const days = daysDifference(d, today);
    if (days < 7) {
        return `Hace ${days} días`;
    }

    return formatDate(d);
};

export default {
    formatDate,
    formatDateTime,
    toISODate,
    getDayName,
    getMonthName,
    daysDifference,
    isToday,
    formatRelativeDate,
};
