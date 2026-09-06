const { isValidEmail } = require("./email");

describe("isValidEmail", () => {
  describe("emails válidos", () => {
    test.each([
      "usuario@dominio.com",
      "usuario.apellido@dominio.co",
      "usuario@sub.dominio.com",
      "usuario123@dominio-valido.com",
    ])("acepta %s", (email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  describe("emails inválidos (issue #1)", () => {
    test.each([
      "usuario@.com",
      "usuario@dominio..com",
      "usuario@-dominio.com",
      "usuario@dominio-.com",
      "usuario@dominio",
      "usuario@",
      "@dominio.com",
      "",
      null,
      undefined,
    ])("rechaza %s", (email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });
});
