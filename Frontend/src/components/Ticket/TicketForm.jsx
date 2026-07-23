import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createTicket } from "@/api/ticket";
import MapPicker from "@/components/Ticket/MapPicker";
import { AuthContext } from "@/context/auth/authcontext";
import { useNavigate } from "react-router-dom";

const TicketForm = () => {
  const { loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [photos, setPhotos] = useState([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [riskRating, setRiskRating] = useState(5);
  const [isAnonymous, setIsAnonymous] = useState(!loggedIn);
  const [reporterPhone, setReporterPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coordinates.lat || !coordinates.lng) {
      toast("Please pick the location on the map first");
      return;
    }
    if (isAnonymous && !reporterPhone) {
      toast("A phone number is required for anonymous reports");
      return;
    }

    setSubmitting(true);
    try {
      await createTicket({
        title,
        description,
        coordinates,
        photos,
        riskRating,
        isAnonymous,
        reporterPhone: isAnonymous ? reporterPhone : undefined,
      });

      toast("Your issue is submitted successfully", {
        description:
          new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "2-digit",
          }) +
          " at " +
          new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
      });

      if (loggedIn) {
        navigate("/my-tickets");
      } else {
        setTitle("");
        setDescription("");
        setCoordinates({ lat: "", lng: "" });
        setPhotos([]);
        setReporterPhone("");
      }
    } catch (err) {
      toast(err.response?.data?.message || "Failed to submit issue, please try again");
    } finally {
      setSubmitting(false);
    }
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

        {!loggedIn && (
          <div className="rounded-md border bg-accent/50 p-3 flex items-center justify-between">
            <div>
              <Label htmlFor="anonymous" className="font-medium">Report anonymously</Label>
              <p className="text-xs text-muted-foreground">No account needed — we'll just need a phone number for follow-up.</p>
            </div>
            <input
              id="anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4"
            />
          </div>
        )}

        {isAnonymous && (
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              className="mt-2"
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              required
            />
          </div>
        )}

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
            minLength={20}
            required
          />
        </div>

        <div>
          <Label htmlFor="risk">Risk Level: {riskRating} / 10</Label>
          <input
            id="risk"
            type="range"
            min={1}
            max={10}
            value={riskRating}
            onChange={(e) => setRiskRating(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minor</span>
            <span>Hazardous</span>
          </div>
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

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default TicketForm;
