import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userRoute } from "./routes/userRoute.js"
import { residencyRoute } from "./routes/residencyRoute.js"
import commentRoutes from "./routes/commentRoutes.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000;

app.use(express.json())
app.use(cookieParser())
app.use(cors())

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Hata:', err);
    res.status(500).json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

app.use("/api/user", userRoute)
app.use("/api/residency", residencyRoute)
app.use("/api/comments", commentRoutes)