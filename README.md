# 🚀 FormoraX — Forms & Feedback Management System

![FormoraX Banner](https://via.placeholder.com/1200x400/667eea/ffffff?text=FormoraX+-+Forms+%26+Feedback+System)

A full-stack web application that allows users to create custom forms, share them via links, collect anonymous responses, and manage everything in a personal dashboard.

## ✨ Features

- 🔐 **User Authentication** — Signup, Login, JWT-based auth
- 📝 **Form Builder** — Create forms with text & multiple choice questions
- 🔗 **Shareable Links** — Public URLs for anyone to submit responses
- 📊 **Response Dashboard** — View, filter, and export responses
- 🎨 **Modern UI** — Dark theme with glassmorphism effects
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Custom Glassmorphism |
| **Backend** | Spring Boot 3.2 + Java 17 |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT + Spring Security |
| **Deployment** | Vercel (Frontend) + Render (Backend) |


## 🚀 Live Demo

🔗 **Frontend:** [https://formora-x-brown.vercel.app](https://formora-x-brown.vercel.app)  
🔗 **Backend API:** [https://formorax.onrender.com/api](https://formorax.onrender.com/api)

## 📦 Installation

### Prerequisites
- Node.js 18+
- Java 17+
- MongoDB (local or Atlas)
- Maven

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/formorax-backend.git
cd formorax-backend

# Configure application.properties
# Update MongoDB URI and JWT secret

# Run with Maven
./mvnw spring-boot:run
