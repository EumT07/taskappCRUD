import * as dotenv from "dotenv";
import User from "../models/user.js";
import Role from "../models/roles.js";
import util from "util";
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";


//Timesleep
const sleep = util.promisify(setTimeout);

//Creating Roles
export const createRoles = async () => {
    try {
        //count if exist or not roles
        const countRoles = await Role.estimatedDocumentCount();

        //Exist or not
        if ( countRoles > 0) return;

        //Creating roles by defaults
        const rolesByDefault = await Promise.all([
            new Role({name:"admin"}).save(),
            new Role({name:"user"}).save()
        ])
        console.log("All Roles were created",rolesByDefault);
    } catch (error) {
        console.log("There is an error: controllers/admin -> roles ", error);
    }
};
//Creating Admin user
export const adminRole = async (req,res)=>{
    try {
        const email = process.env.admin_default_Email;
        const username = process.env.admin_default_username;
        const password = process.env.admin_default_pasword;

        //Sleep 1minute seg in ordeer to wait the app start
        await sleep(60000);

        const user = await User.findOne({email: email});

        //check is admin was created
        if(user) return;

        //Create admin role
        const getRoles = await Role.find({name: {$in: ["admin","user"]}});

        //Admin
        const newAdmin = await User.create({
            username: username,
            email: email,
            password: await User.encryptPassword(password),
            roles: getRoles.map((role)=>role._id)
        });
        // await insertRandomUser();
        console.log("User: Admin  was created",newAdmin);
    } catch (error) {
        console.log("There is an error: controllers/admin -> adminRole ", error);
    }
};


//Inserting data to have more details on admin panel control
const insertRandomUser = async (req, res) => {
    /** __Filename:  root-file */
    const __filename = fileURLToPath(import.meta.url);
    /** __Dirname: root:folder  */
    const __dirname = path.dirname(__filename);
    const jsonPath = path.join(__dirname, "../public/json/user.json");


    //Getting files
    let users =  fs.readFileSync(jsonPath, "utf-8");
    const userJson = JSON.parse(users);

    //roles
    const role = await Role.find({name:"user"});
   
    userJson.forEach( async (user) => {
        let newPAssword = "123456.user"

        let hashingPasswords = await User.encryptPassword(newPAssword);

        let randomTask = Math.floor(Math.random() * 20) + 1;

        const userObjet = {
            username: user.username,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            password: hashingPasswords,
            country: user.country,
            gender: user.gender,
            totalTasks: randomTask,
            role: [role._id]
        }

        await User.create(userObjet);
    });

}