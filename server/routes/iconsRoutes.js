import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");

const formatLabel = (filename) => {
  return filename
    .replace(/^icon-/, "")
    .replace(/\.svg$/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

router.get("/", (req, res) => {
  fs.readdir(publicDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read icon directory" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/public`;

    const icons = files
      .filter((name) => name.startsWith("icon-") && name.endsWith(".svg"))
      .map((name) => ({
        name: formatLabel(name),
        filename: name,
        url: `${baseUrl}/${name}`,
      }));

    res.json({ icons });
  });
});

export default router;
