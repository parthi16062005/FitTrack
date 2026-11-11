# FitTrack – Fitness & Workout Management Platform

A full-stack fitness and workout management platform built using **FastAPI, React, JavaScript, SQLAlchemy, and SQLite**.

FitTrack helps users manage their fitness activities, track workout progress, monitor nutrition and hydration, set fitness goals, receive workout suggestions, and maintain a consistent fitness routine.

---

## Project Overview

FitTrack is designed to provide a centralized platform for personal fitness management.

Users can:
- Manage workout activities.
- Track daily fitness progress.
- Set and monitor fitness goals.
- Analyze workout performance.
- Manage nutrition and water intake.
- Receive personalized workout suggestions.
- Track workout sessions using a timer.
- Monitor workout streaks and achievements.
- Manage reminders and notifications.

## Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Axios
- Vite

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- JWT Authentication
- Bcrypt Password Hashing

### Development Tools
- Visual Studio Code
- Swagger UI
- Git
- GitHub
- Node.js
- Python

---

## Project Modules

FitTrack consists of 19 modules organized into three phases.

### Phase 1 – Core Fitness Management

| Module | Name | Description |
|---|---|---|
| 1 | Authentication | User registration, login, and JWT authentication. |
| 2 | Workout Management | Create, manage, and track workouts. |
| 3 | Daily Progress Tracking | Record and monitor daily fitness progress. |
| 4 | Goal Setting | Create and monitor personal fitness goals. |
| 5 | Reports & Analytics | Analyze workout and fitness statistics. |
| 6 | Notifications | Manage in-app notifications and unread alerts. |

### Phase 2 – Advanced Fitness Management

| Module | Name | Description |
|---|---|---|
| 7 | Workout Plans & Scheduling | Create and organize workout schedules. |
| 8 | Exercise Library | Browse and manage exercise information. |
| 9 | Progress Comparison | Compare fitness progress over time. |
| 10 | Streak Tracking | Monitor workout consistency and streaks. |
| 11 | Achievement Badges | Track fitness achievements and milestones. |
| 12 | Personalized Dashboard | Display personalized fitness information. |

### Phase 3 – Smart Fitness Features

| Module | Name | Description |
|---|---|---|
| 13 | Nutrition & Meal Tracking | Record meals, calories, and macronutrients. |
| 14 | Water Intake Tracker | Track daily water consumption. |
| 15 | AI Workout Suggestions | Generate workout recommendations based on fitness data. |
| 16 | Workout Timer & Live Tracking | Start, pause, resume, and finish workout sessions. |
| 17 | Third-Party Integration | Optional integration module, not implemented. |
| 18 | Advanced Analytics Dashboard | Display advanced fitness and performance analytics. |
| 19 | In-App Reminders & Alerts | Schedule reminders for fitness activities. |

---

## Project Structure

```text
FitTrack/
│
├── backend/
│   │
│   ├── routers/
│   │   ├── auth_router.py
│   │   ├── workout_router.py
│   │   ├── progress_router.py
│   │   ├── goal_router.py
│   │   ├── analytics_router.py
│   │   ├── notification_router.py
│   │   ├── workout_plan_router.py
│   │   ├── exercise_router.py
│   │   ├── progress_comparison_router.py
│   │   ├── streak_router.py
│   │   ├── achievement_router.py
│   │   ├── personalized_dashboard_router.py
│   │   ├── nutrition_router.py
│   │   ├── water_router.py
│   │   ├── ai_suggestion_router.py
│   │   ├── workout_session_router.py
│   │   └── reminder_router.py
│   │
│   ├── venv/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── auth.py
│   ├── fittrack.db
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── style/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── index.html
│
└── README.md
```

*Note: This is a representative structure. Additional project files and assets may exist.*

---

## Installation and Setup

### Prerequisites

Install the following:

- Python 3.11 or higher
- Node.js and npm
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project:

```bash
cd FitTrack
```

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Authentication and Security

FitTrack implements:

- JWT-based authentication.
- Password hashing using Bcrypt.
- Protected frontend routes.
- Authenticated API endpoints.
- User-specific fitness data.
- Token-based API authorization.

Users must authenticate before accessing protected application features.

---

## Database

FitTrack uses SQLite with SQLAlchemy ORM.

The database stores information related to:

- Users
- Workouts
- Daily progress
- Fitness goals
- Notifications
- Workout plans
- Exercises
- Streaks
- Achievements
- Nutrition and meals
- Water intake
- Workout sessions
- Reminders

---

## API Documentation

FastAPI automatically generates interactive API documentation.

After starting the backend, access:

**Swagger UI**

http://127.0.0.1:8000/docs

**OpenAPI JSON**

http://127.0.0.1:8000/openapi.json

---

## Key Features

1. Secure user authentication.
2. Workout creation and management.
3. Daily fitness progress monitoring.
4. Fitness goal management.
5. Workout analytics and reports.
6. In-app notifications.
7. Workout planning and scheduling.
8. Exercise library.
9. Progress comparison.
10. Workout streak monitoring.
11. Achievement badges.
12. Personalized fitness dashboard.
13. Nutrition and meal tracking.
14. Water intake monitoring.
15. Rule-based AI workout recommendations.
16. Workout timer and live session tracking.
17. Advanced fitness analytics.
18. In-app reminders and alerts.

---

## Future Enhancements

- Third-party fitness application integration.
- Mobile application support.
- Advanced AI-based fitness recommendations.
- Wearable device integration.
- Cloud database and public deployment.
- Email and push notifications.

---

## Developer

**Project Name:** FitTrack – Fitness & Workout Management Platform

**Domain:** Fitness and Health Management

**Architecture:** Full-Stack Web Application

**Frontend:** React.js

**Backend:** FastAPI

**Database:** SQLite

---

## License

This project was developed for educational and academic purposes.