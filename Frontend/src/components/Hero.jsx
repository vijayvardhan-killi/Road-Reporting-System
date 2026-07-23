import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"
const Hero = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <Badge variant="secondary" className="text-secondary-foreground">
            Trusted civic reporting
          </Badge>
          <h1 className="text-pretty text-3xl font-semibold leading-tight md:text-4xl">
            Report roads. Get them fixed faster.
          </h1>
          <p className="max-w-prose text-muted-foreground">
            RoadCare is a citizen-powered road management platform. Report issues with a photo and location, and track
            progress from submission to resolution.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link to={"ticket"} href="#report">Report an Issue</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#demo">View Live Demo</Link>
            </Button>
          </div>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" /> GPS-powered reports
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" /> Smart ticket routing
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" /> Contributor ranks
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" /> Transparent tracking
            </li>
          </ul>
        </div>
        <div className="order-first md:order-last">
          <div className="overflow-hidden rounded-lg border bg-card">
            <img
              src="./hero.jpg"
              alt="RoadCare hero illustration of a city map and road markers"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
