import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSuperAdminDashboard } from "@/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const SuperAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSuperAdminDashboard()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!data) return <p className="p-6 text-muted-foreground">Loading...</p>;

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Superadmin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link to="/annual-report" className="text-sm underline underline-offset-4">
            Annual Report
          </Link>
          <Link to="/tickets" className="text-sm underline underline-offset-4">
            View all tickets
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total Tickets" value={data.totalTickets} />
        <StatCard label="Resolved Tickets" value={data.resolvedTickets} />
        <StatCard label="Total Users" value={data.totalUsers} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Areas by Ticket Volume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.topAreas.length === 0 && (
            <p className="text-sm text-muted-foreground">No tickets yet.</p>
          )}
          {data.topAreas.map((area, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border p-3">
              <span className="font-medium">{area.areaName}</span>
              <span className="text-sm text-muted-foreground">{area.ticketCount} tickets</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
