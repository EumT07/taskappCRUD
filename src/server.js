/** Start App
 * @module Server
 */
/** Import app file */
import app from "./app.js";
/** Import database file */
import "./database.js";
import "colors";

/** Run our API in PORT : 3000 */
app.listen(app.get("PORT"),()=>{
    try{
        console.log(` This server is running on http://localhost:${app.get("PORT")} `.bgYellow.black.bold);
        console.log("Made by EumT07".bgGreen);
    }catch(err){
        console.log(`There is an Error started app: ${err}`.bgRed);
    }
})