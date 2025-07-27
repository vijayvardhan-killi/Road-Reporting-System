import mongoose from "mongoose";
import bcrypt  from "bcryptjs";
// import dotenv from "dotenv";
import { districtData } from "./data/districts.js";
import User from "../models/user.model.js";
import Area from "../models/area.model.js";

// dotenv.config();
// console.log("🧪 DB_URI:", process.env.DB_URI);

// console.log(districtData)
const seedAdmins = async () => {
    try {
        const DB_URI = "" ; //DB URI should be set here, e.g., process.env.DB_URI or a direct string
        mongoose.connect(DB_URI);
        console.log("Connected to MongoDB");

        for (const district of districtData) {
            const email = `admin.${district.name.toLowerCase().replace(/\s+/g, '')}@example.com`;

            const existingUser = await User.findOne({email : email});
            if (existingUser) {
                console.log(`User with email ${district.email} already exists.`);
                continue;
            }
            
            const SALT =await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash('admin123', SALT);

            const newUser = await User.create([{
                name : `Admin ${district.name}`,
                email,
                password : hashedPassword,
                role : 'admin',
            }]);

            await Area.create([{
                name : district.name , 
                location : {
                    type : "Point",
                    coordinates : [district.coordinates[1], district.coordinates[0]]
                },
                authority : newUser[0]._id
            }]);

            console.log(`Admin for ${district.name} created successfully.`);
        }
        console.log("All admins seeded successfully.");
        process.exit(0);
    }catch (error){
        console.error("Error During Seesding:", error);
        process.exit(1);
    }
}

seedAdmins()
