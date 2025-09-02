import { MapPin , Camera , ShieldCheck , BarChart3 , Users , CheckCircle2  } from "lucide-react";
import { Card , CardHeader , CardDescription , CardTitle } from "./ui/card";

const Features = () => {
  const items = [
    {
      icon: <MapPin className="h-4 w-4" aria-hidden="true" />,
      title: "Citizen Road Reporting",
      desc: "Report potholes, cracks, and hazards with precise GPS.",
    },
    {
      icon: <Camera className="h-4 w-4" aria-hidden="true" />,
      title: "Photo Evidence",
      desc: "Attach photos so authorities can verify and prioritize.",
    },
    {
      icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />,
      title: "Smart Assignment",
      desc: "Automatic routing to the right department.",
    },
    {
      icon: <BarChart3 className="h-4 w-4" aria-hidden="true" />,
      title: "Authority Dashboard",
      desc: "Analytics for workload, response time, and hotspots.",
    },
    {
      icon: <Users className="h-4 w-4" aria-hidden="true" />,
      title: "Contributor Ranking",
      desc: "Earn points, badges, and climb the leaderboard.",
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
      title: "Annual Reports",
      desc: "Share community progress with transparent insights.",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">
          Key features
        </h2>
        <p className="text-muted-foreground">
          Everything you need to report, resolve, and improve roads.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it, i) => (
          <Card key={i} className="h-full">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {it.icon}
                </span>
                <CardTitle className="text-lg">{it.title}</CardTitle>
              </div>
              <CardDescription>{it.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
