🏎️ Async Race

Deployed UI: https://async-race-davit.netlify.app/garage

Score: ___ / 400 pts (fill after self-check)

✅ Checklist (Self-Evaluation)
🚀 UI Deployment

 UI deployed on Netlify

 Deployment link added to README.md (top section).

✅ Requirements to Commits and Repository

 Commit guidelines compliance (Conventional Commits: feat, fix, docs, etc.).

 Checklist included in README.md.

 Score calculated and added to README.md.

Basic Structure (80 points)

 Two Views (10 pts): "Garage" and "Winners".

 Garage View Content (30 pts):

Name of view

Car creation & editing panel

Race control panel

Garage section

 Winners View Content (10 pts):

Name of view ("Winners")

Winners table

Pagination

 Persistent State (30 pts): Keep page number and input values after switching views.

Garage View (90 points)

 CRUD for Cars (20 pts): Create, update, delete cars. Handle empty & too long names.

 Color Selection (10 pts): Color picker with car preview.

 Random Car Creation (20 pts): Create 100 random cars at once.

 Car Management Buttons (10 pts): Edit & delete near each car.

 Pagination (10 pts): 7 cars per page.

 Extra (20 pts):

Handle empty garage ("No cars" message).

Remove last car → go to previous page.

🏆 Winners View (50 points)

 Display Winners (15 pts): Show cars after they win a race.

 Pagination (10 pts): 10 winners per page.

 Winners Table (15 pts): Columns: №, car image, name, wins, best time.

 Sorting (10 pts): Sort by wins & best time (ascending/descending).

🚗 Race (170 points)

 Start Engine Animation (20 pts): Animate on start, stop on 500 error.

 Stop Engine Animation (20 pts): Car returns to start.

 Responsive Animation (30 pts): Works on screens ≥ 500px.

 Start Race Button (10 pts): Starts all cars on page.

 Reset Race Button (15 pts): Reset positions.

 Winner Announcement (5 pts): Show winner banner with car name.

 Button States (20 pts): Disable start if driving, disable stop if idle.

 Actions During Race (50 pts): Handle deleting/editing, page switching, adding cars.

🎨 Prettier & ESLint (10 points)

 Prettier (5 pts): Scripts: format, ci:format.

 ESLint Airbnb (5 pts): Script: lint. Strict TypeScript rules in tsconfig.json.

🌟 Code Quality (100 points)

(Reviewer Score: up to 100 pts)

Modular design (API, state, UI separation).

Functions ≤ 40 lines, reusable helpers.

No magic numbers/strings.

Clean, readable code.

Extra features: React Router, custom hooks, portals, etc.

🔗 Backend

Use the provided mock server repository during development. Do not modify the backend. The app communicates with the server using fetch and query params for pagination, sorting, and CRUD operations.

📦 Tech Stack

React 18+

TypeScript (strict mode, noImplicitAny=true)

Redux Toolkit (or another state manager)

React Router DOM

CSS / SCSS / Tailwind

ESLint (Airbnb) + Prettier

📜 How to Run Locally

Clone this repo:

git clone https://github.com/your-username/async-race.git
cd async-race


Install dependencies:

npm install


Run the app:

npm run dev


Make sure the server mock is running locally (default: http://localhost:3000).

🌍 Deployment

Deployed on: Vercel / Netlify / GitHub Pages link here

✅ Commit Guidelines

Use Conventional Commits:

init: start project

feat: add car creation

fix: correct animation bug

docs: update README

refactor: improve API service

🎥 Demo

(Optional) Add screenshots or short GIF of the app UI here.

🔍 Example Features Implemented

✅ Garage view with pagination
✅ Car CRUD operations
✅ Race animation & winner banner
✅ Winners view with sorting & pagination

🧮 Your Score

___ / 400 pts (after self-check)# async-race-epam-task
# async-race-epam-task
