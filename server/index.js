import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js";

//! CONFIG
const __filename = fileURLToPath(import.meta.url); //only with <type: module> in package.json
const __dirname = path.dirname(__filename); //only with <type: module> in package.json
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan);
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb" }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//! STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//! ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register);

//! ROUTES
app.use("/auth", authRoutes);

//! MONGOOSE SETUP
const PORT = process.env.PORT || 3001 || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log("Server started on port", PORT));
  })
  .catch((error) => {
    console.log(error, "did not connect");
  });
