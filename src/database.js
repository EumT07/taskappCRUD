import Mongoose from "mongoose";
import "colors";
const mongoURL = process.env.MONGO_URL;

try {
    const dataBase = await Mongoose.connect(mongoURL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4
    });
    console.log("DataBase is connected to: ".bgBlue, dataBase.connection.name);
} catch (error) {
    console.log("Erro Connection data base: ".red.bold, error.message);
}