import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'./uploads/');
    },
    filename:(req, file, cb)=>{
        console.log(file);
        const uniqueName = new Date().toISOString().replace(/:/g, '-') + file.originalname;
        cb(null, uniqueName);    },
});

export const upload = multer({
    storage: storage,
});
