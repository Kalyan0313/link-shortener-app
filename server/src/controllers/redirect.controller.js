const linkService = require("../services/link.service");
const RequestHandler = require("../utils/RequestHandler");

class RedirectController {
  async redirect(req, res) {
    try {
      const { code } = req.params;
      const targetUrl = await linkService.handleRedirect(code);

      return res.redirect(302, targetUrl);
    } catch (error) {
      console.error("Error in redirect controller", error);

      if (error.status === 404) {
        return RequestHandler.sendNotFound(res, "Short link not found");
      }

      return RequestHandler.sendError(res, "Failed to process redirect");
    }
  }
}

const redirectController = new RedirectController();

module.exports = redirectController;
