import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {v4 as uuidv4} from "uuid";

/** __Filename:  root-file */
const __filename = fileURLToPath(import.meta.url);
/** __Dirname: root:folder  */
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../public/uploads"),
    filename: (req, file, cb, filename) =>{
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage}).single("image");

export default upload;