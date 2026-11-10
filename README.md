# FitTrack – Fitness & Workout Management Platform

## Project Overview

FitTrack is a full-stack Fitness and Workout Management Platform designed to help users manage workouts, track daily fitness progress, set fitness goals, monitor performance, and maintain healthy exercise habits.

## Technology Stack

**Backend:**
- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- JWT Authentication
- Passlib and Bcrypt

**Frontend:**
- React.js
- Vite
- JavaScript
- React Router DOM
- Axios
- CSS

**Development Tools:**
- Visual Studio Code
- Swagger UI
- PowerShell
- Git

## Project Structure

    FitTrack/
    ├── backend/
    │   ├── routers/
    │   │   ├── __init__.py
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
    │   │   └── personalized_dashboard_router.py
    │   ├── venv/
    │   ├── database.py
    │   ├── models.py
    │   ├── schemas.py
    │   ├── auth.py
    │   ├── main.py
    │   └── fittrack.db
    │
    └── frontend/
        ├── public/
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   ├── services/
        │   ├── style/
        │   ├── App.jsx
        │   ├── App.css
        │   └── index.css
        ├── package.json
        └── vite.config.js

## Project Modules

### Phase 1 – Core Modules

### Module 1: User Authentication
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Current user profile.
- Protected frontend routes.

### Module 2: Workout Management
- Add workouts.
- View workout history.
- Update workout details.
- Delete workouts.
- Track workout duration.
- Track calories burned.
- Manage workout categories.

### Module 3: Daily Progress Tracking
- Record daily fitness progress.
- Track total workouts.
- Monitor calories burned.
- Monitor workout duration.
- View daily progress records.

### Module 4: Goal Setting
- Create fitness goals.
- Set target values.
- Track current progress.
- Update and delete goals.
- Monitor active and completed goals.

### Module 5: Reports & Analytics
- Weekly workout analytics.
- Monthly workout analytics.
- Workout statistics.
- Goal-related analytics.
- Fitness performance reports.

### Module 6: Notifications
- Notification management.
- View notifications.
- Track unread notifications.
- Display unread notification count.
- Automatic notification count refresh.

### Phase 2 – Advanced Modules

### Module 7: Workout Plans & Scheduling
- Create workout plans.
- Schedule workouts by date.
- View upcoming workouts.
- Update and delete scheduled plans.
- Monthly interactive calendar.
- Select dates to view scheduled workouts.

### Module 8: Exercise Library
- Browse exercises.
- Search exercises.
- Filter by category.
- Filter by muscle group.
- Filter by difficulty.
- View exercise instructions.
- Manage exercise records.

### Module 9: Progress Comparison
- Weekly progress comparison.
- Monthly progress comparison.
- Compare workout totals.
- Compare calories burned.
- Compare workout duration.
- Calculate percentage changes.

### Module 10: Streak Tracking
- Track current workout streak.
- Track longest workout streak.
- Calculate total active days.
- Monitor workout consistency.

### Module 11: Achievement Badges
- First Workout Badge.
- 10 Workouts Badge.
- 50 Workouts Badge.
- 7-Day Streak Badge.
- 30-Day Streak Badge.
- Goal Achiever Badge.
- Track unlocked achievements.

### Module 12: Personalized Dashboard
- Personalized fitness overview.
- Total workouts.
- Total calories burned.
- Total workout duration.
- Goal completion percentage.
- Current workout streak.
- Longest workout streak.
- Achievement badge summary.
- Recent workout history.

**Status:** Backend API and frontend integration are in progress.

## Backend API Endpoints

### Authentication

| Method | Endpoint |
|---|---|
| POST | /auth/register |
| POST | /auth/login |
| POST | /auth/token |
| GET | /auth/me |

### Workout Management

| Method | Endpoint |
|---|---|
| POST | /workouts/ |
| GET | /workouts/ |
| PATCH | /workouts/{workout_id} |
| DELETE | /workouts/{workout_id} |

### Daily Progress

| Method | Endpoint |
|---|---|
| POST | /progress/ |
| GET | /progress/ |

### Goals

| Method | Endpoint |
|---|---|
| POST | /goals/ |
| GET | /goals/ |
| PUT | /goals/{goal_id} |
| DELETE | /goals/{goal_id} |

