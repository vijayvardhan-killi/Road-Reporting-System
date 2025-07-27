import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


//This file contains a dialog component to pick location coordinates by user.
//tested and working properly.

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function ResizeMapOnOpen({ open }) {
  const map = useMap();
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }
  }, [open, map]);
  return null;
}

export default function MapPicker({ open, onOpenChange, setCoords }) {
  const [selected, setSelected] = useState(null);

  const handleConfirm = () => {
    if (selected) {
      setCoords({ lat: selected.lat, lng: selected.lng });
      onOpenChange(false); // close dialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-4 flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Location on Map</DialogTitle>
        </DialogHeader>

        <div className="flex-1 w-full">
          <MapContainer
            center={[17.385044, 78.486671]}
            zoom={7}
            scrollWheelZoom
            className="h-full w-full rounded-md z-0"
          >
            <ResizeMapOnOpen open={open} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker position={selected} setPosition={setSelected} />
          </MapContainer>
        </div>

        <DialogFooter className="pt-4">
          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className="w-full"
          >
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
