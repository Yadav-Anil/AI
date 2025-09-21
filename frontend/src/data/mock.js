// Mock data for Anil Yadav's Portfolio
export const profileData = {
  name: "Anil Yadav",
  title: "Senior Technical Lead",
  company: "Nucleus Software Japan K.K.",
  location: "Tokyo, Japan",
  tagline: "Experienced Senior Technical Lead with 16+ years in IT innovation",
  summary: "Experienced Senior Technical Lead with a demonstrated history of working in the information technology and services industry. Strong engineering professional skilled in Requirements Analysis, Oracle Database, Agile Methodologies, PL/SQL, and Software Development Life Cycle (SDLC).",
  contact: {
    email: "anilyadav83@gmail.com",
    linkedin: "www.linkedin.com/in/anil-yadav-a1223211",
    blogs: [
      { name: "SQL Server Team Blog", url: "sqlserverteam.blogspot.com/" },
      { name: "Personal Tech Blog", url: "anil83.blogspot.com/" }
    ]
  }
};

export const skills = [
  { name: "Web Services", level: 95, category: "Backend" },
  { name: "WCF", level: 90, category: "Framework" },
  { name: "XML", level: 90, category: "Data" },
  { name: "Oracle Database", level: 95, category: "Database" },
  { name: "PL/SQL", level: 92, category: "Database" },
  { name: "Requirements Analysis", level: 95, category: "Analysis" },
  { name: "Agile Methodologies", level: 90, category: "Process" },
  { name: "SDLC", level: 95, category: "Process" },
  { name: "Microsoft Azure", level: 85, category: "Cloud" },
  { name: "AWS", level: 80, category: "Cloud" },
  { name: "Blockchain", level: 75, category: "Emerging Tech" }
];

export const certifications = [
  {
    id: 1,
    name: "Microsoft Azure: Design and Implement a Storage Strategy",
    issuer: "Microsoft",
    year: "2023",
    type: "Cloud Architecture"
  },
  {
    id: 2,
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    year: "2023",
    type: "Cloud Architecture"
  },
  {
    id: 3,
    name: "IBM Blockchain Essentials",
    issuer: "IBM",
    year: "2022",
    type: "Blockchain Technology"
  },
  {
    id: 4,
    name: "Become a Cloud Developer",
    issuer: "Professional Certification",
    year: "2023",
    type: "Cloud Development"
  }
];

export const experience = [
  {
    id: 1,
    company: "Nucleus Software Japan K.K.",
    position: "Senior Technical Lead",
    duration: "April 2014 - Present",
    period: "11+ years",
    description: "Leading technical initiatives and architecture decisions for IBU - NOZOMI for Shinsei Bank, Japan. Responsible for system design, team leadership, and project delivery.",
    technologies: ["Web Services", "Oracle Database", "PL/SQL", "Agile", "System Architecture"]
  },
  {
    id: 2,
    company: "Nucleus Software Japan K.K.",
    position: "System Analyst",
    duration: "April 2012 - March 2014",
    period: "2 years",
    description: "Analyzed business requirements and designed technical solutions for banking systems. Collaborated with stakeholders to ensure optimal system performance.",
    technologies: ["Requirements Analysis", "System Design", "Database Optimization"]
  },
  {
    id: 3,
    company: "Nucleus Software Japan K.K.",
    position: "Senior Software Engineer",
    duration: "March 2009 - April 2012",
    period: "3+ years",
    description: "Developed and maintained software solutions for financial institutions. Focused on web services development and database integration.",
    technologies: ["Web Development", "Database Integration", "Software Engineering"]
  },
  {
    id: 4,
    company: "Advantage Learning Systems India Pvt Ltd",
    position: "Application Programmer",
    duration: "August 2006 - March 2009",
    period: "2+ years",
    description: "Worked on educational technology solutions as part of Renaissance Learning Inc. subsidiary. Developed computer-based assessment technology for pre-K-12 schools.",
    technologies: ["Application Development", "Educational Technology", "Assessment Systems"]
  },
  {
    id: 5,
    company: "Sugal & Damani Enterprises Pvt. Ltd.",
    position: "Software Engineer",
    duration: "November 2004 - August 2006",
    period: "1+ years",
    description: "Developed customized software solutions in web-based technologies, database systems, and client-server architecture for various business domains.",
    technologies: ["Web Technologies", "Database Systems", "Client-Server Architecture"]
  }
];

export const projects = [
  {
    id: 1,
    title: "Banking System Architecture - NOZOMI",
    description: "Led the architectural design and implementation of core banking solutions for Shinsei Bank, Japan. Implemented scalable web services and optimized database performance.",
    technologies: ["Web Services", "Oracle Database", "PL/SQL", "System Architecture"],
    status: "Production",
    impact: "Serving millions of banking transactions daily"
  },
  {
    id: 2,
    title: "Cloud Migration Strategy",
    description: "Designed and executed cloud migration strategies for legacy banking systems, leveraging Azure and AWS cloud platforms for improved scalability and reliability.",
    technologies: ["Microsoft Azure", "AWS", "Cloud Architecture", "Migration Planning"],
    status: "Completed",
    impact: "40% improvement in system performance"
  },
  {
    id: 3,
    title: "Educational Assessment Platform",
    description: "Developed computer-based assessment technology for Renaissance Learning, serving over 75,000 North American schools with personalized learning solutions.",
    technologies: ["Assessment Systems", "Educational Technology", "Scalable Architecture"],
    status: "Completed",
    impact: "Used by 75,000+ schools across North America"
  },
  {
    id: 4,
    title: "Enterprise Web Services Framework",
    description: "Built a comprehensive web services framework using WCF and XML technologies, enabling seamless integration between multiple enterprise systems.",
    technologies: ["WCF", "XML", "Web Services", "Enterprise Integration"],
    status: "Production",
    impact: "Reduced integration time by 60%"
  }
];

export const education = {
  degree: "B.Tech in Information Technology",
  institution: "UP Technical University, Lucknow, India",
  duration: "2000 - 2004",
  description: "Comprehensive study of information technology fundamentals, software engineering principles, and database management systems."
};