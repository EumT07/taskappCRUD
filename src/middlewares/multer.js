import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {v4 as uuidv4} from "uuid";

/** __Filename:  root-file */
const __filename = fileURLToPath(import.meta.url);
/** __Dirname: root:folder  */
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    //Path Upload
    destination: path.join(__dirname, "../public/uploads"),
    filename: (req, file, cb, filename) =>{
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req,file,cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extension = filetypes.test(path.extname(file.originalname));
        if(mimetype && extension){
            return cb(null,true)
        }
        cb(null, true)
    }

}).single("image");

export default upload;