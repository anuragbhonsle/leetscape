import { Code2, Github, Twitter, Heart } from "lucide-react"
import { Link } from "react-router-dom"

const footerLinks = [
  { name: "About", href: "/about" },
  { name: "GitHub Repo", href: "https://github.com" },
  { name: "Privacy", href: "/privacy" },
  { name: "Feedback", href: "/feedback" }
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">LeetScape</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your personal LeetCode companion for focused interview preparation and skill development.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Connect</h4>
            <div className="flex space-x-3">
              <a 
                href="https://github.com" 
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:bg-primary-soft transition-smooth"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:bg-primary-soft transition-smooth"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Status</h4>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-destructive fill-current" />
              <span>for developers</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 LeetScape. Not affiliated with LeetCode. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}