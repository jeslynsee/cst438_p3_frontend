import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dist = path.join(__dirname, "dist");

app.use(express.static(dist));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
