import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // ---------------------------------------------------------------------------
  // Admin user (from env)
  // ---------------------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const adminName = process.env.ADMIN_NAME ?? "Ronish Prajapati";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName },
    create: { email: adminEmail, passwordHash, name: adminName },
  });
  console.log(`✓ Admin user: ${adminEmail}`);

  // ---------------------------------------------------------------------------
  // Profile (Hero / About / Footer) — mirrors current hardcoded content
  // ---------------------------------------------------------------------------
  const profileData = {
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
      "Laravel",
    ],
    profileImage: null,
    resumeUrl: "/ronish-frontend.pdf",
    githubUrl: "https://github.com/Ronish-Prajapati",
    linkedinUrl: "https://www.linkedin.com/in/ronish-prajapati-116abb26a/",
    email: "ronishprajapati0@gmail.com",
    phone: null,
    heroGreeting: "Hello, I'm Ronish Prajapati",
    heroHeadline: "Frontend developer building with",
    heroHighlight: "React",
    heroSubtitle:
      "I craft responsive, performant web applications using React, TypeScript, and modern frontend technologies. Passionate about clean code and great user experiences.",
    heroImage: "/images/hero-developer.png",
  };

  const existingProfile = await prisma.profile.findFirst();
  if (existingProfile) {
    await prisma.profile.update({ where: { id: existingProfile.id }, data: profileData });
  } else {
    await prisma.profile.create({ data: profileData });
  }
  console.log("✓ Profile");

  // ---------------------------------------------------------------------------
  // Skills (About "What I Do" cards)
  // ---------------------------------------------------------------------------
  const skills = [
    {
      name: "React & TypeScript",
      category: "Frontend",
      icon: "Code2",
      description:
        "Building type-safe, component-based applications with modern React patterns and hooks.",
      proficiency: 90,
      order: 1,
    },
    {
      name: "Responsive Design",
      category: "Frontend",
      icon: "Layout",
      description:
        "Creating fluid layouts that work seamlessly across all devices and screen sizes.",
      proficiency: 88,
      order: 2,
    },
    {
      name: "Performance Focused",
      category: "Engineering",
      icon: "Zap",
      description:
        "Optimizing bundle sizes, lazy loading, and ensuring fast load times.",
      proficiency: 85,
      order: 3,
    },
    {
      name: "Modern Tooling",
      category: "Engineering",
      icon: "Sparkles",
      description:
        "Proficient with Vite, Tailwind CSS, Git, and modern development workflows.",
      proficiency: 85,
      order: 4,
    },
  ];
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({ data: skills });
  console.log(`✓ ${skills.length} skills`);

  // ---------------------------------------------------------------------------
  // Experience
  // ---------------------------------------------------------------------------
  const experiences = [
    {
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
      current: false,
      order: 1,
    },
    {
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
      current: true,
      order: 2,
    },
  ];
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({ data: experiences });
  console.log(`✓ ${experiences.length} experiences`);

  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------
  const projects = [
    {
      title: "Project Tracking & Reporting System",
      slug: "project-tracking-reporting-system",
      description:
        "A fully responsive system for tracking project progress, tender requests, and reporting for local governing bodies.",
      longDescription:
        "A production-level project tracking and reporting system built using React and Inertia.js, integrated with a Laravel backend. The system enables local-level governing bodies to monitor project status, tender requests, and progress reports. I worked primarily on the frontend, developing responsive dashboard and home page interfaces with a strong focus on usability and data visualization.",
      image: "/images/pts.png",
      technologies: ["React", "Inertia.js", "JavaScript", "Laravel", "Tailwind CSS"],
      features: [
        "Responsive dashboard for project progress tracking",
        "Tender request and reporting interfaces",
        "Real-time project status visualization",
        "Optimized UI for local government workflows",
        "Cross-browser compatible and mobile-friendly design",
      ],
      liveLink: "https://pts.waveplus.com.np",
      githubLink: "",
      year: "2024",
      featured: true,
      order: 1,
    },
    {
      title: "Curly Belle E-Commerce Platform",
      slug: "curly-belle-ecommerce",
      description:
        "A full-featured e-commerce platform with product management, secure checkout, and admin reporting.",
      longDescription:
        "An e-commerce platform built using React and Laravel. The public-facing home pages were implemented using Laravel Blade components for improved SEO, while the admin dashboard was developed in React for a dynamic and interactive experience. The system includes product listings, cart and checkout flow, and complex admin features such as challani, lot management, stock adjustment, warehousing, and ledger reporting.",
      image: "/images/curly.png",
      technologies: ["React", "Laravel", "Blade", "JavaScript", "Tailwind CSS", "MySQL"],
      features: [
        "Product listings with cart and secure checkout",
        "SEO-optimized home pages using Blade components",
        "React-based admin dashboard for monitoring and reports",
        "Challani, lot management, and stock adjustment modules",
        "Warehousing and ledger tracking system",
      ],
      liveLink: "https://curlybelleco.com/",
      githubLink: "",
      year: "2025",
      featured: true,
      order: 2,
    },
    {
      title: "Soheto – E-commerce Platform",
      slug: "soheto-ecommerce-platform",
      description:
        "A fully functional e-commerce platform developed for Soheto with integrated inventory and order management.",
      longDescription:
        "A modern and scalable e-commerce platform developed for Soheto. Built using Laravel and React, the system delivers a fast, secure, and user-friendly shopping experience. It includes a powerful inventory management system with real-time stock tracking, seamless product and order handling, and a responsive UI optimized for performance and SEO.",
      image: "/images/soheto.png",
      technologies: ["Laravel", "React", "MySQL", "Tailwind CSS"],
      features: [
        "Custom Laravel + React development",
        "Fully functional e-commerce store",
        "Inventory management system",
        "Product and order management",
        "Real-time stock tracking",
        "Mobile-friendly and SEO optimized",
      ],
      liveLink: "https://soheto.com.np",
      githubLink: "",
      year: "2025",
      featured: true,
      order: 3,
    },
  ];
  await prisma.project.deleteMany();
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`✓ ${projects.length} projects`);

  // ---------------------------------------------------------------------------
  // Education (new section — sensible defaults, editable in admin)
  // ---------------------------------------------------------------------------
  const education = [
    {
      institution: "Tribhuvan University",
      degree: "Bachelor in Computer Application (BCA)",
      description:
        "Studied core computer science fundamentals including data structures, databases, web technologies, and software engineering.",
      startYear: "2021",
      endYear: "2025",
      order: 1,
    },
  ];
  await prisma.education.deleteMany();
  await prisma.education.createMany({ data: education });
  console.log(`✓ ${education.length} education entries`);

  // ---------------------------------------------------------------------------
  // Testimonials (new section — sample, editable in admin)
  // ---------------------------------------------------------------------------
  const testimonials = [
    {
      name: "Team Lead",
      role: "Waveplus IT",
      message:
        "Ronish consistently delivers clean, responsive interfaces and collaborates well with the backend team. A reliable and fast-learning frontend developer.",
      image: null,
      order: 1,
    },
  ];
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({ data: testimonials });
  console.log(`✓ ${testimonials.length} testimonials`);

  // ---------------------------------------------------------------------------
  // Blog (new section — one welcome post, editable in admin)
  // ---------------------------------------------------------------------------
  const blogs = [
    {
      title: "Welcome to my new dynamic portfolio",
      slug: "welcome-to-my-new-dynamic-portfolio",
      excerpt:
        "I rebuilt my portfolio with Next.js, Prisma and a full admin panel. Here's what changed and why.",
      content:
        "I migrated my portfolio from a static Vite + React app to a fully dynamic Next.js application backed by a PostgreSQL database. Every section — projects, experience, skills, and more — is now editable from a secure admin panel without touching code.\n\nThis post is managed entirely from the new CMS. Stay tuned for write-ups on React, TypeScript, and the projects I build.",
      thumbnail: null,
      published: true,
    },
  ];
  await prisma.blog.deleteMany();
  await prisma.blog.createMany({ data: blogs });
  console.log(`✓ ${blogs.length} blog posts`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
