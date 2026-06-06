/**
 * Utilidades para validación de datos
 */

/**
 * Valida un correo electrónico
 * @param {string} email - Correo a validar
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida un número de teléfono colombiano
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export const isValidPhone = (phone) => {
    // Acepta formatos: 3001234567, 300-123-4567, 300 123 4567, +57 300 123 4567
    const phoneRegex = /^(\+57)?[\s-]?3\d{2}[\s-]?\d{3}[\s-]?\d{4}$/;
    return phoneRegex.test(phone);
};

/**
 * Valida un documento de identidad colombiano
 * @param {string} document - Documento a validar
 * @returns {boolean} True si es válido
 */
export const isValidDocument = (document) => {
    // Acepta números de 6 a 10 dígitos
    const documentRegex = /^\d{6,10}$/;
    return documentRegex.test(document);
};

/**
 * Valida que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} True si no está vacío
 */
export const isNotEmpty = (value) => {
    return value && value.trim().length > 0;
};

/**
 * Valida la longitud mínima de un texto
 * @param {string} value - Valor a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean} True si cumple la longitud mínima
 */
export const hasMinLength = (value, minLength) => {
    return value && value.length >= minLength;
};

/**
 * Valida la longitud máxima de un texto
 * @param {string} value - Valor a validar
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} True si cumple la longitud máxima
 */
export const hasMaxLength = (value, maxLength) => {
    return value && value.length <= maxLength;
};

/**
 * Valida que un valor sea numérico
 * @param {string|number} value - Valor a validar
 * @returns {boolean} True si es numérico
 */
export const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Valida que una nota esté en el rango válido (0-5)
 * @param {number} grade - Nota a validar
 * @returns {boolean} True si está en el rango válido
 */
export const isValidGrade = (grade) => {
    return isNumeric(grade) && grade >= 0 && grade <= 5;
};

/**
 * Valida una contraseña (mínimo 6 caracteres)
 * @param {string} password - Contraseña a validar
 * @returns {boolean} True si es válida
 */
export const isValidPassword = (password) => {
    return hasMinLength(password, 6);
};

/**
 * Valida que dos contraseñas coincidan
 * @param {string} password1 - Primera contraseña
 * @param {string} password2 - Segunda contraseña
 * @returns {boolean} True si coinciden
 */
export const passwordsMatch = (password1, password2) => {
    return password1 === password2;
};

/**
 * Sanitiza un texto eliminando caracteres especiales
 * @param {string} text - Texto a sanitizar
 * @returns {string} Texto sanitizado
 */
export const sanitizeText = (text) => {
    if (!text) return '';
    return text.trim().replace(/[<>]/g, '');
};

/**
 * Valida un formulario completo
 * @param {Object} fields - Objeto con los campos a validar
 * @param {Object} rules - Objeto con las reglas de validación
 * @returns {Object} Objeto con errores (vacío si no hay errores)
 */
export const validateForm = (fields, rules) => {
    const errors = {};

    Object.keys(rules).forEach(fieldName => {
        const value = fields[fieldName];
        const fieldRules = rules[fieldName];

        if (fieldRules.required && !isNotEmpty(value)) {
            errors[fieldName] = 'Este campo es requerido';
            return;
        }

        if (fieldRules.email && !isValidEmail(value)) {
            errors[fieldName] = 'Correo electrónico inválido';
            return;
        }

        if (fieldRules.phone && !isValidPhone(value)) {
            errors[fieldName] = 'Número de teléfono inválido';
            return;
        }

        if (fieldRules.minLength && !hasMinLength(value, fieldRules.minLength)) {
            errors[fieldName] = `Mínimo ${fieldRules.minLength} caracteres`;
            return;
        }

        if (fieldRules.maxLength && !hasMaxLength(value, fieldRules.maxLength)) {
            errors[fieldName] = `Máximo ${fieldRules.maxLength} caracteres`;
            return;
        }

        if (fieldRules.numeric && !isNumeric(value)) {
            errors[fieldName] = 'Debe ser un número válido';
            return;
        }

        if (fieldRules.grade && !isValidGrade(value)) {
            errors[fieldName] = 'La nota debe estar entre 0 y 5';
            return;
        }
    });

    return errors;
};

export default {
    isValidEmail,
    isValidPhone,
    isValidDocument,
    isNotEmpty,
    hasMinLength,
    hasMaxLength,
    isNumeric,
    isValidGrade,
    isValidPassword,
    passwordsMatch,
    sanitizeText,
    validateForm,
};
