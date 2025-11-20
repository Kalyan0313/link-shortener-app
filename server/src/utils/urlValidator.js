class UrlValidator {
  static isValid(url) {
    if (!url || typeof url !== "string") return false;

    try {
      const urlObject = new URL(url);
      return urlObject.protocol === "http:" || urlObject.protocol === "https:";
    } catch (error) {
      return false;
    }
  }

  static sanitize(url) {
    if (!url) return null;
    return url.trim();
  }
}

module.exports = UrlValidator;
