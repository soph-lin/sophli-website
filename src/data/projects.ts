import { ProjectCardProps } from "@/components/project/ProjectCard";

const projects: ProjectCardProps[] = [
  {
    name: "Polyphi",
    description: "Citation automator for Submittable platform",
    tags: ["Chrome Extension", "Javascript"],
    startDate: "05/2022",
    endDate: "10/2022",
    thumbnail: "/projects/polyphi-demo.mp4",
    playThumbnailOnHover: true,
    githubLink: "https://github.com/soph-lin/polyphi"
  },
  {
    name: "sophli-legacy",
    description: "Original personal website when I was learning the ropes of web dev, just a cozy lil guy",
    tags: ["HTML", "PHP", "CSS", "JavaScript"],
    startDate: "02/2023",
    endDate: "02/2025",
    thumbnail: "/projects/sophli-legacy-thumbnail.gif",
    demoLink: "https://legacy.sophli.in",
    githubLink: "https://github.com/soph-lin/sophli-legacy"
  },
  {
    name: "gink-go!",
    description: "Research automation tool for Science Olympiad",
    tags: ["HTML", "CSS", "JavaScript", "Node.js"],
    startDate: "03/2023",
    endDate: "05/2023",
    thumbnail: "/projects/ginkgo-thumbnail.gif",
    content: "/projects/ginkgo-demo.gif",
    demoLink: "https://legacy.sophli.in/code/ginkgo",
    githubLink: "https://github.com/soph-lin/sophli-legacy/tree/main/ginkgo"
  },
  {
    name: "Spotistats",
    description: "Precursor to Melody Lane, tracks history of added songs using Spotify API",
    tags: ["HTML", "CSS", "JavaScript", "Spotify API"],
    startDate: "04/2024",
    endDate: "09/2024",
    thumbnail: "/projects/spotistats-thumbnail.gif",
    content: "/projects/spotistats-demo.gif",
    demoLink: "https://legacy.sophli.in/code/spotistats",
    githubLink: "https://github.com/soph-lin/sophli-legacy/tree/main/spotistats"
  },
  {
    name: "TabPet",
    description: "A virtual companion for your browser",
    tags: ["Chrome Extension", "Javascript"],
    startDate: "07/2024",
    endDate: "Present",
    thumbnail: "/projects/tabpet-thumbnail.gif",
    content: "/projects/tabpet-demo.mp4",
    githubLink: "https://github.com/soph-lin/tabpet"
  },
  {
    name: "AgriSphere",
    description: "Web platform that analyzes crucial NASA geospatial data for agricultural workers • Built for NASA Space Apps 2024",
    tags: ["React", "Flask", "Node.js", "Web Scraping", "Hackathon"],
    startDate: "10/2024",
    thumbnail: "/projects/agrisphere-thumbnail.gif",
    content: "/projects/agrisphere-demo.mp4",
    demoLink: "https://www.youtube.com/watch?v=LCsdb0xEhX0",
    githubLink: "https://github.com/NASA-Space-Apps-SP-ace/Leveraging-Earth-Observation-Data-for-Informed-Agricultural-Decision-Making"
  },
  {
    name: "Melody Lane",
    description: "Take a trip down musical memory lane through your Spotify library",
    tags: ["React", "TypeScript", "Next.js"],
    startDate: "10/2024",
    endDate: "Present",
    thumbnail: "/projects/melodylane-thumbnail.gif",
    content: "/projects/melodylane-demo.mp4",
    demoLink: "https://melodylane.sophli.in",
    githubLink: "https://github.com/soph-lin/melody-lane"
  },
  {
    name: "sophli (Personal Website)",
    description: "Literally what you're looking at right now. Migrating from the old tech stack was definitely tricky, but totally worth it! More features coming some hehe",
    tags: ["React", "TypeScript", "Next.js"],
    startDate: "01/2025",
    endDate: "Present",
    thumbnail: "/projects/sophli-thumbnail.gif",
    content: "/projects/sophli-demo.gif",
    demoLink: "https://www.sophli.in",
    githubLink: "https://github.com/soph-lin/sophli-website"
  },
  {
    name: "Hot on the Market",
    description: "Gamified platform to help aspiring investors make their next hot pick • Won Honorable Mention for Best Financial Hack in HackIllinois 2025 (1,000+ participants)",
    tags: ["React", "TypeScript", "Python", "Chart.js", "SQLite", "Hackathon"],
    startDate: "02/2025",
    thumbnail: "/projects/hotonthemarket-thumbnail.gif",
    content: "/projects/hotonthemarket-demo.mp4",
    demoLink: "https://devpost.com/software/hot-on-the-market",
    githubLink: "https://github.com/equan04/Hot-on-the-Market"
  },
  /* EXPERIENCES */
  {
    name: "HausaNLP",
    description: "Hub to upload and manage datasets for underrepresented languages in natural language processing",
    tags: ["React", "TypeScript", "Next.js", "TypeScript Remote Procedure Call (tRPC)", "Zod", "TanStack", "Lodash", "Emotion", "Material UI"],
    startDate: "09/2024",
    endDate: "12/2024",
    thumbnail: "/projects/hausanlp-thumbnail.mp4",
    playThumbnailOnHover: true,
    demoLink: "https://catalog.hausanlp.org",
    clientLink: "https://hausanlp.github.io"
  },
  {
    name: "Jinship",
    description: "Chatbot to navigate nonprofit and government websites",
    tags: ["LangChain", "OpenAI API", "React", "MongoDB", "FastAPI", "Uvicorn"],
    startDate: "09/2024",
    endDate: "12/2024",
  },
  {
    name: "Code Your Dreams",
    description: "Web platform to help students learn to code",
    tags: ["React", "TypeScript", "Next.js", "Chakra UI", "PostgreSQL"],
    startDate: "02/2025",
    endDate: "Present",
    demoLink: "https://cydhub.vercel.app",
    clientLink: "https://www.codeyourdreams.org"
  },
  {
    name: "State of Illinois RDBMS",
    description: "Database system that tracks cannabis sales and analyzes sales data through sentiment analysis, in collaboration with the State of Illinois",
    tags: ["React", "Flask", "AWS", "ML"],
    startDate: "02/2025",
    endDate: "Present",
  },
  {
    name: "MyMCAT.ai (Lead Developer)",
    description: "Edtech startup offering tailored MCAT prep for traditionally underserved students",
    tags: ["React", "TypeScript", "Node.js", "Tailwind CSS", "SQL", "Prisma", "Clerk", "JWT", "Internship"],
    startDate: "02/2025",
    endDate: "Present",
    thumbnail: "/projects/mymcat-thumbnail.gif",
    demoLink: "https://www.mymcat.ai"
  },
  {
    name: "Playtime",
    description: "Multiplayer music game",
    tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "PostgreSQL", "Prisma", "Pusher (Websockets)", "SoundCloud API", "Spotify API"],
    startDate: "01/2025",
    endDate: "Present",
    thumbnail: "/projects/playtime-thumbnail.gif",
    content: "/projects/playtime-demo.mp4",
    demoLink: "https://playtime.sophli.in",
    githubLink: "https://github.com/soph-lin/playtime"
  }
  // {
  //   name: "Project 1",
  //   description: "Description of project 1",
  //   tags: ["React", "TypeScript", "Next.js"],
  //   startDate: "2023",
  //   endDate: "Present",
  //   thumbnail: "/path/to/project1.gif"
  // },
]; 

export default projects;
