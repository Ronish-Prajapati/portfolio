/**
 * Homepage sections in route order. Shared by the header, the waypoint rail
 * and the hero route so navigation, anchors and labels never drift apart.
 * `id` values are the public anchors (kept stable for links and SEO).
 */
export interface SectionWaypoint {
  id: string;
  /** Expedition-style name shown on the waypoint rail. */
  waypoint: string;
  /** Plain label for the header navigation (omitted = not in the header). */
  nav?: string;
}

export const SECTIONS: SectionWaypoint[] = [
  { id: "trailhead", waypoint: "Trailhead" },
  { id: "projects", waypoint: "Expeditions", nav: "Projects" },
  { id: "experience", waypoint: "The climb", nav: "Experience" },
  { id: "about", waypoint: "Beyond the screen", nav: "About" },
  { id: "stack", waypoint: "Technical terrain", nav: "Stack" },
  { id: "testimonials", waypoint: "Testimonials" },
  { id: "contact", waypoint: "Summit", nav: "Contact" },
];

export const CTA = {
  work: "Selected work",
  contact: "Get in touch",
  resume: "Résumé",
} as const;
