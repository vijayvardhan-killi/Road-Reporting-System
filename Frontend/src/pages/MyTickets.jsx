import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/auth/authcontext";
import { getTicketsByUser } from "@/api/ticket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/Ticket/StatusBadge";

const MyTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    getTicketsByUser(user.id)
      .then(setTickets)
      .catch((err) => setError(err.response?.data?.message || "Failed to load tickets"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Reported Issues</h1>
        <Button asChild>
          <Link to="/ticket">+ Report an Issue</Link>
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            You haven't reported any issues yet.
          </CardContent>
        </Card>
      )}

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
                <p className="text-xs text-muted-foreground mt-2">
                  Reported {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
