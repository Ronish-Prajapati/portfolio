import type { Profile } from "@prisma/client";
import HeroLandscape from "@/components/landscape/HeroLandscape";
import { SECTIONS } from "@/lib/sections";

interface HeroProps {
  profile: Profile | null;
}

const waypoint = (id: string) => SECTIONS.find((s) => s.id === id)?.waypoint ?? id;

const Hero = ({ profile }: HeroProps) => {
  const name = profile?.name?.trim() || "Ronish Prajapati";
  const [firstName, ...rest] = name.split(/\s+/);
  const roleLead = profile?.heroHeadline?.trim() || profile?.title || "Frontend developer";
  const roleHighlight = profile?.heroHighlight?.trim() || null;

  return (
    <HeroLandscape
      firstName={firstName}
      lastName={rest.join(" ")}
      roleLead={roleLead}
      roleHighlight={roleHighlight}
      waypoints={[
        { href: "#projects", label: waypoint("projects"), at: 0.3 },
        { href: "#experience", label: waypoint("experience"), at: 0.64 },
        { href: "#contact", label: waypoint("contact"), at: 1 },
      ]}
    />
  );
};

export default Hero;
