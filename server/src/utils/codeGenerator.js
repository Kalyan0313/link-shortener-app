class CodeGenerator {
  static CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //Generate a random code
  static generate(length = 6) {
    let code = "";
    const charactersLength = this.CHARACTERS.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      code += this.CHARACTERS[randomIndex];
    }

    return code;
  }

  static isValid(code) {
    if (!code || typeof code !== "string") return false;

    const minLength = parseInt(process.env.MIN_CODE_LENGTH) || 6;
    const maxLength = parseInt(process.env.MAX_CODE_LENGTH) || 8;

    if (code.length < minLength || code.length > maxLength) return false;

    const validPattern = /^[A-Za-z0-9]+$/;
    return validPattern.test(code);
  }
}

module.exports = CodeGenerator;
