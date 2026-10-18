import type {
  Blog,
  Education,
  Experience,
  GalleryImage,
  Profile,
  Project,
  Skill,
  Testimonial,
} from "@prisma/client";

/**
 * Snapshot of the published portfolio content (taken October 2026).
 *
 * Used ONLY when the database cannot be reached (local development without
 * credentials, or a database outage) so public pages never render empty.
 * When the database responds, its data is always authoritative, including
 * empty lists. Edit content in the admin panel, not here.
 */

const stamp = new Date("2026-06-21T00:00:00.000Z");
const timestamps = { createdAt: stamp, updatedAt: stamp };

export const profileSnapshot: Profile = {
  id: "snapshot-profile",
  name: "Ronish Prajapati",
  title: "Frontend Developer",
  shortDescription:
    "I craft responsive, performant web applications using React, TypeScript, and modern frontend technologies. Passionate about clean code and great user experiences.",
  about:
    "I'm a passionate junior frontend developer with a strong foundation in React and TypeScript. I love turning designs into pixel-perfect, interactive experiences.",
  aboutParagraphs: [
    "My journey in web development started with curiosity and has grown into a genuine passion for creating beautiful, functional applications. I'm constantly learning and improving my skills.",
    "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while reading tech blogs. I also love traveling, experiencing new cultures, and drawing inspiration from different places and people around the world.",
  ],
  techStack: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Zustand & Redux Toolkit",
    "Tanstack Query",
    "Git",
    "REST APIs",
    "Moodle LMS",
    "Laravel",
  ],
  profileImage:
    "https://res.cloudinary.com/dtkerqeor/image/upload/v1782030718/portfolio/vjc8cohovuu83c3iarnf.jpg",
  resumeUrl: "/ronish-frontend.pdf",
  githubUrl: "https://github.com/Ronish-Prajapati",
  linkedinUrl: "https://www.linkedin.com/in/ronish-prajapati-116abb26a/",
  email: "ronishprajapati0@gmail.com",
  phone: null,
  heroGreeting: "Hello, I'm Ronish Prajapati",
  heroHeadline: "Frontend developer",
  heroHighlight: "React",
  heroSubtitle:
    "I craft responsive, performant web applications using React, TypeScript, and modern frontend technologies. Passionate about clean code and great user experiences.",
  heroImage: "/images/hero-developer.png",
  ...timestamps,
};

export const skillsSnapshot: Skill[] = [
  {
    id: "snapshot-skill-1",
    name: "React & TypeScript",
    category: "Frontend",
    icon: "Code2",
    description:
      "Building type-safe, component-based applications with modern React patterns and hooks.",
    proficiency: 90,
    order: 1,
    ...timestamps,
  },
  {
    id: "snapshot-skill-2",
    name: "Responsive Design",
    category: "Frontend",
    icon: "Layout",
    description:
      "Creating fluid layouts that work seamlessly across all devices and screen sizes.",
    proficiency: 88,
    order: 2,
    ...timestamps,
  },
  {
    id: "snapshot-skill-3",
    name: "Performance Focused",
    category: "Engineering",
    icon: "Zap",
    description: "Optimizing bundle sizes, lazy loading, and ensuring fast load times.",
    proficiency: 85,
    order: 3,
    ...timestamps,
  },
  {
    id: "snapshot-skill-4",
    name: "Modern Tooling",
    category: "Engineering",
    icon: "Sparkles",
    description: "Proficient with Vite, Tailwind CSS, Git, and modern development workflows.",
    proficiency: 85,
    order: 4,
    ...timestamps,
  },
];

