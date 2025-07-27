import { api } from ".";

const routePrefix = "/tickets";

//Arrow function to call api for creating ticket to raise issue.
//tested and working properly.

export const createTicket= async (ticket)=>{
    try{
        
        const response=await api.post(`${routePrefix}/`,{
            title:ticket.title,
            location:{
                type:"Point",
                coordinates:[parseFloat(ticket.coordinates.lat.toFixed(4)),parseFloat(ticket.coordinates.lng.toFixed(4))]
            },
            description:ticket.description,
            photoUrl:"xxxx"
        });
        console.log(response);
        

    }catch(error){
        console.log("Ticket Creation Error : ", error.response?.data || error.message);
        throw error;
    }

}