import app from "./app.js";
import "./database.js";
import "colors";


app.listen(app.get("PORT"),()=>{
    try{
        console.log(` This server is running on http://localhost:${app.get("PORT")} `.bgYellow.black.bold);
        console.log("Made by EumT07".bgGreen);
    }catch(err){
        console.log(`There is an Error started app: ${err}`.bgRed);
    }
})