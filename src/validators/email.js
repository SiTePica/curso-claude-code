/**
 * Valida el formato de una dirección de email.
 * @param {string} email
 * @returns {boolean} true si el formato es válido
 */
function isValidEmail(email) {
  if (typeof email !== "string") return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [user, domain] = parts;
  if (!user || !domain) return false;

  // BUG: solo comprueba que el dominio contenga un punto,
  // sin validar su posición (permite ".com", "dominio..com", etc.)
  return domain.includes(".");
}

module.exports = { isValidEmail };
