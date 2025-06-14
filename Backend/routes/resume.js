import express from "express";
import multer from "multer";
import fs from "fs"; // Add this import
import { resumeAnalyzer } from "../controllers/resumeController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  }, 
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

console.log("app is working until now") 
// router.post("/analyze", upload.single("resumefile"), (req,res)=>{
//     res.json(req.file)
// });
router.post("/analyze", upload.single("resumefile"),resumeAnalyzer);

export default router;