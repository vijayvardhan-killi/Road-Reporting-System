import Area from "../models/area.model.js"

const locs = [
    { "name": "Kukatpally", "coordinates": [78.4138, 17.4949] },
    { "name": "Madhapur", "coordinates": [78.3867, 17.4480] },
    { "name": "Dilsukhnagar", "coordinates": [78.5241, 17.3686] }
  ]
  

for (const item of locs) {
    await Area.create({
        name: item.name ,
        location : {
            type : 'Point',
            coordinates : item.coordinates
        },
        authority : 
    })
}