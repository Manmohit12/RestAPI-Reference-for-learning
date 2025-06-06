import fs from "fs";


 async function logReqRes(filename){
    return(req,res,next)=>{
        fs.appendFile(filename, `\n${Date.now()}: ${req.method} ${req.path}`, (err) => {
            if (err) console.error("Logging error:", err);
            next();
         });
    }
 }
export { logReqRes };
