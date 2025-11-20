const linkService = require("../services/link.service");
const RequestHandler = require("../utils/RequestHandler");

class LinkController {
  //Create a new link
  async createLink(req, res) {
    try {
      const { targetUrl, customCode } = req.body;

      if (!targetUrl) {
        return RequestHandler.sendBadRequest(res, "Target URL is required", {
          field: "targetUrl",
          message: "This field is required",
        });
      }

      const link = await linkService.createLink(targetUrl, customCode);

      return RequestHandler.sendCreated(res, link, "Link created successfully");
    } catch (error) {
      console.error("Error in createLink controller", error);

      if (error.status === 400) {
        return RequestHandler.sendBadRequest(res, error.message, {
          field: error.field,
          message: error.message,
        });
      }

      if (error.status === 409) {
        return RequestHandler.sendConflict(res, error.message);
      }

      return RequestHandler.sendError(res, "Failed to create link");
    }
  }

  //Get all links
  async getAllLinks(req, res) {
    try {
      const { search } = req.query;
      const links = await linkService.getAllLinks(search);

      return RequestHandler.sendSuccess(
        res,
        { links },
        200,
        "Links retrieved successfully"
      );
    } catch (error) {
      console.error("Error in getAllLinks controller", error);
      return RequestHandler.sendError(res, "Failed to retrieve links");
    }
  }

  //Get link by code
  async getLinkByCode(req, res) {
    try {
      const { code } = req.params;
      const link = await linkService.getLinkByCode(code);

      return RequestHandler.sendSuccess(
        res,
        link,
        200,
        "Link retrieved successfully"
      );
    } catch (error) {
      console.error("Error in getLinkByCode controller", error);

      if (error.status === 404) {
        return RequestHandler.sendNotFound(res, error.message);
      }

      if (error.status === 400) {
        return RequestHandler.sendBadRequest(res, error.message);
      }

      return RequestHandler.sendError(res, "Failed to retrieve link");
    }
  }

  //Delete a link
  async deleteLink(req, res) {
    try {
      const { code } = req.params;
      await linkService.deleteLink(code);

      return RequestHandler.sendSuccess(res, {}, 200, "Link deleted successfully");
    } catch (error) {
      console.error("Error in deleteLink controller", error);

      if (error.status === 404) {
        return RequestHandler.sendNotFound(res, error.message);
      }

      if (error.status === 400) {
        return RequestHandler.sendBadRequest(res, error.message);
      }

      return RequestHandler.sendError(res, "Failed to delete link");
    }
  }
}

const linkController = new LinkController();

module.exports = linkController;
