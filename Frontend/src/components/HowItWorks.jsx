
import { Card , CardHeader , CardTitle , CardDescription } from './ui/card'
import { Camera , ShieldCheck , TrendingUp } from 'lucide-react'

const HowItWorks = () => {
  const items = [
    {
      icon: <Camera className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Report",
      desc: "Snap a photo and pin the exact location of the road issue.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Ticket & Assign",
      desc: "A ticket is generated and routed to the responsible authority automatically.",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />,
      title: "Track & Earn",
      desc: "Monitor progress and earn points that level up your contributor rank.",
    },
  ]
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">How it works</h2>
        <p className="text-muted-foreground">Three simple steps to safer roads.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it, i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">{it.icon}</div>
              <CardTitle className="text-lg">{it.title}</CardTitle>
              <CardDescription className="text-pretty">{it.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
