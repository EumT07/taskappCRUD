import * as dotenv from "dotenv";
import User from "../models/user.js";
import Role from "../models/roles.js";
import util from "util";

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
        console.log("User: Admin  was created",newAdmin);
    } catch (error) {
        console.log("There is an error: controllers/admin -> adminRole ", error);
    }
};