import {districts} from '../data/districts.js';
import Area from '../models/area.model.js';


// fuction to insert area points
 async function insertDistricts() {
  try {
    // await Area.deleteMany();
    const formatted = districts.map(d => ({
      name: d.name,
      location: {
        type: "Point",
        coordinates: d.coordinates
      },
      authority: d.authority
    }));

    const result = await Area.insertMany(formatted);
    console.log(` Inserted successfully ${result.length}`);
  } catch (err) {
    console.error(" Error inserting:", err);
  } 
}


// function to find nearest area authority
const findNearByAuthority=async function(location){
  if (
    !location ||
    location.type !== "Point" ||
    !Array.isArray(location.coordinates)
  ) {
    throw new Error("Invalid coordinates object");
  }
  try{
    const nearestArea = await Area.findOne({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: location.coordinates,
      },
      $maxDistance: 10000 
    }
  }
});
return nearestArea;
  }catch(err){
    return err;
  }


}



export  {insertDistricts,findNearByAuthority};