import type { Profile, Skill } from "@prisma/client";
import { getLucideIcon } from "@/lib/icons";

interface AboutProps {
  profile: Profile | null;
  skills: Skill[];
}

const About = ({ profile, skills }: AboutProps) => {
  const aboutLead =
    profile?.about ??
    "I'm a passionate junior frontend developer with a strong foundation in React and TypeScript. I love turning designs into pixel-perfect, interactive experiences.";
  const aboutParagraphs = profile?.aboutParagraphs ?? [];
  const techStack = profile?.techStack ?? [];

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent font-mono text-sm mb-3">What I Do</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What I build and how I work
          </h2>
          <p className="text-muted-foreground">
            I focus on creating clean, maintainable code that delivers exceptional user
            experiences. Here&apos;s what I bring to the table.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const Icon = getLucideIcon(skill.icon);
            return (
              <div
                key={skill.id}
                className="group p-6 bg-card rounded-xl border border-border hover:border-accent/50 hover:shadow-elevated transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{skill.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {skill.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* About Me Text */}
        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              A bit about me
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>{aboutLead}</p>
              {aboutParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="bg-secondary rounded-2xl p-8">
            <h4 className="font-semibold text-foreground mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-background text-foreground text-sm rounded-full border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
