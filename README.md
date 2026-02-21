Here is a comprehensive `README.md` file designed for your MERN stack Sydney Event Scraper project. You can copy and paste this directly into your GitHub repository.

---

# Sydney Event Scraper & Admin Dashboard

A full-stack web application that automatically scrapes event data for Sydney, Australia, and provides an authenticated admin dashboard for event management.

## 🚀 Live Demo

* **Frontend:** [https://sydney-events-sigma.vercel.app](https://sydney-events-sigma.vercel.app)
* **Backend:** [https://sydney-events-0qvx.onrender.com](https://sydney-events-0qvx.onrender.com)

---

## 🛠 Tech Stack

* **Frontend:** React.js, Tailwind CSS, Vite.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas.
* **Authentication:** Google OAuth 2.0 via Passport.js.
* **Scraper:** Python (BeautifulSoup/Requests).
* **Automation:** GitHub Actions.

---

## 📋 Features

### 1. Automated Event Scraper

* Scrapes public event websites for data in Sydney, Australia.
* Runs automatically every 24 hours via GitHub Actions.
* Deduplicates events and saves new data directly to MongoDB.

### 2. Public Event Listing

* Displays all "New" or "Imported" events to public users.
* Includes search functionality and filtering by date/category.
* Responsive UI built with React.

### 3. Admin Dashboard (Protected)

* Secure login using Google OAuth.
* Admins can "Import" events, marking them for special status in the database.
* View captured ticket leads and manage event statuses.

---

## ⚙️ Configuration & Environment Variables

### Backend (Render)

Create these variables in your Render environment:

* `MONGO_URI`: Your MongoDB Atlas connection string.
* `GOOGLE_CLIENT_ID`: From Google Cloud Console.
* `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
* `FRONTEND_URL`: `https://sydney-events-sigma.vercel.app`.
* `SESSION_SECRET`: A random string for session encryption.

### Scraper (GitHub Secrets)

Add these to your GitHub Repository Secrets:

* `MONGO_URI`: Same as above to allow the Python script to write data.

---

## 📂 Project Structure

```text
├── backend/
│   ├── config/          # Passport.js configuration
│   ├── models/          # Mongoose schemas (Event, User, Lead)
│   ├── routes/          # Auth and Event API routes
│   └── server.js        # Main entry point
├── frontend/
│   ├── src/
│   │   ├── pages/       # Public and Dashboard components
│   │   └── App.jsx      # React Router setup
│   └── vercel.json      # Client-side routing fix
├── scraper/
│   └── scraper.py       # Python scraping logic
└── .github/workflows/
    └── scrape.yml       # Automation schedule

```

---

## 📝 Deployment Notes

* **Frontend:** Hosted on Vercel with a `rewrites` rule in `vercel.json` to support React Router paths like `/dashboard`.
* **Backend:** Hosted on Render using the `backend` folder as the root directory.
* **CORS:** Configured to allow requests only from the production Vercel domain.

---

**Is there any other part of the assignment requirements you need me to double-check before you submit?**
