import multer from "multer";
import fs from "fs";
import crypto from "crypto";
import { ApplicationError } from "../error-handler/applicationEror.js";

// Only these image types are accepted; the value is the extension we force on disk.
const ALLOWED = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync("./uploads/", { recursive: true });
        cb(null, "./uploads/");
    },
    // Generate the filename ourselves — never trust file.originalname (path/injection),
    // and force an image extension derived from the (whitelisted) mime type.
    filename: (req, file, cb) => {
        const ext = ALLOWED[file.mimetype] || "bin";
        cb(null, `${crypto.randomUUID()}.${ext}`);
    },
});

// Reject anything that isn't a whitelisted image type.
const fileFilter = (req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    cb(new ApplicationError("only image files (jpg, png, webp, gif) are allowed", 400), false);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2 MB, single file
});
