const { app, connectToDatabase } = require("./server");

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error("API request failed:", error.message);
    return res.status(500).json({ error: "Server configuration error" });
  }
};
