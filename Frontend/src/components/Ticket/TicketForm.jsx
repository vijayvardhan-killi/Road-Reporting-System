//This file contains form to get data from user to raise issue.
//Tested and working properly.
//photo upload is optional.

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react";
import { createTicket } from "@/api/ticket";
import MapPicker from "@/components/Ticket/MapPicker";


const TicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [photos, setPhotos] = useState([]);
  const [mapOpen, setMapOpen] = useState(false);

  const handlePhotoChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };
  //function to handle data after submitting.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      coordinates,
      photos,
    };
    const response = await createTicket(data);
    

    toast("Your Issue is submitted Successfully", {
          description: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: '2-digit'
        }) + " at " + new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        // action: {
        //   label: <CheckCircle className="text-green-500 w-5 h-5" />, // ✅ green tick icon
        //   onClick: () => {} // No action needed for a tick
        // },
          
        })
    
    console.log("Form Data:", response);
    // alert("Form submitted! Check console for data.");
  };

  return (
    <div>
      <MapPicker
        open={mapOpen}
        onOpenChange={setMapOpen}
        setCoords={(coords) => setCoordinates(coords)}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-xl p-6 shadow-xl rounded-2xl bg-white"
      >
        <h2 className="text-3xl font-bold mb-4 text-center">Report Issue</h2>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            className="mt-2"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            className="mt-2"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Location</Label>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Input
              id="lat"
              value={coordinates.lat}
              disabled
              placeholder="Latitude"
              className="flex-1 min-w-[120px]"
            />
            <Input
              id="lng"
              value={coordinates.lng}
              disabled
              placeholder="Longitude"
              className="flex-1 min-w-[120px]"
            />
            <div className="ml-auto">
              <Button type="button" onClick={() => setMapOpen(true)}>
                Pick Location
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="photos">Upload Photos (optional)</Label>
          <Input
            className="mt-2"
            id="photos"
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handlePhotoChange}
          />
        </div>

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default TicketForm;