### Analytics

| Method | Endpoint |
|---|---|
| GET | /analytics/weekly |
| GET | /analytics/monthly |
| GET | /analytics/goals |

### Workout Plans

| Method | Endpoint |
|---|---|
| POST | /workout-plans/ |
| GET | /workout-plans/ |
| GET | /workout-plans/upcoming |
| PUT | /workout-plans/{plan_id} |
| DELETE | /workout-plans/{plan_id} |

### Exercise Library

| Method | Endpoint |
|---|---|
| POST | /exercises/ |
| GET | /exercises/ |
| GET | /exercises/{exercise_id} |
| PUT | /exercises/{exercise_id} |
| DELETE | /exercises/{exercise_id} |

### Progress Comparison

| Method | Endpoint |
|---|---|
| GET | /progress-comparison/weekly |
| GET | /progress-comparison/monthly |

### Streak Tracking

| Method | Endpoint |
|---|---|
| GET | /streaks/ |

### Achievement Badges

| Method | Endpoint |
|---|---|
| GET | /achievements/ |

### Personalized Dashboard

| Method | Endpoint |
|---|---|
| GET | /personalized-dashboard/ |

## Database

FitTrack uses SQLite as its database.

**Database filename:** `fittrack.db`

SQLAlchemy is used for database operations and model management.

Main database entities:

- Users
- Workouts
- Progress
- Goals
- Notifications
- Workout Plans
- Exercises
- Progress Comparisons
- Workout Streaks
- Achievement Badges

## Authentication and Security

- JWT-based authentication.
- Password hashing using bcrypt.
- Protected API endpoints.
- User-specific data access.
- Axios authentication headers.
- Automatic logout when authentication expires.

**Frontend localStorage keys:**
- `fittrack_token`
- `fittrack_user`

## Installation and Setup

### Backend Setup

Open PowerShell and navigate to the backend directory:

    cd "$HOME\OneDrive\Desktop\FitTrack\backend"

Create a virtual environment:

    python -m venv venv

Activate the virtual environment:

    .\venv\Scripts\Activate.ps1

Install dependencies:

    python -m pip install fastapi uvicorn sqlalchemy "pydantic[email]" "python-jose[cryptography]" "passlib[bcrypt]" bcrypt==4.0.1 python-multipart

Start the backend server:

    python -m uvicorn main:app --reload

**Backend URL:** http://127.0.0.1:8000

**Swagger Documentation:** http://127.0.0.1:8000/docs

### Frontend Setup

Open another PowerShell terminal:

    cd "$HOME\OneDrive\Desktop\FitTrack\frontend"

Install frontend dependencies:

    npm install

Start the frontend development server:

    npm run dev

**Frontend URL:** http://localhost:5173

## Application Workflow

1. Open the FitTrack application.
2. Register a new user account.
3. Log in using registered credentials.
4. Access the protected dashboard.
5. Add and manage workouts.
6. Record daily fitness progress.
7. Create fitness goals.
8. Review analytics and reports.
9. Schedule workout plans.
10. Explore the exercise library.
11. Compare fitness progress.
12. Monitor workout streaks.
13. Unlock achievement badges.
14. View personalized fitness statistics.

## Main Features

- Full-stack web application.
- User authentication and authorization.
- Workout management.
- Daily fitness tracking.
- Goal management.
- Analytics and reports.
- Workout scheduling.
- Exercise library.
- Progress comparison.
- Streak tracking.
- Achievement system.
- Personalized fitness dashboard.
- Responsive user interface.
- REST API integration.

## Future Enhancements

- Interactive fitness charts.
- Workout recommendations.
- Fitness reminder notifications.
- Mobile application integration.
- Cloud database integration.
- Advanced fitness reports.
- AI-based personalized workout suggestions.

## Conclusion

FitTrack provides a unified platform for workout management, fitness goal tracking, progress analysis, and exercise habit building.

The project demonstrates full-stack web development using FastAPI, React, SQLAlchemy, SQLite, and REST API integration.

---

**Project Name:** FitTrack – Fitness & Workout Management Platform

**Backend:** Python FastAPI

**Frontend:** React.js + Vite

**Database:** SQLite

**Architecture:** Full-Stack Web Application