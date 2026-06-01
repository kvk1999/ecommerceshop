import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "server/public/uploads");

// Ensure uploads directory exists
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "image", ext).replace(/\s+/g, "-");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}-${unique}${ext}`);
  },
});

export const productImageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];

    // Most browsers will send one of these mimetypes.
    if (allowed.includes(file.mimetype)) return cb(null, true);

    // Some browsers may send empty/incorrect mimetype for svg.
    if (file.originalname && file.originalname.toLowerCase().endsWith(".svg")) return cb(null, true);

    return cb(new Error("Only image files are allowed"));
  },
});


