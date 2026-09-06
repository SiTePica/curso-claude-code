/**
 * Valida el formato de una dirección de email.
 *
 * Reglas aplicadas al dominio (además de la estructura usuario@dominio.tld):
 *  - No puede empezar por punto (ej: usuario@.com)
 *  - No puede contener puntos consecutivos (ej: usuario@dominio..com)
 *  - Ninguna etiqueta del dominio puede empezar o terminar en guion
 *    (ej: usuario@-dominio.com, usuario@dominio-.com)
 *
 * @param {string} email
 * @returns {boolean} true si el formato es válido
 */
function isValidEmail(email) {
  if (typeof email !== "string") return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [user, domain] = parts;
  if (!user || !domain) return false;

  // El dominio no puede empezar ni terminar en punto, ni tener puntos consecutivos.
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) {
    return false;
  }

  // Cada etiqueta del dominio debe ser alfanumérica (con guiones internos permitidos,
  // pero nunca al principio o al final) y debe existir al menos un punto (TLD).
  const labels = domain.split(".");
  if (labels.length < 2) return false;

  const LABEL_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  const domainIsValid = labels.every((label) => LABEL_REGEX.test(label));
  if (!domainIsValid) return false;

  // Parte local (usuario): sin espacios ni caracteres @ adicionales.
  const USER_REGEX = /^[^\s@]+$/;
  return USER_REGEX.test(user);
}

module.exports = { isValidEmail };
