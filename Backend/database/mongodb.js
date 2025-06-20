import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

const connectToDataBase = async () => {
    try{
        // console.log(DB_URI)
        await mongoose.connect(DB_URI);
        console.log(`connected to database`)
    }catch(error) {
        console.log("Error connecting to Database :" , error);
        process.exit(1);
    }
}


export default connectToDataBase ;