const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    const dir = "./cover";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (request, file, cb) => {
    cb(null, `cover-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Maksimal 1 MB
  fileFilter: (request, file, cb) => {
    const acceptedTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!acceptedTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
