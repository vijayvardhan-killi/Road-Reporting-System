import React from 'react'

const Footer = () => {
  return (
    <footer id="contact" className="mt-8 border-t">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
              R
            </span>
            <span className="font-semibold">RoadCare</span>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground">
              About
            </a>
            <a href="#contact" className="hover:text-foreground">
              Contact
            </a>
            <a href="#privacy" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} RoadCare. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
