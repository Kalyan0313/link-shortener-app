const linkRepository = require("../repositories/link.repository");
const CodeGenerator = require("../utils/codeGenerator");
const UrlValidator = require("../utils/urlValidator");

class LinkService {
  //Create a new short link
  async createLink(targetUrl, customCode = null) {
    // Validate URL
    const sanitizedUrl = UrlValidator.sanitize(targetUrl);

    if (!UrlValidator.isValid(sanitizedUrl)) {
      throw {
        status: 400,
        message: "Invalid URL format",
        field: "targetUrl",
      };
    }

    let shortCode = customCode;

    if (customCode) {
      if (!CodeGenerator.isValid(customCode)) {
        throw {
          status: 400,
          message: `Short code must be ${process.env.MIN_CODE_LENGTH}-${process.env.MAX_CODE_LENGTH} alphanumeric characters`,
          field: "customCode",
        };
      }

      // Check if custom code already exists
      const exists = await linkRepository.exists(customCode);
      if (exists) {
        throw {
          status: 409,
          message: "Short code already exists",
          field: "customCode",
        };
      }
    } else {
      // Generate unique random code
      shortCode = await this.generateUniqueCode();
    }

    const link = await linkRepository.create({
      shortCode,
      targetUrl: sanitizedUrl,
    });

    return link.toJSON();
  }

  async generateUniqueCode() {
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const code = CodeGenerator.generate(6);
      const exists = await linkRepository.exists(code);

      if (!exists) {
        return code;
      }

      attempts++;
    }

    throw {
      status: 500,
      message: "Failed to generate unique code. Please try again.",
    };
  }

  async getAllLinks(search = null) {
    const links = await linkRepository.findAll(search);
    return links.map((link) => link.toJSON());
  }

  async getLinkByCode(shortCode) {
    if (!CodeGenerator.isValid(shortCode)) {
      throw {
        status: 400,
        message: "Invalid short code format",
      };
    }

    const link = await linkRepository.findByCode(shortCode);

    if (!link) {
      throw {
        status: 404,
        message: "Link not found",
      };
    }

    return link.toJSON();
  }

  async handleRedirect(shortCode) {
    const link = await linkRepository.findByCode(shortCode);

    if (!link) {
      throw {
        status: 404,
        message: "Link not found",
      };
    }

    linkRepository.incrementClicks(shortCode).catch((err) => {
      console.error("Failed to increment clicks", err);
    });

    return link.targetUrl;
  }

  async deleteLink(shortCode) {
    if (!CodeGenerator.isValid(shortCode)) {
      throw {
        status: 400,
        message: "Invalid short code format",
      };
    }

    const deleted = await linkRepository.delete(shortCode);

    if (!deleted) {
      throw {
        status: 404,
        message: "Link not found",
      };
    }

    return true;
  }

  async getStats() {
    const totalLinks = await linkRepository.count();
    return {
      totalLinks,
    };
  }
}

const linkService = new LinkService();

module.exports = linkService;