export const experiencesSnapshot: Experience[] = [
  {
    id: "cmqni4gn30005v6x4k4oi72m3",
    position: "Full Stack Developer Intern (Laravel & React)",
    company: "Waveplus IT",
    location: "On-site",
    period: "April 2024 - June 2024",
    description:
      "Completed a 3-month internship as a Full Stack Developer, gaining hands-on experience in developing and maintaining web applications using Laravel and React.",
    highlights: [
      "Developed and maintained full-stack features using Laravel for backend APIs and React for frontend interfaces",
      "Worked on database-driven applications and RESTful API integration",
      "Assisted in implementing authentication, role-based access control, and CRUD functionalities",
      "Gained real-world experience working in an agile team environment on production-level projects",
    ],
    technologies: ["Laravel", "React", "JavaScript", "PHP", "MySQL", "REST APIs", "Git"],
    startDate: null,
    endDate: null,
    current: false,
    order: 1,
    ...timestamps,
  },
  {
    id: "cmqni4gn30006v6x4904san26",
    position: "Frontend Developer (React / TypeScript)",
    company: "Waveplus IT",
    location: "On-site",
    period: "July 2024 - Present",
    description:
      "Working as a Frontend Developer building responsive and interactive user interfaces using React and TypeScript, with seamless integration to Laravel backends through Inertia.js.",
    highlights: [
      "Built responsive and interactive UIs using React (JS/TS) and Inertia.js integrated with Laravel backends",
      "Contributed to real-world projects including project tracking systems, e-commerce platforms, coworking space management, and student management applications",
      "Implemented efficient state and data management using Zustand, Redux Toolkit, and TanStack Query with mutations",
      "Collaborated closely with backend developers and designers to ensure clean UI/UX, API integration, and cross-browser compatibility",
    ],
    technologies: [
      "React",
      "TypeScript",
      "JavaScript",
      "Inertia.js",
      "Zustand",
      "Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "Laravel",
      "Git",
    ],
    startDate: null,
    endDate: null,
    current: true,
    order: 2,
    ...timestamps,
  },
];

export const projectsSnapshot: Project[] = [
  {
    id: "snapshot-project-cehrd",
    title: "CEHRD Learning Management System (LMS) – National Digital Education Platform",
    slug: "cehrd-learning-management-system-lms",
    description:
      "A Moodle-based Learning Management System developed for the Centre for Education and Human Resource Development (CEHRD), providing a centralized digital learning platform for managing courses, learners, instructors, assessments, and educational resources.",
    longDescription:
      "The CEHRD Learning Management System is a comprehensive Moodle-based e-learning platform designed to support online education and digital learning initiatives. The platform enables administrators, teachers, and students to interact through a structured learning environment with course management, learning resources, assessments, progress tracking, and communication features.\n\nThe system provides a scalable solution for delivering educational content digitally while improving accessibility, collaboration, and learning management. It includes customized configurations, theme enhancements, user role management, course organization, and LMS optimization to meet institutional requirements.\n\nThe platform supports multiple user roles, including administrators, teachers, and students, allowing efficient management of courses, enrollments, learning materials, quizzes, assignments, and learner activities. The system is optimized for usability, accessibility, and cross-browser compatibility, providing a reliable learning experience across different devices.",
    image:
      "https://res.cloudinary.com/dtkerqeor/image/upload/v1782030510/portfolio/v5decdiak9k0aywo5xwl.png",
    githubLink: "",
    liveLink: "https://learning.cehrd.gov.np/",
    role: null,
    technologies: [
      "Moodle LMS",
      "PHP",
      "MySQL",
      "HTML5",
      "CSS3",
      "JavaScript",
      "Bootstrap",
      "Moodle Plugin Architecture",
      "Linux Server Environment",
    ],
    features: [
      "Course Management",
      "Role-Based Access Control",
      "Online Assessment System",
      "Progress Tracking",
      "Digital Learning Resources",
      "Communication System",
      "Responsive Design",
      "Accessibility Support",
      "Secure User Management",
      "Customization & Optimization",
    ],
    year: "2025-2026",
    featured: true,
    order: 0,
    ...timestamps,
  },
  {
    id: "snapshot-project-pts",
    title: "Project Tracking & Reporting System",
    slug: "project-tracking-reporting-system",
    description:
      "A fully responsive system for tracking project progress, tender requests, and reporting for local governing bodies.",
    longDescription:
      "A production-level project tracking and reporting system built using React and Inertia.js, integrated with a Laravel backend. The system enables local-level governing bodies to monitor project status, tender requests, and progress reports. I worked primarily on the frontend, developing responsive dashboard and home page interfaces with a strong focus on usability and data visualization.",
    image: "/images/pts.png",
    githubLink: "",
    liveLink: "https://pts.waveplus.com.np",
    role: "Frontend: responsive dashboard and home page interfaces, with a focus on usability and data visualization.",
    technologies: ["React", "Inertia.js", "JavaScript", "Laravel", "Tailwind CSS"],
    features: [
      "Responsive dashboard for project progress tracking",
      "Tender request and reporting interfaces",
      "Real-time project status visualization",
      "Optimized UI for local government workflows",
      "Cross-browser compatible and mobile-friendly design",
    ],
    year: "2024",
    featured: true,
    order: 1,
    ...timestamps,
  },
  {
    id: "snapshot-project-curly-belle",
    title: "Curly Belle E-Commerce Platform",
    slug: "curly-belle-ecommerce",
    description:
      "A full-featured e-commerce platform with product management, secure checkout, and admin reporting.",
    longDescription:
      "An e-commerce platform built using React and Laravel. The public-facing home pages were implemented using Laravel Blade components for improved SEO, while the admin dashboard was developed in React for a dynamic and interactive experience. The system includes product listings, cart and checkout flow, and complex admin features such as challani, lot management, stock adjustment, warehousing, and ledger reporting.",
    image: "/images/curly.png",
    githubLink: "",
    liveLink: "https://curlybelleco.com/",
    role: null,
    technologies: ["React", "Laravel", "Blade", "JavaScript", "Tailwind CSS", "MySQL"],
    features: [
      "Product listings with cart and secure checkout",
      "SEO-optimized home pages using Blade components",
      "React-based admin dashboard for monitoring and reports",
      "Challani, lot management, and stock adjustment modules",
      "Warehousing and ledger tracking system",
    ],
    year: "2025",
    featured: true,
    order: 2,
    ...timestamps,
  },
  {
    id: "snapshot-project-soheto",
    title: "Soheto – E-commerce Platform",
    slug: "soheto-ecommerce-platform",
    description:
      "A fully functional e-commerce platform developed for Soheto with integrated inventory and order management.",
    longDescription:
      "A modern and scalable e-commerce platform developed for Soheto. Built using Laravel and React, the system delivers a fast, secure, and user-friendly shopping experience. It includes a powerful inventory management system with real-time stock tracking, seamless product and order handling, and a responsive UI optimized for performance and SEO.",
    image: "/images/soheto.png",
    githubLink: "",
    liveLink: "https://soheto.com.np",
    role: null,
    technologies: ["Laravel", "React", "MySQL", "Tailwind CSS"],
    features: [
      "Custom Laravel + React development",
      "Fully functional e-commerce store",
      "Inventory management system",
      "Product and order management",
      "Real-time stock tracking",
      "Mobile-friendly and SEO optimized",
    ],
    year: "2025",
    featured: true,
    order: 3,
    ...timestamps,
  },
];

