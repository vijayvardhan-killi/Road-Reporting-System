import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketsByArea } from "@/api/ticket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/Ticket/StatusBadge";

const AreaTickets = () => {
  const { areaId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTicketsByArea(areaId)
      .then(setTickets)
      .catch((err) => setError(err.response?.data?.message || "Failed to load tickets"))
      .finally(() => setLoading(false));
  }, [areaId]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-6">All Tickets in This Area</h1>
      {loading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Link key={ticket._id} to={`/tickets/${ticket._id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-lg">{ticket.title}</CardTitle>
                <StatusBadge status={ticket.status} />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AreaTickets;
