# Sudeen Jain H R | AIML Engineer Portfolio

## 🚀 Overview

This is the personal portfolio website for **Sudeen Jain H R**, an aspiring **AI & Machine Learning Engineer** and **Cloud Enthusiast**.

The design is modern, cyber-themed, featuring a dark mode aesthetic with vibrant cyan/violet accents and a dynamic, low-poly particle background implemented with **Three.js**. The structure is highly modular, making it easy to maintain and update each section independently.

## ✨ Features

* **Cyberpunk/Dark Mode Design:** A sleek, high-contrast visual style utilizing glass-like effects (`glassmorphism`) and neon colors.
* **Dynamic Three.js Background:** A unique, interactive 3D particle animation runs in the background for an immersive experience.
* **Modular Structure:** The project is split into multiple HTML fragments (`includes/`), CSS (`css/style.css`), and JavaScript files (`js/particles.js`, `js/scripts.js`) for easy management.
* **Responsive Layout:** Fully optimized for both desktop and mobile devices.
* **Scroll Animations:** Uses the **AOS (Animate On Scroll)** library to bring elements to life as the user scrolls.
* **Formspree Integration:** Includes a functional contact form ready to be connected to a Formspree endpoint for message relay.

---

## 🛠️ Technologies Used

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Core website structure and logic. |
| **3D/Graphics** | **Three.js (via CDN)** | Generates the dynamic 3D particle background. |
| **Styling** | **Custom CSS, Google Fonts (Orbitron & Outfit)** | Handles all custom styling and typography. |
| **Animation** | **AOS (Animate On Scroll)** | Manages smooth element reveal animations. |
| **Icons** | **Font Awesome** | Provides vector icons for skills, socials, and contact points. |
| **Contact** | **Formspree** | Serverless email handling for the contact form. |

---

## 🚀 Project Name: Professional Portfolio Website

This repository contains the source code for a professional portfolio website designed to showcase skills, projects, and educational background. The project employs a modular and organized structure for enhanced maintainability and clear separation of concerns.

---

## 📂 Project Structure

The project is meticulously organized into logical directories, utilizing modular HTML fragments to simplify content management.

```text
portfolio/
├── index.html             # Main entry point, links, and layout placeholders
├── profile.jpg            # Profile picture asset
├── resume.pdf             # Resume file (linked in the Contact section)
├── css/
│   └── style.css          # All custom CSS and styling
├── js/
│   ├── particles.js       # Three.js particle background logic
│   └── scripts.js         # DOM loading logic, menu handlers, AOS initialization
├── includes/              # Separate HTML fragments for each major section
│   ├── nav.html           # Navigation Bar
│   ├── home.html          # Hero Section
│   ├── about.html         # About Me & Stats
│   ├── skills.html        # Technical Skills Badges
│   ├── certifications.html# Certifications cards
│   ├── projects.html      # Project cards
│   ├── contact.html       # Socials and Resume Download
│   └── get-in-touch.html  # Contact Form
```

---

## 🧭 File Descriptions

### Root Directory (`portfolio/`)

| File/Directory | Description |
| :--- | :--- |
| `index.html` | The **main entry point** and core template, linking all assets and integrating the HTML fragments. |
| `profile.jpg` | The primary **profile picture** asset. |
| `resume.pdf` | The downloadable **resume file** for visitors. |

### `css/`

| File | Description |
| :--- | :--- |
| `style.css` | Contains all **custom styling**, including layout, typography, and responsive design logic. |

### `js/`

| File | Description |
| :--- | :--- |
| `particles.js` | Dedicated script for the **Three.js particle background logic**. |
| `scripts.js` | Main application script for **DOM loading**, **menu handlers**, and initializing libraries like **AOS** (Animate On Scroll). |

### `includes/` (Modular HTML Fragments)

This directory holds reusable HTML partials that make up the content sections of the portfolio.

| File | Section Content |
| :--- | :--- |
| `nav.html` | **Navigation Bar** structure. |
| `home.html` | **Hero Section** content. |
| `about.html` | **About Me** information and statistics. |
| `skills.html` | **Technical Skills** display. |
| `certifications.html` | **Certifications** cards/list. |
| `projects.html` | **Project** cards/grid. |
| `contact.html` | **Social media links** and resume download prompt. |
| `get-in-touch.html` | **Contact Form** structure. |

---

## 🛠️ Usage

To view the portfolio locally, simply open `index.html` in your web browser. A local development server is recommended to ensure that dynamic inclusion of the fragments in the `includes/` directory works correctly.

## ⚙️ Setup and Installation

This is a static website and requires no backend server setup.

### 1. Clone the Repository

```bash
git clone [https://sudeenjain.github.io/portfolio/]
cd portfolio
