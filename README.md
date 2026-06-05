# Enterprise HVAC Field Operations Dashboard

An AI-engineered, enterprise-grade dashboard designed for HVAC companies to streamline field service management, dispatching, and real-time crew tracking. 

Built using modern generative AI workflows (**v0.dev** and **Cursor**), powered by **Mapbox**, and hosted seamlessly on **Vercel**.

## 🚀 Live Demo
Check out the live deployment here: **[Insert Vercel Deployment URL Link Here]**

## ✨ Key Features

* **Mapbox Live Tracking:** Real-time geospatial visualization of field technician locations to optimize routing and dispatch.
* **Operational KPI Tiles:** At-a-glance metrics showing active crew counts, pending calls, completed jobs, and urgent alerts.
* **Technician Status Panel:** A left-side sidebar detailing active field crews and their real-time operational status.
* **Live Activity Feed:** A right-side streaming feed logging instant updates as technicians input field data.

## 🛠️ Tech Stack & Workflow

* **UI Generation:** [v0.dev by Vercel](https://v0.dev) (Component scaffolding and layout design)
* **Development Environment:** [Cursor AI](https://cursor.com) (Code refinement, logic implementation, and prompt-driven engineering)
* **Mapping API:** [Mapbox GL JS](https://mapbox.com) (Real-time vehicle and crew tracking)
* **Frontend Framework:** [Next.js / React] *(Change if you used Vite or another framework)*
* **Styling:** Tailwind CSS (via v0.dev components)
* **Hosting & Deployment:** [Vercel](https://vercel.com)

## 🔧 Getting Started

To run this dashboard locally, follow these steps:

### Prerequisites
* Node.js installed on your machine
* A Mapbox access token (Get one for free at [mapbox.com](https://mapbox.com))

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com[Your-GitHub-Username]/[Your-Repo-Name].git
   cd [Your-Repo-Name]
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Mapbox token:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

## 📦 Deployment

This project is configured for one-click deployment on Vercel. 

Ensure you add your `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` environment variable in your Vercel project dashboard settings during deployment.
