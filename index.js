import express from 'express';
import { logReqRes } from "./middlewares/index.js";
import userRouter from "./routes/user.js"
import { connectMongoDB } from "./connection.js"
import bodyParser from 'body-parser';

const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//connection
connectMongoDB("mongodb://127.0.0.1:27017/apnaApp-1", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

//To log data in a log file 
app.use('log.txt', logReqRes);

// Routes
app.use('/api/users',userRouter)
app.use('/',userRouter)



app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});