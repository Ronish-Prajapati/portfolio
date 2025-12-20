import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/Ronish-Prajapati", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/ronish-prajapati-116abb26a/", label: "LinkedIn" },
    
    { icon: Mail, href: "mailto:ronishprajapati0@gmail.com", label: "Email" },
  ];

  return (
    <footer className="bg-hero py-16">
      <div className="container-custom">
        {/* CTA Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground mb-4">
            Let's build something together
          </h2>
          <p className="text-hero-muted max-w-xl mx-auto mb-8">
            I'm currently looking for new opportunities. Whether you have a project 
            in mind or just want to chat, feel free to reach out!
          </p>
          <a
            href="mailto:ronishprajapati0@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3 bg-hero-foreground text-hero rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Mail size={18} />
            Get in Touch
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-hero-foreground/10 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-hero-muted text-sm">
            © {currentYear} Ronish Prajapati. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-hero-muted hover:text-hero-foreground transition-colors"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
