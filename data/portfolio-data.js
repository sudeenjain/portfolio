/**
 * PORTFOLIO DATA
 * ----------------------------------------------------------------
 * Single source of truth for all portfolio content. Edit this file
 * to update text, links, projects, certifications, badges, and
 * internships — the page re-renders itself from this object via
 * js/portfolio-renderer.js. No HTML editing required.
 * ----------------------------------------------------------------
 */
const portfolioData = {
  "nav": {
    "logoIcon": "SJ",
    "logoText": "Sudeen Jain",
    "links": [
      {
        "href": "#home",
        "label": "Home",
        "cta": false
      },
      {
        "href": "#about",
        "label": "About",
        "cta": false
      },
      {
        "href": "#skills",
        "label": "Skills",
        "cta": false
      },
      {
        "href": "#certifications",
        "label": "Certificate Gallery",
        "cta": false
      },
      {
        "href": "#badges",
        "label": "Badges",
        "cta": false
      },
      {
        "href": "#internships",
        "label": "Internships",
        "cta": false
      },
      {
        "href": "#projects",
        "label": "Projects",
        "cta": false
      },
      {
        "href": "#contact",
        "label": "Contact",
        "cta": false
      },
      {
        "href": "#get-in-touch",
        "label": "Reach Out",
        "cta": true
      }
    ]
  },
  "hero": {
    "greeting": "HELLO, I AM",
    "name": "SUDEEN JAIN H R",
    "subtitle": "B.Tech in AI & ML — Srinivas University",
    "roles": [
      "AI & Machine Learning Engineer",
      "Python Developer",
      "Cloud Computing Enthusiast",
      "Data Science Explorer",
      "Full-Stack Web Developer",
      "Problem Solver & Innovator"
    ],
    "ctas": [
      {
        "href": "#projects",
        "icon": "fa-rocket",
        "label": "Explore My Work"
      },
      {
        "href": "#contact",
        "icon": "fa-paper-plane",
        "label": "Let's Connect"
      }
    ]
  },
  "about": {
    "heading": "Engineering Intelligence",
    "headingIcon": "fa-microchip",
    "paragraphs": [
      "I'm a driven AI & Machine Learning engineer currently pursuing my B.Tech at Srinivas University. My passion lies at the intersection of data science and software engineering — building intelligent systems that turn raw data into actionable insights and real-world solutions.",
      "From training deep learning models to deploying cloud-native applications, I thrive on tackling complex challenges. My toolkit spans Python, TensorFlow, AWS, Azure, and modern web technologies — and I'm always learning something new."
    ],
    "tags": [
      {
        "icon": "fa-graduation-cap",
        "label": "B.Tech AIML"
      },
      {
        "icon": "fa-map-marker-alt",
        "label": "India"
      },
      {
        "icon": "fa-code",
        "label": "Full-Stack"
      },
      {
        "icon": "fa-brain",
        "label": "AI/ML"
      },
      {
        "icon": "fa-cloud",
        "label": "Cloud"
      }
    ],
    "stats": [
      {
        "icon": "fa-certificate",
        "target": 12,
        "label": "Certifications"
      },
      {
        "icon": "fa-code-branch",
        "target": 16,
        "label": "Projects Built"
      },
      {
        "icon": "fa-briefcase",
        "target": 4,
        "label": "Internships"
      },
      {
        "icon": "fa-layer-group",
        "target": 10,
        "label": "Technologies"
      }
    ],
    "profileImg": "assets/profile.jpg",
    "profileAlt": "Sudeen Jain"
  },
  "skills": [
    {
      "icon": "fab fa-python",
      "label": "Python"
    },
    {
      "icon": "fas fa-robot",
      "label": "Machine Learning"
    },
    {
      "icon": "fas fa-brain",
      "label": "Artificial Intelligence"
    },
    {
      "icon": "fas fa-chart-line",
      "label": "Data Science"
    },
    {
      "icon": "fas fa-database",
      "label": "SQL & RDBMS"
    },
    {
      "icon": "fab fa-aws",
      "label": "AWS Cloud"
    },
    {
      "icon": "fab fa-microsoft",
      "label": "Azure"
    },
    {
      "icon": "fab fa-html5",
      "label": "HTML/CSS"
    },
    {
      "icon": "fab fa-js",
      "label": "JavaScript"
    },
    {
      "icon": "fab fa-java",
      "label": "Java"
    },
    {
      "icon": "fas fa-chart-bar",
      "label": "Data Visualization"
    },
    {
      "icon": "fas fa-project-diagram",
      "label": "Algorithm Design"
    },
    {
      "icon": "fas fa-network-wired",
      "label": "Deep Learning"
    },
    {
      "icon": "fab fa-git-alt",
      "label": "Git & GitHub"
    }
  ],
  "certifications": {
    "cards": [
      {
        "icon": "fab fa-aws",
        "title": "AWS Academy Cloud Foundations",
        "desc": "Graduate training badge in AWS cloud fundamentals and architecture — covering core services, pricing, and security.",
        "linkLabel": "View Badge",
        "linkHref": "https://www.credly.com/badges/850a46b9-cd01-46eb-a853-35550567b86c/linked_in?t=t3kloq"
      },
      {
        "icon": "fas fa-robot",
        "title": "Getting Started with AI",
        "desc": "Comprehensive introduction to Artificial Intelligence concepts, ethical AI, and practical applications across industries.",
        "linkLabel": "View Badge",
        "linkHref": "https://www.credly.com/badges/de0e7fd4-8593-48c7-95f6-104af1769c4e/linked_in?t=t3kl17"
      },
      {
        "icon": "fas fa-cloud",
        "title": "Journey to Cloud",
        "desc": "Envisioning cloud-first solutions, digital transformation strategies, and enterprise architecture design.",
        "linkLabel": "View Badge",
        "linkHref": "https://www.credly.com/badges/85e4145d-ecb3-4b8f-bb30-e4e47b4a26cc/linked_in?t=t3kkzf"
      },
      {
        "icon": "fas fa-code",
        "title": "Web Development Fundamentals",
        "desc": "Full-stack web development covering front-end technologies, responsive design, and modern deployment pipelines.",
        "linkLabel": "View Badge",
        "linkHref": "https://www.credly.com/badges/2977f3c8-acb9-4ad3-a4fb-37ce1220d25d/linked_in_profile"
      },
      {
        "icon": "fas fa-project-diagram",
        "title": "Solution Architecture",
        "desc": "Job simulation in designing scalable, resilient solution architectures for enterprise-grade systems.",
        "linkLabel": "View Certificate",
        "linkHref": "https://media.licdn.com/dms/image/v2/D4E22AQEGpdCmKHz7zA/feedshare-shrink_800/B4EZddSqCDHYAg-/0/1749616862439?e=1766620800&v=beta&t=_TCJKrqS71aJvjW24OvR1IKrAknmvRVPPPjzfHIsnjY"
      },
      {
        "icon": "fab fa-microsoft",
        "title": "Azure Fundamentals",
        "desc": "Microsoft Azure cloud computing essentials — virtual machines, storage, networking, and identity management.",
        "linkLabel": "View Badge",
        "linkHref": "https://skillsoft.digitalbadges.skillsoft.com/481daa56-525f-46d3-b249-ff884ef8ee85"
      }
    ],
    "gallery": [
      {
        "icon": "fa-brain",
        "name": "AI & Machine Learning",
        "items": [
          {
            "img": "assets/certificates/ai-ml/deep-learning-tensorflow-ibm.jpg",
            "alt": "Deep Learning using TensorFlow – IBM",
            "title": "Deep Learning using TensorFlow"
          },
          {
            "img": "assets/certificates/ai-ml/getting-started-ai-ibm-skillsbuild.jpg",
            "alt": "Getting Started with Artificial Intelligence – IBM SkillsBuild",
            "title": "Getting Started with Artificial Intelligence"
          },
          {
            "img": "assets/certificates/ai-ml/ibm-watson-services-rapid-dev.jpg",
            "alt": "IBM Watson Services – Rapid Development – IBM",
            "title": "IBM Watson Services – Rapid Development"
          },
          {
            "img": "assets/certificates/ai-ml/intro-to-ai-simplilearn.jpg",
            "alt": "Introduction to Artificial Intelligence – Simplilearn SkillUp",
            "title": "Introduction to Artificial Intelligence"
          },
          {
            "img": "assets/certificates/ai-ml/intro-generative-ai-studio-google-cloud.jpg",
            "alt": "Introduction to Generative AI Studio – Google Cloud + Simplilearn",
            "title": "Introduction to Generative AI Studio"
          },
          {
            "img": "assets/certificates/ai-ml/machine-learning-ethnotech.jpg",
            "alt": "Machine Learning – Ethnotech Academy",
            "title": "Machine Learning"
          },
          {
            "img": "assets/certificates/ai-ml/machine-learning-intel-edgate.jpg",
            "alt": "Machine Learning – Intel EdGate Technologies",
            "title": "Machine Learning"
          },
          {
            "img": "assets/certificates/ai-ml/predictive-analytics-ibm-spss.jpg",
            "alt": "Predictive Analytics using IBM SPSS Modeler – IBM",
            "title": "Predictive Analytics using IBM SPSS Modeler"
          }
        ]
      },
      {
        "icon": "fa-cloud",
        "name": "Cloud Computing",
        "items": [
          {
            "img": "assets/certificates/cloud-computing/aws-academy-cloud-foundations.jpg",
            "alt": "AWS Academy Graduate – Cloud Foundations – AWS Academy",
            "title": "AWS Academy Graduate – Cloud Foundations"
          },
          {
            "img": "assets/certificates/cloud-computing/aws-solutions-architecture-forage.jpg",
            "alt": "AWS Solutions Architecture – Virtual Job Simulation – Forage + AWS",
            "title": "AWS Solutions Architecture – Virtual Job Simulation"
          },
          {
            "img": "assets/certificates/cloud-computing/journey-to-cloud-ibm.jpg",
            "alt": "Journey to Cloud – Envisioning Your Solution – IBM SkillsBuild",
            "title": "Journey to Cloud – Envisioning Your Solution"
          },
          {
            "img": "assets/certificates/cloud-computing/azure-fundamentals-infosys.jpg",
            "alt": "Microsoft Azure Fundamentals – Infosys Springboard",
            "title": "Microsoft Azure Fundamentals"
          },
          {
            "img": "assets/certificates/cloud-computing/azure-fundamentals-skillsoft.jpg",
            "alt": "Microsoft Azure Fundamentals – Skillsoft",
            "title": "Microsoft Azure Fundamentals"
          }
        ]
      },
      {
        "icon": "fa-code",
        "name": "Web Development & Software",
        "items": [
          {
            "img": "assets/certificates/web-development/frontend-webdev-internship-ibm-edunet.jpg",
            "alt": "Front-End Web Development Internship – IBM SkillsBuild & Edunet Foundation",
            "title": "Front-End Web Development Internship"
          },
          {
            "img": "assets/certificates/web-development/web-dev-fundamentals-ibm.jpg",
            "alt": "Web Development Fundamentals – IBM SkillsBuild",
            "title": "Web Development Fundamentals"
          },
          {
            "img": "assets/certificates/web-development/website-dev-tutorial-infosys.jpg",
            "alt": "Website Development Tutorial – Infosys Springboard",
            "title": "Website Development Tutorial"
          }
        ]
      }
    ],
    "footerLinkHref": "https://www.linkedin.com/in/sudeenjain",
    "footerLinkLabel": "View All on LinkedIn"
  },
  "badges": {
    "items": [
      {
        "img": "assets/badges/prepare-data-ml-apis.png",
        "alt": "Prepare Data for ML APIs on Google Cloud",
        "title": "Prepare Data for ML APIs",
        "issuerIcon": "fab fa-google",
        "issuer": "Google Cloud",
        "desc": "Hands-on labs on preparing data for ML APIs using Dataflow, DataProc, and AI APIs.",
        "date": "Apr 14, 2026",
        "expiry": "No Expiration",
        "expiryIcon": "fas fa-infinity",
        "skills": [
          "Python",
          "TensorFlow",
          "Dataflow",
          "DataProc",
          "Vertex AI",
          "ML"
        ],
        "linkHref": "https://www.credly.com/badges/d6534857-e7f5-49d5-be4c-d40a91e5cb48"
      },
      {
        "img": "assets/badges/deep-learning-tensorflow.png",
        "alt": "Deep Learning using TensorFlow",
        "title": "Deep Learning using TensorFlow",
        "issuerIcon": "fas fa-industry",
        "issuer": "IBM",
        "desc": "Deep learning concepts including CNNs, RNNs, and autoencoders using TensorFlow.",
        "date": "Mar 30, 2026",
        "expiry": "No Expiration",
        "expiryIcon": "fas fa-infinity",
        "skills": [
          "Deep Learning",
          "TensorFlow",
          "CNN",
          "RNN",
          "Autoencoders"
        ],
        "linkHref": "https://www.credly.com/badges/a289455e-4038-4810-a13d-f07613725b8b"
      },
      {
        "img": "assets/badges/it-specialist-ai.png",
        "alt": "IT Specialist – Artificial Intelligence",
        "title": "IT Specialist – Artificial Intelligence",
        "issuerIcon": "fas fa-graduation-cap",
        "issuer": "Certiport (Pearson VUE)",
        "desc": "Validated expertise in AI fundamentals, ML concepts, and cloud-based AI solutions.",
        "date": "Dec 16, 2025",
        "expiry": "Expires Dec 2030",
        "expiryIcon": "fas fa-clock",
        "skills": [
          "AI",
          "Machine Learning",
          "AWS",
          "Azure"
        ],
        "linkHref": "https://www.credly.com/badges/851d7a73-3caf-4851-baeb-52645964d1be"
      },
      {
        "img": "assets/badges/aws-cloud-foundations.png",
        "alt": "AWS Academy Cloud Foundations",
        "title": "AWS Academy – Cloud Foundations",
        "issuerIcon": "fab fa-aws",
        "issuer": "Amazon Web Services",
        "desc": "AWS Cloud Foundations training covering core services, architecture, pricing & support.",
        "date": "Jan 10, 2025",
        "expiry": "No Expiration",
        "expiryIcon": "fas fa-infinity",
        "skills": [
          "AWS Cloud",
          "AWS Architecture",
          "Core Services",
          "Pricing"
        ],
        "linkHref": "https://www.credly.com/badges/850a46b9-cd01-46eb-a853-35550567b86c"
      },
      {
        "img": "assets/badges/web-dev-fundamentals.png",
        "alt": "Web Development Fundamentals",
        "title": "Web Development Fundamentals",
        "issuerIcon": "fas fa-industry",
        "issuer": "IBM SkillsBuild",
        "desc": "Web development principles including front-end, back-end, responsive design & deployment.",
        "date": "Oct 3, 2025",
        "expiry": "No Expiration",
        "expiryIcon": "fas fa-infinity",
        "skills": [
          "HTML",
          "CSS",
          "JavaScript",
          "DevOps",
          "Responsive"
        ],
        "linkHref": "https://www.credly.com/badges/2977f3c8-acb9-4ad3-a4fb-37ce1220d25d"
      },
      {
        "img": "assets/badges/journey-to-cloud.png",
        "alt": "Journey to Cloud: Envisioning Your Solution",
        "title": "Journey to Cloud: Envisioning Your Solution",
        "issuerIcon": "fas fa-industry",
        "issuer": "IBM SkillsBuild",
        "desc": "Cloud computing concepts, digital transformation strategies & enterprise design thinking.",
        "date": "Jul 16, 2025",
        "expiry": "No Expiration",
        "expiryIcon": "fas fa-infinity",
        "skills": [
          "Cloud",
          "Microservices",
          "SaaS",
          "PaaS",
          "IaaS",
          "API"
        ],
        "linkHref": "https://www.credly.com/badges/85e4145d-ecb3-4b8f-bb30-e4e47b4a26cc"
      },
      {
        "img": "assets/badges/getting-started-ai.png",
        "alt": "Getting Started with Artificial Intelligence",
        "title": "Getting Started with AI",
        "issuerIcon": "fas fa-robot",
        "issuer": "IBM SkillsBuild",
        "desc": "Comprehensive introduction to Artificial Intelligence concepts, ethical AI, and practical applications across industries.",
        "date": "2025",
        "expiry": "No Expiration",
        "expiryIcon": "fas fa-infinity",
        "skills": [
          "AI Fundamentals",
          "Ethical AI",
          "Applications"
        ],
        "linkHref": "https://www.credly.com/badges/de0e7fd4-8593-48c7-95f6-104af1769c4e"
      }
    ],
    "footerLinkHref": "https://www.credly.com/users/sudeenjain",
    "footerLinkLabel": "View All Badges on Credly"
  },
  "internships": [
    {
      "img": "assets/internships/aiml-averixis.jpg",
      "alt": "AI & ML Internship - Averixis Solutions",
      "title": "AI & Machine Learning Internship",
      "org": "Averixis Solutions",
      "duration": "Aug 2025 – Dec 2025",
      "desc": "Built strong foundations in AI & ML concepts, applied learning through practical tasks, and developed problem-solving skills aligned with industry expectations. Recognized under AICTE.",
      "highlights": [
        "AI",
        "Machine Learning",
        "AICTE",
        "Problem Solving",
        "Data Analysis"
      ],
      "status": "Completed"
    },
    {
      "img": "assets/internships/frontend-edunet.jpg",
      "alt": "Front-End Web Development Internship",
      "title": "Front-End Web Development Internship",
      "org": "Edunet Foundation & IBM SkillsBuild",
      "duration": "6 Weeks",
      "desc": "Gained hands-on experience building responsive and interactive web pages, working with HTML, CSS, JavaScript, and modern frameworks. Strengthened UI/UX design principles and deployment skills. In collaboration with AICTE.",
      "highlights": [
        "HTML",
        "CSS",
        "JavaScript",
        "UI/UX",
        "Responsive Design",
        "IBM SkillsBuild"
      ],
      "status": "Completed"
    },
    {
      "img": "assets/internships/ai-cloud-edunet.jpg",
      "alt": "Emerging Technologies Internship - AI & Cloud",
      "title": "Emerging Technologies — AI & Cloud",
      "org": "Edunet Foundation & IBM",
      "duration": "4 Weeks",
      "desc": "Strengthened skills in AI and Cloud platforms while gaining hands-on exposure to real-world applications. In collaboration with AICTE and IBM.",
      "highlights": [
        "AI",
        "Cloud Computing",
        "IBM",
        "AICTE",
        "Emerging Tech"
      ],
      "status": "Completed"
    },
    {
      "img": "assets/internships/uiux-snestron.jpg",
      "alt": "UI/UX Design Internship - Snestron Systems",
      "title": "UI/UX Design Internship",
      "org": "Snestron Systems Pvt. Ltd.",
      "duration": "Jul 2025 – Aug 2025",
      "desc": "Enhanced understanding of user-centered design and creative problem solving. Completed a 4-week online internship contributing meaningfully to design projects.",
      "highlights": [
        "UI/UX",
        "User Research",
        "Prototyping",
        "Design Thinking",
        "Figma"
      ],
      "status": "Completed"
    },
    {
      "img": "assets/internships/abhimo.jpg",
      "alt": "Web Development Internship - Abhimo Technologies",
      "title": "Web Development Internship",
      "org": "Abhimo Technologies",
      "duration": "2026",
      "desc": "Contributed to full-stack web development projects, building and debugging PHP backends and JavaScript frontends across multiple client products.",
      "highlights": [
        "PHP",
        "JavaScript",
        "MySQL",
        "Full-Stack",
        "Debugging"
      ],
      "status": "Completed"
    }
  ],
  "projects": [
    {
      "icon": "fa-gamepad",
      "title": "Game Level Difficulty Balancer",
      "desc": "An algorithmic solution that dynamically optimizes game difficulty curves using DAA principles — ensuring engaging, balanced gameplay.",
      "tech": [
        "Python",
        "Algorithms",
        "DAA",
        "Dynamic Programming"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/DAA-miniproject",
          "label": "Source Code",
          "isDemo": false
        }
      ]
    },
    {
      "icon": "fa-book",
      "title": "Book Recommender System",
      "desc": "An intelligent book recommendation engine built with Advanced Java that suggests titles based on user reading preferences and behavior patterns.",
      "tech": [
        "Java",
        "Advanced Java",
        "Recommendation Engine"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/Adavanced-Java-BookRecommender",
          "label": "Source Code",
          "isDemo": false
        }
      ]
    },
    {
      "icon": "fa-cogs",
      "title": "IBM ML Recommender",
      "desc": "A Python-based collaborative filtering system that leverages machine learning to predict user preferences and generate personalized recommendations.",
      "tech": [
        "Python",
        "Machine Learning",
        "Collaborative Filtering",
        "IBM"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/IBM-miniproject",
          "label": "Source Code",
          "isDemo": false
        }
      ]
    },
    {
      "icon": "fa-utensils",
      "title": "Interactive Recipe Finder",
      "desc": "A dynamic web application enabling users to search, filter, and discover recipes with real-time ingredient matching and beautiful UI.",
      "tech": [
        "HTML",
        "CSS",
        "JavaScript",
        "API Integration"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/-interactive-recipe-finder",
          "label": "Source Code",
          "isDemo": false
        }
      ]
    },
    {
      "icon": "fa-exchange-alt",
      "title": "Currency Converter",
      "desc": "A real-time currency exchange tool that connects to live APIs — supporting 150+ currencies with instant conversion rates and clean interface.",
      "tech": [
        "JavaScript",
        "REST API",
        "Exchange Rates",
        "Responsive"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/currency-converter",
          "label": "Source Code",
          "isDemo": false
        }
      ]
    },
    {
      "icon": "fa-tasks",
      "title": "Smart To-Do List",
      "desc": "A Python-powered task management application with priority sorting, deadline tracking, and persistent storage for efficient productivity.",
      "tech": [
        "Python",
        "File I/O",
        "CLI",
        "Task Management"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/to-do-list-in-python",
          "label": "Source Code",
          "isDemo": false
        }
      ]
    },
    {
      "icon": "fa-hand-paper",
      "title": "Gesture Flow",
      "desc": "A gesture-controlled interface that interprets hand movements in real time to drive on-screen actions and interactions.",
      "tech": [
        "Python",
        "Computer Vision",
        "OpenCV"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/guesture_flow",
          "label": "Source Code",
          "isDemo": false
        },
        {
          "href": "https://guestureflow.vercel.app/",
          "label": "Live Demo",
          "isDemo": true
        }
      ]
    },
    {
      "icon": "fa-clipboard-check",
      "title": "Attendance Tracker",
      "desc": "A web-based attendance management system for recording, tracking, and reviewing attendance records efficiently.",
      "tech": [
        "JavaScript",
        "Web App",
        "Data Tracking"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/attendence_tracker",
          "label": "Source Code",
          "isDemo": false
        },
        {
          "href": "https://attendance-tracker-eight-blush.vercel.app/",
          "label": "Live Demo",
          "isDemo": true
        }
      ]
    },
    {
      "icon": "fa-film",
      "title": "Movie Recommendation",
      "desc": "A recommendation engine that suggests movies to users based on content similarity and viewing preferences.",
      "tech": [
        "Python",
        "Machine Learning",
        "Recommendation Engine"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/Movie_Recommendation",
          "label": "Source Code",
          "isDemo": false
        },
        {
          "href": "https://movie-recommendation-plum-phi.vercel.app/",
          "label": "Live Demo",
          "isDemo": true
        }
      ]
    },
    {
      "icon": "fa-user-circle",
      "title": "Portfolio Website",
      "desc": "An earlier version of this personal portfolio site, showcasing projects, certifications, and skills.",
      "tech": [
        "HTML",
        "CSS",
        "JavaScript"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/portfolio",
          "label": "Source Code",
          "isDemo": false
        },
        {
          "href": "https://sudeenjain.github.io/portfolio/",
          "label": "Live Demo",
          "isDemo": true
        }
      ]
    },
    {
      "icon": "fa-robot",
      "title": "FolioAI",
      "desc": "An AI-powered portfolio assistant that helps generate and organize portfolio content automatically.",
      "tech": [
        "AI",
        "JavaScript",
        "Automation"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/folioAI",
          "label": "Source Code",
          "isDemo": false
        },
        {
          "href": "https://portfolio-ai-eta-dusky.vercel.app/",
          "label": "Live Demo",
          "isDemo": true
        }
      ]
    },
    {
      "icon": "fa-briefcase",
      "title": "CareerReady",
      "desc": "A career-preparation platform helping users build job-readiness skills and track their progress.",
      "tech": [
        "JavaScript",
        "Web App",
        "Career Tools"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/CarrerReady",
          "label": "Source Code",
          "isDemo": false
        },
        {
          "href": "https://dist-steel-beta-55.vercel.app/#/landing",
          "label": "Live Demo",
          "isDemo": true
        }
      ]
    },
    {
      "icon": "fa-shopping-cart",
      "title": "Product Recommendation",
      "desc": "An AI-driven recommendation system that suggests products to users based on browsing and purchase behavior.",
      "tech": [
        "Python",
        "AI",
        "Recommendation Engine"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/Product_Recommendation",
          "label": "Source Code",
          "isDemo": false
        },
        {
          "href": "https://ai-recommendation-system-gamma.vercel.app/",
          "label": "Live Demo",
          "isDemo": true
        }
      ]
    },
    {
      "icon": "fa-project-diagram",
      "title": "Connects The Dots",
      "desc": "An algorithmic visualization project exploring graph connectivity and pathfinding concepts, built as a DAA mini-project.",
      "tech": [
        "Python",
        "Algorithms",
        "Graph Theory"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/Connect_the_Dots",
          "label": "Source Code",
          "isDemo": false
        },
        {
          "href": "https://daa-miniproject.vercel.app/",
          "label": "Live Demo",
          "isDemo": true
        }
      ]
    },
    {
      "icon": "fa-star",
      "title": "Amazon Bestseller Recommender",
      "desc": "A machine learning model that analyzes Amazon bestseller data to recommend similar high-performing products.",
      "tech": [
        "Python",
        "Machine Learning",
        "Data Analysis"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/Amazon-Bestseller-Recommender",
          "label": "Source Code",
          "isDemo": false
        },
        {
          "href": "https://ibm-mini-project.vercel.app/",
          "label": "Live Demo",
          "isDemo": true
        }
      ]
    },
    {
      "icon": "fa-spell-check",
      "title": "AI Dictionary",
      "desc": "An AI-powered dictionary tool offering smart word definitions, usage examples, and contextual understanding.",
      "tech": [
        "AI",
        "NLP",
        "JavaScript"
      ],
      "links": [
        {
          "href": "https://github.com/sudeenjain/AI_dictonary",
          "label": "Source Code",
          "isDemo": false
        }
      ]
    }
  ],
  "contact": {
    "socials": [
      {
        "href": "https://github.com/sudeenjain",
        "title": "GitHub",
        "icon": "fab fa-github"
      },
      {
        "href": "https://www.linkedin.com/in/sudeenjain",
        "title": "LinkedIn",
        "icon": "fab fa-linkedin"
      },
      {
        "href": "https://instagram.com/sudeen_jain",
        "title": "Instagram",
        "icon": "fab fa-instagram"
      }
    ],
    "cards": [
      {
        "icon": "fas fa-envelope",
        "label": "Email",
        "linkHref": "mailto:sudinhr1@gmail.com",
        "linkText": "sudinhr1@gmail.com"
      },
      {
        "icon": "fab fa-github",
        "label": "GitHub",
        "linkHref": "https://github.com/sudeenjain",
        "linkText": "github.com/sudeenjain"
      },
      {
        "icon": "fab fa-linkedin",
        "label": "LinkedIn",
        "linkHref": "https://www.linkedin.com/in/sudeenjain",
        "linkText": "linkedin.com/in/sudeenjain"
      }
    ],
    "resumeHref": "resume.pdf",
    "resumeLabel": "Download Resume"
  },
  "getInTouch": {
    "text": "Have a project idea, a collaboration opportunity, or just want to say hello? Drop me a message — I'd love to hear from you!",
    "formAction": "https://formspree.io/f/xgvgznla"
  },
  "meta": {
    "favicon": "assets/favicon.png",
    "title": "Sudeen Jain | AI & ML Engineer | Portfolio",
    "description": "Sudeen Jain is an Artificial Intelligence and Machine Learning student at Srinivas University. View projects, certifications, GitHub work, and resume.",
    "keywords": "Sudeen Jain, AI Engineer, AIML Student, Portfolio, GitHub, Srinivas University, Machine Learning, Python Developer",
    "author": "Sudeen Jain",
    "ogUrl": "https://sudeenjain.github.io/",
    "ogImage": "https://sudeenjain.github.io/profile.jpg"
  }
};
