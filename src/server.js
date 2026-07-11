// server.js
// ---------
// Main entry point. Mounts every route file under its own /api/... path.
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const teamRoutes = require("./routes/team");
const servicesRoutes = require("./routes/services");
const industriesRoutes = require("./routes/industries");
const siteContentRoutes = require("./routes/siteContent");
const blogRoutes = require("./routes/blog");
const contactRoutes = require("./routes/contact");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://pearl-vector-website-five.vercel.app", // your live frontend
  ],
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/industries", industriesRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.json({ status: "PearlVector API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const projectsRoutes = require("./routes/projects");
// ...
app.use("/api/projects", projectsRoutes);