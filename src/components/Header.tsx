import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  const navLinks = [
    { href: "/#about", label: "About" },
    { href: "/#experience", label: "Experience" },
    { href: "/#projects", label: "Projects" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-soft"
          : isHomePage
          ? "bg-transparent"
          : "bg-background border-b border-border"
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className={`text-xl font-bold tracking-tight transition-colors ${
              isScrolled || !isHomePage ? "text-foreground" : "text-hero-foreground"
            }`}
          >
            Ronish<span className="text-accent">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isScrolled || !isHomePage
                    ? "text-muted-foreground"
                    : "text-hero-muted hover:text-hero-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Button
              variant={isScrolled || !isHomePage ? "default" : "hero"}
              size="sm"
              asChild
            >
              <a href="mailto:ronishprajapati0@gmail.com">Hire Me</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${
              isScrolled || !isHomePage ? "text-foreground" : "text-hero-foreground"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background animate-fade-in">
            <div className="flex flex-col gap-4 px-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button variant="default" size="sm" className="w-fit" asChild>
                <a href="mailto:ronishprajapati0@gmail.com">Hire Me</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
