/**
 * PROJECT SHOWCASE DATA  (used by both laptop/ and mobile/ via js/projects-showcase.js)
 * ----------------------------------------------------------------
 * This is the ONLY file you need to edit to add / change a project.
 *
 *   mine[]   – your own projects.  Fields:
 *       title, desc, icon (Font Awesome class), tags[],
 *       result (optional one-liner shown as a highlight), case (optional case study: problem, role, approach, stack[], outcome → adds a "Case study" button),
 *       img   (optional screenshot, path relative to the site root, e.g. "assets/projects/showcase/x.webp"),
 *       live  (live URL, or "" when there isn't one),
 *       repo  (GitHub URL)
 *   client[] – websites you built for clients.  Fields:
 *       title, desc, icon, tags[], img (optional), live
 *
 * To upgrade a client card from the placeholder tile to a real screenshot, drop an image into
 * assets/projects/showcase/ and set its `img`.
 * (data/portfolio-data.js is not touched — this file is separate.)
 * ---------------------------------------------------------------- */
window.PROJECT_SHOWCASE = {
  mine: [
    {
      title: "Gesture Flow",
      desc: "Control a presentation with your bare hands: the webcam tracks your gestures — open palm for the next slide, closed fist for the previous — so there is no clicker to lose.",
      icon: "fa-hand", tags: ["Computer Vision", "Gesture Control", "Web App"],
      img: "assets/projects/showcase/gesture-flow.webp",
      live: "https://guestureflow.vercel.app/", repo: "https://github.com/sudeenjain/guesture_flow",
      result: "",   // e.g. "Used to present 20+ live sessions"  (shown on the card when filled)
      case: {
        problem: "Presenters are tied to a keyboard or a clicker, which breaks eye contact and flow.",
        role: "Solo build: idea, gesture logic and web interface.",
        approach: "The webcam stream is analysed in the browser; an open palm triggers the next slide and a closed fist the previous one.",
        stack: ["Computer Vision", "JavaScript", "Webcam API"],
        outcome: ""
      }
    },
    {
      title: "FolioAI",
      desc: "Turns a GitHub ID, LinkedIn data and a resume (or a short bio) into a professional portfolio website in seconds — no coding required.",
      icon: "fa-wand-magic-sparkles", tags: ["AI", "Portfolio Generator", "Web App"],
      img: "assets/projects/showcase/folio-ai.webp",
      live: "https://portfolio-ai-eta-dusky.vercel.app/", repo: "https://github.com/sudeenjain/folioAI",
      result: "",
      case: {
        problem: "Building a good portfolio site takes design and coding skills many students do not have.",
        role: "Solo build: product idea, AI prompt flow and front end.",
        approach: "The user supplies a GitHub ID, LinkedIn data and a resume or short bio; the app turns it into a finished portfolio website.",
        stack: ["AI", "Web App", "GitHub data"],
        outcome: ""
      }
    },
    {
      title: "CareerReady",
      desc: "An AI career workspace: skill verification, gap analysis, roadmaps and interview drills in one dashboard, with a personal assistant that plans your week.",
      icon: "fa-briefcase", tags: ["AI", "Career Tools", "Dashboard"],
      img: "assets/projects/showcase/career-ready.webp",
      live: "https://dist-steel-beta-55.vercel.app/#/landing", repo: "https://github.com/sudeenjain/CarrerReady",
      result: "",
      case: {
        problem: "Students juggle skill checks, roadmaps and interview prep across many separate tools.",
        role: "Solo build: dashboard design and AI features.",
        approach: "One workspace for skill verification, gap analysis, learning roadmaps and interview drills, with an assistant that plans the week.",
        stack: ["AI", "Dashboard", "React-style SPA"],
        outcome: ""
      }
    },
    {
      title: "Attendance Tracker",
      desc: "Attendance marking with a live biometric face scanner — align your face and blink to pass the liveness check before attendance is recorded.",
      icon: "fa-user-check", tags: ["Face Recognition", "Liveness Check", "Web App"],
      img: "assets/projects/showcase/attendance-tracker.webp",
      live: "https://attendance-tracker-eight-blush.vercel.app/", repo: "https://github.com/sudeenjain/attendence_tracker",
      result: "",
      case: {
        problem: "Manual attendance is slow and easy to fake with a photo or a proxy.",
        role: "Solo build: face scanning flow and liveness check.",
        approach: "A live face scanner asks the user to align their face and blink; attendance is recorded only after the liveness check passes.",
        stack: ["Face Recognition", "Liveness Check", "Web App"],
        outcome: ""
      }
    },
    {
      title: "CineAI — Movie Recommendation",
      desc: "An AI-powered movie recommendation app behind a cinematic intro screen.",
      icon: "fa-film", tags: ["AI", "Recommendation Engine", "Web App"],
      img: "assets/projects/showcase/cine-ai.webp",
      live: "https://movie-recommendation-plum-phi.vercel.app/", repo: "https://github.com/sudeenjain/Movie_Recommendation"
    },
    {
      title: "NeuralCart — Product Recommendation",
      desc: "An AI recommendation engine that suggests products to shoppers, presented as a neural-powered storefront.",
      icon: "fa-cart-shopping", tags: ["AI", "Recommendation Engine", "Web App"],
      img: "assets/projects/showcase/neural-cart.webp",
      live: "https://ai-recommendation-system-gamma.vercel.app/", repo: "https://github.com/sudeenjain/Product_Recommendation"
    },
    {
      title: "Smart To-Do List (TaskFlow)",
      desc: "An intelligent task manager with search, status filters (all / active / done), a high-priority filter and sorting.",
      icon: "fa-list-check", tags: ["Productivity", "Python", "Web App"],
      img: "assets/projects/showcase/taskflow.webp",
      live: "https://to-do-list-in-python.vercel.app/", repo: "https://github.com/sudeenjain/to-do-list-in-python"
    },
    {
      title: "Currency Converter",
      desc: "A real-time currency converter supporting 150+ currencies with instant conversion rates and a clean interface.",
      icon: "fa-coins", tags: ["JavaScript", "Live APIs", "Web App"],
      img: "assets/projects/showcase/currency-converter.webp",
      live: "https://currency-converter-phi-one.vercel.app/", repo: "https://github.com/sudeenjain/currency-converter"
    },
    {
      title: "Connects The Dots",
      desc: "A Design & Analysis of Algorithms mini project that applies algorithmic problem-solving to the classic connect-the-dots puzzle.",
      icon: "fa-diagram-project", tags: ["Algorithms", "DAA", "Web App"],
      live: "https://daa-miniproject.vercel.app/", repo: "https://github.com/sudeenjain/Connect_the_Dots"
    },
    {
      title: "Amazon Bestseller Recommender",
      desc: "A recommendation system built around Amazon bestseller data, created as an IBM mini project.",
      icon: "fa-amazon", brand: true, tags: ["Machine Learning", "Recommendation Engine", "IBM"],
      live: "https://ibm-mini-project.vercel.app/", repo: "https://github.com/sudeenjain/Amazon-Bestseller-Recommender"
    },
    {
      title: "Portfolio Website",
      desc: "The original version of this portfolio — a cyber-themed personal site showcasing projects, certificates and badges.",
      icon: "fa-globe", tags: ["HTML", "CSS", "JavaScript"],
      live: "https://sudeenjain.github.io/portfolio/", repo: "https://github.com/sudeenjain/portfolio"
    },
    {
      title: "Interactive Recipe Finder",
      desc: "A dynamic web application enabling users to search, filter and discover recipes with real-time ingredient matching.",
      icon: "fa-utensils", tags: ["HTML", "CSS", "JavaScript"],
      live: "", repo: "https://github.com/sudeenjain/-interactive-recipe-finder"
    },
    {
      title: "Book Recommender",
      desc: "A book recommendation engine that suggests titles based on reading preferences.",
      icon: "fa-book", tags: ["Java", "Recommendation Engine"],
      live: "", repo: "https://github.com/sudeenjain/Book_Recommender"
    },
    {
      title: "AI Resume Architect",
      desc: "An AI-assisted resume builder that helps structure and write a professional resume.",
      icon: "fa-file-lines", tags: ["AI", "Resume Tools"],
      live: "", repo: "https://github.com/sudeenjain/AI-Resume_Architect"
    },
    {
      title: "AI Dictionary",
      desc: "An AI-powered dictionary for looking up words and meanings.",
      icon: "fa-spell-check", tags: ["AI", "Language"],
      live: "", repo: "https://github.com/sudeenjain/AI_dictonary"
    },
    {
      title: "AI Calculator",
      desc: "A calculator project with AI assistance.",
      icon: "fa-calculator", tags: ["AI", "Utility"],
      live: "", repo: "https://github.com/sudeenjain/AI_Calculator"
    }
  ],

  client: [
    { title: "Abhimo",                   desc: "Company website delivered for the client Abhimo.",                               icon: "fa-building",       tags: ["Client Project", "Company Website"],        live: "https://abhimo.com/" },
    { title: "Realindua",                desc: "Company website delivered for the client Realindua.",                            icon: "fa-building",       tags: ["Client Project", "Company Website"],        live: "https://www.realindua.com/" },
    { title: "Perks Property",           desc: "Property website built for the client Perks Property (development build).",      icon: "fa-house",          tags: ["Client Project", "Property Website"],       live: "https://dev.perksproperty.com/" },
    { title: "All in One Technology",    desc: "Business website delivered for the client All in One Technology.",               icon: "fa-microchip",      tags: ["Client Project", "Business Website"],       live: "http://allinonetech.co.in/" },
    { title: "Mahalaxmi Industrial Association", desc: "Website for the Mahalaxmi Industrial Association.",                      icon: "fa-industry",       tags: ["Client Project", "Association Website"],    live: "https://mahalaxmiindustrialassociation.org/about" },
    { title: "Chinmaya School Mangalore", desc: "School website built for Chinmaya School, Mangalore.",                          icon: "fa-school",         tags: ["Client Project", "School Website"],         live: "https://chinmayaschoolmangalore.in/" },
    { title: "Kushal Industries Association", desc: "Website for the Kushal Industries Association.",                            icon: "fa-industry",       tags: ["Client Project", "Association Website"],    live: "https://kushalindustriesassociation.org/" }
  ]
};

/* TESTIMONIALS — add real client quotes here and a "What clients say" strip appears under Projects.
   Leave the array empty and nothing is shown.
   { quote: "Delivered on time and the site looks great.", name: "Name", role: "Company / role" } */
window.PROJECT_TESTIMONIALS = [];
