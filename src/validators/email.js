/**
 * Valida el formato de una dirección de email.
 * @param {string} email
 * @returns {boolean} true si el formato es válido
 */
function isValidEmail(email) {
  if (typeof email !== "string") return false;

  // Regex simplificada: exige usuario@dominio.tld
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return EMAIL_REGEX.test(email);
}

module.exports = { isValidEmail };
