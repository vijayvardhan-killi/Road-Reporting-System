import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "@/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/Ticket/StatusBadge";

const StatCard = ({ label, value }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!data) return <p className="p-6 text-muted-foreground">Loading...</p>;

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{data.area} — Admin Dashboard</h1>
        <Link to="/annual-report" className="text-sm underline underline-offset-4">
          Annual Report
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Tickets" value={data.metrics.total} />
        <StatCard label="Open" value={data.metrics.open} />
        <StatCard label="In Progress" value={data.metrics.inProgress} />
        <StatCard label="Resolved" value={data.metrics.resolved} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Tickets</CardTitle>
          <Link to={`/tickets/area/${data.areaId}`} className="text-sm underline underline-offset-4">
            View all
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentTickets.length === 0 && (
            <p className="text-sm text-muted-foreground">No tickets yet.</p>
          )}
          {data.recentTickets.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/tickets/${ticket._id}`}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-accent"
            >
              <div>
                <p className="font-medium">{ticket.title}</p>
                <p className="text-xs text-muted-foreground">{ticket.user?.name}</p>
              </div>
              <StatusBadge status={ticket.status} />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
