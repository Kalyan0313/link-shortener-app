//Link Model
class Link {
  constructor(data) {
    this.id = data.id || null;
    this.shortCode = data.short_code || data.shortCode;
    this.targetUrl = data.target_url || data.targetUrl;
    this.totalClicks = data.total_clicks || data.totalClicks || 0;
    this.lastClicked = data.last_clicked || data.lastClicked || null;
    this.createdAt = data.created_at || data.createdAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      shortCode: this.shortCode,
      targetUrl: this.targetUrl,
      totalClicks: this.totalClicks,
      lastClicked: this.lastClicked,
      createdAt: this.createdAt,
    };
  }

  toDB() {
    return {
      short_code: this.shortCode,
      target_url: this.targetUrl,
      total_clicks: this.totalClicks,
      last_clicked: this.lastClicked,
      created_at: this.createdAt,
    };
  }
}

module.exports = Link;
