import { useEffect, useState } from "react";
import { getLeaderboard } from "@/api/leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const medal = ["🥇", "🥈", "🥉"];

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(setUsers)
      .catch(() => setError("Failed to load leaderboard"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-2">Top Reporters</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Civilians earn points every time a road issue they report gets resolved. Top 3 are honoured each cycle.
      </p>

      {loading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!loading && users.length === 0 && (
            <p className="text-sm text-muted-foreground">No points earned yet — be the first!</p>
          )}
          {users.map((u, i) => (
            <div
              key={u._id}
              className={`flex items-center justify-between rounded-md border p-3 ${i < 3 ? "bg-accent/60" : ""}`}
            >
              <span className="font-medium">
                {i < 3 ? medal[i] : `#${i + 1}`} {u.name}
              </span>
              <span className="text-sm text-muted-foreground">{u.points} pts</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
