/**
 * Servicio para gestionar boletines académicos
 */
import { BOLETIN_ENDPOINTS, PERIODO_ENDPOINTS } from '../config/api';

const boletinService = {
    /**
     * Obtiene el estado de habilitación de descarga de boletines
     * @returns {Promise<Object>} Estado de la configuración
     */
    async getEstadoDescarga() {
        try {
            const response = await fetch(BOLETIN_ENDPOINTS.ESTADO, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener estado de boletines');
            }

            const data = await response.json();
            return {
                success: true,
                data: data,
            };
        } catch (error) {
            console.error('❌ Error en getEstadoDescarga:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    },

    /**
     * Obtiene la lista de periodos académicos
     * @returns {Promise<Object>} Lista de periodos
     */
    async getPeriodos() {
        try {
            const response = await fetch(PERIODO_ENDPOINTS.LIST, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener periodos');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.results || data || [],
            };
        } catch (error) {
            console.error('❌ Error en getPeriodos:', error);
            return {
                success: false,
                error: error.message,
                data: [],
            };
        }
    },

    /**
     * Genera la URL de descarga del boletín
     * @param {string} periodo - ID del periodo
     * @param {string} estudiante - Documento del estudiante
     * @returns {string} URL de descarga
     */
    getBoletinDownloadUrl(periodo, estudiante) {
        return BOLETIN_ENDPOINTS.DESCARGAR(periodo, estudiante);
    },
};

export default boletinService;
