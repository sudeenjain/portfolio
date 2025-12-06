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

## 📂 Project Structure

The project is meticulously organized into logical directories for enhanced maintainability:
portfolio-root/ ├── index.html # Main entry point, links, and layout placeholders ├── profile.jpg # Profile picture asset ├── resume.pdf # Resume file (linked in the Contact section) ├── css/ │ └── style.css # All custom CSS and styling ├── js/ │ ├── particles.js # Three.js particle background logic │ └── scripts.js # DOM loading logic, menu handlers, AOS initialization └── includes/ # Separate HTML fragments for each major section ├── nav.html # Navigation Bar ├── home.html # Hero Section ├── about.html # About Me & Stats ├── skills.html # Technical Skills Badges ├── certifications.html # Certifications cards ├── projects.html # Project cards ├── contact.html # Socials and Resume Download └── get-in-touch.html # Contact Form

## ⚙️ Setup and Installation

This is a static website and requires no backend server setup.

### 1. Clone the Repository

```bash
git clone [https://sudeenjain.github.io/portfolio/]
cd portfolio
