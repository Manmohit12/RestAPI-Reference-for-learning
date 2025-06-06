import express from 'express';
import { logReqRes } from "./middlewares/index.js";
import userRouter from "./routes/user.js"
import { connectMongoDB } from "./connection.js"
const app = express();
const port = 8000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connection
connectMongoDB("mongodb://127.0.0.1:27017/apnaApp-1").then(()=>{
   console.log("MongoDB connected")
})


app.use('log.txt', logReqRes);

// Routes
app.use('/api/users',userRouter)

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});