export const educationSnapshot: Education[] = [
  {
    id: "snapshot-education-1",
    institution: "Tribhuvan University",
    degree: "Bachelor of Science in Computer Science and Information Technology",
    description:
      "Studied core computer science fundamentals including data structures, databases, web technologies, and software engineering.",
    startYear: "2020",
    endYear: "2024",
    order: 1,
    ...timestamps,
  },
];

export const testimonialsSnapshot: Testimonial[] = [
  {
    id: "snapshot-testimonial-1",
    name: "Nabin Singh (CTO)",
    role: "Waveplus IT",
    message:
      "Ronish consistently delivers clean, responsive interfaces and collaborates well with the backend team. A reliable and fast-learning frontend developer.",
    image:
      "https://res.cloudinary.com/dtkerqeor/image/upload/v1782030829/portfolio/jqtz39uvtzeef5qibj2q.jpg",
    order: 1,
    ...timestamps,
  },
];

export const gallerySnapshot: GalleryImage[] = [];

export const blogsSnapshot: Blog[] = [
  {
    id: "snapshot-blog-welcome",
    title: "Welcome to my new dynamic portfolio",
    slug: "welcome-to-my-new-dynamic-portfolio",
    excerpt:
      "I rebuilt my portfolio with Next.js, Prisma and a full admin panel. Here's what changed and why.",
    content:
      "I migrated my portfolio from a static Vite + React app to a fully dynamic Next.js application backed by a PostgreSQL database. Every section — projects, experience, skills, and more — is now editable from a secure admin panel without touching code.\n\nThis post is managed entirely from the new CMS. Stay tuned for write-ups on React, TypeScript, and the projects I build.",
    thumbnail: null,
    images: [],
    published: true,
    createdAt: new Date("2026-06-21T00:00:00.000Z"),
    updatedAt: new Date("2026-06-21T00:00:00.000Z"),
  },
];
