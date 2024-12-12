import { v2 as cloudinary } from "cloudinary"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import fileUpload from "express-fileupload"
import path from "path"

import connectDB from "./database/connectDB.js"
import answersRoutes from "./routes/answer.routes.js"
import authRoutes from "./routes/auth.routes.js"
import contestRoutes from "./routes/contest.routes.js"
import contestAnswersRoutes from "./routes/contestAnswers.routes.js"
import feedbackRoutes from "./routes/feedback.routes.js"
import notesRoutes from "./routes/notes.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import testRoutes from "./routes/test.routes.js"
import userRoutes from "./routes/user.routes.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const corsOptions = {
    origin: "https://akp-physics-ok1h.onrender.com",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/notes",notesRoutes);
app.use("/api/test",testRoutes);
app.use("/api/answers",answersRoutes);
app.use("/api/feedback",feedbackRoutes);
app.use("/api/notification",notificationRoutes);
app.use("/api/contests",contestRoutes);
app.use("/api/contest/answers",contestAnswersRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,"/frontend/dist")));

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});