const database = require("../config/database");
const Link = require("../models/link.model");

class LinkRepository {
  constructor() {
    this.pool = null;
  }

  //Initialize repository with database pool

  initialize() {
    this.pool = database.getPool();
  }

  //Create a new link

  async create(linkData) {
    const query = `
      INSERT INTO links (short_code, target_url, total_clicks, last_clicked, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      linkData.shortCode,
      linkData.targetUrl,
      0,
      null,
      new Date(),
    ];

    try {
      const result = await this.pool.query(query, values);
      return new Link(result.rows[0]);
    } catch (error) {
      console.error("Error creating link", error);
      throw error;
    }
  }

  //Find link by short code
  async findByCode(shortCode) {
    const query = "SELECT * FROM links WHERE short_code = $1";

    try {
      const result = await this.pool.query(query, [shortCode]);

      if (result.rows.length === 0) {
        return null;
      }

      return new Link(result.rows[0]);
    } catch (error) {
      console.error("Error finding link by code", error);
      throw error;
    }
  }

  //Find all links
  async findAll(searchTerm = null) {
    let query = "SELECT * FROM links";
    const values = [];

    if (searchTerm) {
      query += " WHERE short_code ILIKE $1 OR target_url ILIKE $1";
      values.push(`%${searchTerm}%`);
    }

    query += " ORDER BY created_at DESC";

    try {
      const result = await this.pool.query(query, values);
      return result.rows.map((row) => new Link(row));
    } catch (error) {
      console.error("Error finding all links", error);
      throw error;
    }
  }

  async incrementClicks(shortCode) {
    const query = `
      UPDATE links 
      SET total_clicks = total_clicks + 1,
          last_clicked = $1
      WHERE short_code = $2
      RETURNING *
    `;

    try {
      const result = await this.pool.query(query, [new Date(), shortCode]);

      if (result.rows.length === 0) {
        return null;
      }

      return new Link(result.rows[0]);
    } catch (error) {
      console.error("Error incrementing clicks", error);
      throw error;
    }
  }

  //Delete link by short code
  async delete(shortCode) {
    const query = "DELETE FROM links WHERE short_code = $1 RETURNING *";

    try {
      const result = await this.pool.query(query, [shortCode]);

      if (result.rows.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting link", error);
      throw error;
    }
  }

  async exists(shortCode) {
    const query = "SELECT EXISTS(SELECT 1 FROM links WHERE short_code = $1)";

    try {
      const result = await this.pool.query(query, [shortCode]);
      return result.rows[0].exists;
    } catch (error) {
      console.error("Error checking if code exists", error);
      throw error;
    }
  }

  //Get total count of links
  async count() {
    const query = "SELECT COUNT(*) as total FROM links";

    try {
      const result = await this.pool.query(query);
      return parseInt(result.rows[0].total);
    } catch (error) {
      console.error("Error getting link count", error);
      throw error;
    }
  }
}

const linkRepository = new LinkRepository();

module.exports = linkRepository;
