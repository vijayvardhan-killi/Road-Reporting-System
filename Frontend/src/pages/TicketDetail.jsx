import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth/authcontext";
import { getTicketById, updateTicket } from "@/api/ticket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/Ticket/StatusBadge";
import { toast } from "sonner";

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const isOwner = ticket && user?.id === (ticket.user?._id || ticket.user);
  const isStaff = user?.role === "admin" || user?.role === "superadmin";

  const load = () => {
    setLoading(true);
    getTicketById(id)
      .then(setTicket)
      .catch((err) => setError(err.response?.data?.message || "Ticket not found"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleFieldSave = async (field, value) => {
    setSaving(true);
    try {
      const updated = await updateTicket(id, { [field]: value });
      setTicket(updated);
      toast("Ticket updated");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to update ticket");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-muted-foreground">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!ticket) return null;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </Button>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">{ticket.title}</CardTitle>
          <StatusBadge status={ticket.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          {ticket.photoUrl && (
            <img src={ticket.photoUrl} alt={ticket.title} className="rounded-md max-h-64 w-full object-cover" />
          )}

          <div>
            <Label>Description</Label>
            <p className="mt-1 text-sm">{ticket.description}</p>
          </div>

          <div>
            <Label>Location</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {ticket.location?.coordinates?.[1]}, {ticket.location?.coordinates?.[0]}
            </p>
          </div>

          <div>
            <Label>Reported</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>

          {isStaff && (
            <div>
              <Label htmlFor="status">Update status</Label>
              <select
                id="status"
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                value={ticket.status}
                disabled={saving}
                onChange={(e) => handleFieldSave("status", e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          )}

          {isOwner && ticket.status === "open" && (
            <EditableOwnerFields ticket={ticket} saving={saving} onSave={handleFieldSave} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const EditableOwnerFields = ({ ticket, saving, onSave }) => {
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);

  return (
    <div className="space-y-3 border-t pt-4">
      <div>
        <Label htmlFor="title">Edit title</Label>
        <Input id="title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="description">Edit description</Label>
        <Textarea id="description" className="mt-2" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button
        disabled={saving}
        onClick={() => {
          if (title !== ticket.title) onSave("title", title);
          if (description !== ticket.description) onSave("description", description);
        }}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default TicketDetail;
