/**
 * SUDEEN JAIN - AI COPILOT KNOWLEDGE BASE
 * Comprehensive dataset covering background, skills, projects, certifications, internships, and contact info.
 */

const SUDEEN_KB = {
  profile: {
    fullName: "Sudeen Jain H R",
    shortName: "Sudeen",
    title: "AI & Machine Learning Engineer",
    tagline: "Engineering Intelligence · Building Scalable Cloud & AI Solutions",
    location: "Karnataka, India",
    education: {
      degree: "B.Tech in Artificial Intelligence & Machine Learning",
      institution: "Srinivas University",
      status: "Pursuing",
      focus: "Deep Learning, Machine Learning Algorithms, Cloud Systems, Full-Stack AI Development"
    },
    bio: [
      "Sudeen Jain is a passionate AI & Machine Learning engineer pursuing B.Tech at Srinivas University.",
      "His core expertise spans predictive modeling, natural language processing, computer vision, and building cloud-native full-stack intelligent applications.",
      "He actively builds real-world solutions ranging from computer vision gesture controllers and recommendation engines to high-performance web systems."
    ],
    email: "sudinhr1@gmail.com",
    github: "https://github.com/sudeenjain",
    linkedin: "https://www.linkedin.com/in/sudeenjain",
    instagram: "https://instagram.com/sudeen_jain",
    credly: "https://www.credly.com/users/sudeenjain",
    resumePath: "../resume.pdf",
    portfolioUrl: "../index.html",
    stats: {
      projectsCount: 16,
      certificationsCount: 12,
      internshipsCount: 5,
      technologiesCount: 14
    }
  },

  skills: {
    programming: [
      { name: "Python", level: "Advanced", icon: "fab fa-python" },
      { name: "JavaScript", level: "Advanced", icon: "fab fa-js" },
      { name: "Java", level: "Intermediate", icon: "fab fa-java" },
      { name: "SQL", level: "Advanced", icon: "fas fa-database" },
      { name: "HTML5 & CSS3", level: "Expert", icon: "fab fa-html5" },
      { name: "PHP", level: "Intermediate", icon: "fab fa-php" }
    ],
    ai_ml: [
      { name: "Machine Learning (Supervised/Unsupervised)", icon: "fas fa-robot" },
      { name: "Deep Learning & Neural Networks", icon: "fas fa-network-wired" },
      { name: "TensorFlow & Keras", icon: "fas fa-brain" },
      { name: "Computer Vision & OpenCV", icon: "fas fa-eye" },
      { name: "Recommendation Systems", icon: "fas fa-thumbs-up" },
      { name: "Natural Language Processing (NLP)", icon: "fas fa-language" },
      { name: "Predictive Analytics (IBM SPSS)", icon: "fas fa-chart-line" }
    ],
    cloud_devops: [
      { name: "AWS Cloud (EC2, S3, IAM, Architecture)", icon: "fab fa-aws" },
      { name: "Microsoft Azure Fundamentals", icon: "fab fa-microsoft" },
      { name: "Git & GitHub Version Control", icon: "fab fa-git-alt" },
      { name: "REST APIs & Webhooks", icon: "fas fa-exchange-alt" },
      { name: "Supabase & Cloud Databases", icon: "fas fa-database" }
    ],
    web_development: [
      { name: "Full-Stack Development", icon: "fas fa-layer-group" },
      { name: "Responsive UI/UX & Glassmorphic Design", icon: "fas fa-paint-brush" },
      { name: "Modern JavaScript (ES6+)", icon: "fab fa-js-square" },
      { name: "Figma & UI Prototyping", icon: "fab fa-figma" }
    ]
  },

  projects: [
    {
      id: "gesture-flow",
      title: "Gesture Flow",
      category: "Computer Vision & AI",
      description: "A real-time gesture-controlled interface using OpenCV and Computer Vision that interprets hand movements to control on-screen actions seamlessly without hardware controllers.",
      tech: ["Python", "Computer Vision", "OpenCV", "AI"],
      github: "https://github.com/sudeenjain/guesture_flow",
      demo: "https://guestureflow.vercel.app/",
      featured: true
    },
    {
      id: "movie-recommendation",
      title: "Movie Recommendation System",
      category: "Machine Learning",
      description: "An intelligent recommendation engine suggesting movies based on content similarity, cosine distance, and user preference algorithms.",
      tech: ["Python", "Machine Learning", "Scikit-Learn", "Recommendation Engine"],
      github: "https://github.com/sudeenjain/Movie_Recommendation",
      demo: "https://movie-recommendation-plum-phi.vercel.app/",
      featured: true
    },
    {
      id: "folio-ai",
      title: "FolioAI",
      category: "AI & Automation",
      description: "An AI-powered portfolio assistant that automatically structures, categorizes, and generates dynamic portfolio content tailored for tech professionals.",
      tech: ["AI", "JavaScript", "Automation", "Web App"],
      github: "https://github.com/sudeenjain/folioAI",
      demo: "https://portfolio-ai-eta-dusky.vercel.app/",
      featured: true
    },
    {
      id: "career-ready",
      title: "CareerReady",
      category: "Web Application",
      description: "A modern career-preparation platform helping graduates assess job readiness, track progress, and practice interview benchmarks.",
      tech: ["JavaScript", "Web App", "Career Tools", "Responsive UI"],
      github: "https://github.com/sudeenjain/CarrerReady",
      demo: "https://dist-steel-beta-55.vercel.app/#/landing",
      featured: true
    },
    {
      id: "product-recommendation",
      title: "Product Recommendation Engine",
      category: "AI & E-Commerce",
      description: "E-commerce AI recommendation engine calculating collaborative and item-based relevance based on customer shopping behaviors.",
      tech: ["Python", "AI", "Collaborative Filtering", "Recommendation Engine"],
      github: "https://github.com/sudeenjain/Product_Recommendation",
      demo: "https://ai-recommendation-system-gamma.vercel.app/",
      featured: true
    },
    {
      id: "game-difficulty-balancer",
      title: "Game Level Difficulty Balancer",
      category: "Algorithms & DAA",
      description: "An algorithmic system that dynamically balances game difficulty curves in real time using Design and Analysis of Algorithms (DAA) and Dynamic Programming.",
      tech: ["Python", "Algorithms", "DAA", "Dynamic Programming"],
      github: "https://github.com/sudeenjain/DAA-miniproject",
      demo: null,
      featured: false
    },
    {
      id: "connect-the-dots",
      title: "Connect The Dots",
      category: "Algorithms & Graph Theory",
      description: "An interactive visualization exploring graph connectivity, shortest pathfinding, and node traversal concepts built as a DAA mini-project.",
      tech: ["Python", "Algorithms", "Graph Theory", "Visualization"],
      github: "https://github.com/sudeenjain/Connect_the_Dots",
      demo: "https://daa-miniproject.vercel.app/",
      featured: true
    },
    {
      id: "amazon-bestseller",
      title: "Amazon Bestseller Recommender",
      category: "Machine Learning & Big Data",
      description: "A machine learning pipeline analyzing Amazon bestseller trends to discover high-performing product patterns and customer demand insights.",
      tech: ["Python", "Machine Learning", "Data Analysis", "IBM Project"],
      github: "https://github.com/sudeenjain/Amazon-Bestseller-Recommender",
      demo: "https://ibm-mini-project.vercel.app/",
      featured: true
    },
    {
      id: "attendance-tracker",
      title: "Attendance Tracker",
      category: "Web Application",
      description: "A streamlined web-based attendance tracker for recording, reviewing, and analyzing student and team attendance records efficiently.",
      tech: ["JavaScript", "Web App", "Data Tracking"],
      github: "https://github.com/sudeenjain/attendence_tracker",
      demo: "https://attendance-tracker-eight-blush.vercel.app/",
      featured: false
    },
    {
      id: "ai-dictionary",
      title: "AI Dictionary",
      category: "NLP & AI",
      description: "An AI-powered smart dictionary offering contextual definitions, phonetic pronunciations, and real-world NLP semantic examples.",
      tech: ["AI", "NLP", "JavaScript", "REST APIs"],
      github: "https://github.com/sudeenjain/AI_dictonary",
      demo: null,
      featured: false
    },
    {
      id: "book-recommender",
      title: "Book Recommender System",
      category: "Java & Algorithms",
      description: "An intelligent book recommendation engine engineered with Advanced Java suggesting literature based on reading behaviors and genres.",
      tech: ["Java", "Advanced Java", "Recommendation Engine"],
      github: "https://github.com/sudeenjain/Adavanced-Java-BookRecommender",
      demo: null,
      featured: false
    },
    {
      id: "currency-converter",
      title: "Live Currency Converter",
      category: "Web Development",
      description: "Real-time currency converter connecting to live exchange rate APIs supporting 150+ fiat currencies with instant conversion calculation.",
      tech: ["JavaScript", "REST API", "Exchange Rates", "CSS3"],
      github: "https://github.com/sudeenjain/currency-converter",
      demo: null,
      featured: false
    },
    {
      id: "smart-todo",
      title: "Smart Task & To-Do Manager",
      category: "Python Utility",
      description: "Python-powered task management tool with priority sorting, file-based persistence, and deadline scheduling.",
      tech: ["Python", "File I/O", "CLI", "Task Management"],
      github: "https://github.com/sudeenjain/to-do-list-in-python",
      demo: null,
      featured: false
    },
    {
      id: "recipe-finder",
      title: "Interactive Recipe Finder",
      category: "Web Development",
      description: "Web application enabling culinary exploration by matching pantry ingredients against global recipe databases in real-time.",
      tech: ["HTML", "CSS", "JavaScript", "API Integration"],
      github: "https://github.com/sudeenjain/-interactive-recipe-finder",
      demo: null,
      featured: false
    }
  ],

  certifications: [
    {
      title: "AWS Academy Graduate – Cloud Foundations",
      issuer: "Amazon Web Services (AWS)",
      desc: "Validated competence in core AWS architecture, security, compute, storage, networking, and cloud economics.",
      link: "https://www.credly.com/badges/850a46b9-cd01-46eb-a853-35550567b86c",
      category: "Cloud"
    },
    {
      title: "IT Specialist – Artificial Intelligence",
      issuer: "Certiport (Pearson VUE)",
      desc: "Comprehensive examination credential validating AI principles, machine learning models, neural networks, and ethics.",
      link: "https://www.credly.com/badges/851d7a73-3caf-4851-baeb-52645964d1be",
      category: "AI/ML"
    },
    {
      title: "Deep Learning using TensorFlow",
      issuer: "IBM",
      desc: "Hands-on implementation of Convolutional Neural Networks (CNN), Recurrent Neural Networks (RNN), and Autoencoders.",
      link: "https://www.credly.com/badges/a289455e-4038-4810-a13d-f07613725b8b",
      category: "AI/ML"
    },
    {
      title: "Getting Started with Artificial Intelligence",
      issuer: "IBM SkillsBuild",
      desc: "Foundational AI paradigms, real-world industry use cases, NLP, and computer vision systems.",
      link: "https://www.credly.com/badges/de0e7fd4-8593-48c7-95f6-104af1769c4e",
      category: "AI/ML"
    },
    {
      title: "Journey to Cloud: Envisioning Your Solution",
      issuer: "IBM SkillsBuild",
      desc: "Cloud migration strategies, enterprise architecture, microservices, containerization, and modern SaaS/PaaS/IaaS patterns.",
      link: "https://www.credly.com/badges/85e4145d-ecb3-4b8f-bb30-e4e47b4a26cc",
      category: "Cloud"
    },
    {
      title: "Web Development Fundamentals",
      issuer: "IBM SkillsBuild",
      desc: "Core web standards, responsive UI design, modern DOM manipulation, and full-stack development pipeline.",
      link: "https://www.credly.com/badges/2977f3c8-acb9-4ad3-a4fb-37ce1220d25d",
      category: "Web"
    },
    {
      title: "Microsoft Azure Fundamentals",
      issuer: "Microsoft / Skillsoft",
      desc: "Cloud services on Microsoft Azure, VM management, virtual networking, Azure storage, and identity security.",
      link: "https://skillsoft.digitalbadges.skillsoft.com/481daa56-525f-46d3-b249-ff884ef8ee85",
      category: "Cloud"
    },
    {
      title: "Introduction to Generative AI Studio",
      issuer: "Google Cloud + Simplilearn",
      desc: "Prompt design, LLM orchestration, Generative AI foundation models, and Google Vertex AI studio capabilities.",
      link: "https://sudeenjain.github.io/",
      category: "GenAI"
    },
    {
      title: "Predictive Analytics using IBM SPSS Modeler",
      issuer: "IBM",
      desc: "Data mining algorithms, predictive modeling, decision trees, clustering, and churn analysis.",
      link: "https://sudeenjain.github.io/",
      category: "Data Science"
    }
  ],

  internships: [
    {
      company: "Averixis Solutions",
      role: "AI & Machine Learning Intern",
      period: "Aug 2025 – Dec 2025",
      desc: "Deepened practical competencies in predictive model training, data preprocessing, machine learning pipelines, and real-world problem solving aligned with AICTE industry guidelines.",
      tags: ["AI", "Machine Learning", "Python", "Data Analysis", "AICTE"]
    },
    {
      company: "Edunet Foundation & IBM SkillsBuild",
      role: "Front-End Web Development Intern",
      period: "6 Weeks",
      desc: "Developed responsive, interactive user interfaces with clean modular code, focusing on UI/UX standards, modern CSS layouts, and client-side performance.",
      tags: ["HTML", "CSS", "JavaScript", "UI/UX", "Responsive Design"]
    },
    {
      company: "Edunet Foundation & IBM",
      role: "Emerging Technologies Intern (AI & Cloud)",
      period: "4 Weeks",
      desc: "Hands-on projects bridging cloud architectures with cognitive AI services, containerized deployment, and intelligent system workflows.",
      tags: ["AI", "Cloud Computing", "IBM Watson", "Emerging Tech"]
    },
    {
      company: "Snestron Systems Pvt. Ltd.",
      role: "UI/UX Design Intern",
      period: "Jul 2025 – Aug 2025",
      desc: "Conducted user research, wireframing, high-fidelity Figma prototyping, and usability evaluations for product dashboards.",
      tags: ["UI/UX", "Figma", "User Research", "Prototyping", "Design Systems"]
    },
    {
      company: "Abhimo Technologies",
      role: "Web Development Intern",
      period: "2026",
      desc: "Contributed to production full-stack engineering, debugging PHP backend endpoints and refining JavaScript frontend interactions.",
      tags: ["PHP", "JavaScript", "MySQL", "Full-Stack", "Debugging"]
    }
  ],

  faqs: [
    {
      q: "Is Sudeen available for hire or internships?",
      a: "Yes! Sudeen is actively open to AI/ML engineering, Data Science, and Full-Stack software engineering internships and junior roles. You can reach out directly via email at sudinhr1@gmail.com or via LinkedIn."
    },
    {
      q: "Where does Sudeen study?",
      a: "Sudeen is pursuing his B.Tech in Artificial Intelligence & Machine Learning at Srinivas University, Karnataka, India."
    },
    {
      q: "What are Sudeen's strongest technical skills?",
      a: "His strongest competencies are Python, Machine Learning (TensorFlow, Scikit-learn), Computer Vision (OpenCV), Cloud Computing (AWS & Azure), and Modern Web Development."
    },
    {
      q: "Where can I view his verified badges and credentials?",
      a: "You can view his official badges on Credly at credly.com/users/sudeenjain, including AWS Cloud Foundations, Pearson IT Specialist in AI, and IBM certifications."
    }
  ]
};

// Quick questions list for prompt chips
const QUICK_PROMPTS = [
  { icon: "👤", label: "About Sudeen", query: "Who is Sudeen Jain?" },
  { icon: "🚀", label: "Top Projects", query: "Show me his top projects and live demos" },
  { icon: "⚡", label: "Skills Matrix", query: "What are his technical skills?" },
  { icon: "💼", label: "Internships", query: "Where has he worked or interned?" },
  { icon: "🏆", label: "Certifications", query: "What certifications and badges does he have?" },
  { icon: "📄", label: "Download Resume", query: "Can I get his resume?" },
  { icon: "📬", label: "Contact / Hire", query: "How can I contact or hire Sudeen?" }
];
