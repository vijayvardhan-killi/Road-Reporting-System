import { useEffect, useState } from "react";
import { getAnnualReport } from "@/api/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const currentYear = new Date().getFullYear();

const downloadCsv = (report) => {
  const rows = [
    ["Year", report.year],
    ["Total Tickets", report.totalTickets],
    ["Resolved Tickets", report.resolvedTickets],
    ["Average Risk Rating", report.avgRiskRating ?? "N/A"],
    ["Average Resolution Time (days)", report.avgResolutionDays ?? "N/A"],
    [],
    ["Area", "Ticket Count", "Average Risk Rating"],
    ...report.areaBreakdown.map((a) => [a.areaName, a.ticketCount, a.avgRiskRating ?? "N/A"]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `road-report-${report.year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const AnnualReport = () => {
  const [year, setYear] = useState(currentYear);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAnnualReport(year)
      .then(setReport)
      .catch((err) => setError(err.response?.data?.message || "Failed to load report"))
      .finally(() => setLoading(false));
  }, [year]);

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Annual Report</h1>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {report && (
            <Button variant="outline" onClick={() => downloadCsv(report)}>
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {loading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {report && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">{report.totalTickets}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">{report.resolvedTickets}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg Risk Rating</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">{report.avgRiskRating ?? "—"}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg Resolution (days)</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">{report.avgResolutionDays ?? "—"}</p></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Breakdown by Area — Renovation Priority</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {report.areaBreakdown.length === 0 && (
                <p className="text-sm text-muted-foreground">No tickets recorded for {year}.</p>
              )}
              {report.areaBreakdown.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-3">
                  <span className="font-medium">{a.areaName}</span>
                  <span className="text-sm text-muted-foreground">
                    {a.ticketCount} tickets · avg risk {a.avgRiskRating ?? "N/A"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnnualReport;
