const PLATFORMS = [
  { id: "YT", name: "YouTube", color: "#FF0000" },
  { id: "FB", name: "Facebook", color: "#1877F2" },
  { id: "IG", name: "Instagram", color: "#E1306C" },
  { id: "TK", name: "TikTok", color: "#000000" },
  { id: "LI", name: "LinkedIn", color: "#0A66C2" },
  { id: "X", name: "X (Twitter)", color: "#000000" },
];

const MODULES = [
  { id: "M1", name: "Analytics", description: "Channel statistics, metrics and growth tracking." },
  { id: "M2", name: "Automation", description: "Auto-posting, scheduling and queue management." },
  { id: "M3", name: "Engagement", description: "Inbox management, comments and direct messages." },
  { id: "M4", name: "Competitors", description: "Tracking and benchmarking against rival channels." },
];

const MATRIX = {
  "M1-YT": { status: "Active", sku: "PL-YT-AN" },
  "M1-FB": { status: "Active", sku: "PL-FB-AN" },
  "M2-YT": { status: "Active", sku: "PL-YT-AU" },
  "M3-FB": { status: "Active", sku: "PL-FB-EN" },
};

class ProductRepository {
  async getMatrixData() {
    return {
      platforms: PLATFORMS,
      modules: MODULES,
      matrix: MATRIX
    };
  }
}

module.exports = new ProductRepository();
