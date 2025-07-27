import Area from '../models/area.model.js';

// function to find nearest area authority
export const findNearByAuthority=async (location)=>{
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
    
    }
  }
});
return nearestArea;
  }catch(err){
    return err;
  }


}

