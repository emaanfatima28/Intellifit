# IntelliFit

IntelliFit is an AI-powered fitness and nutrition platform that delivers personalized meal plans, workout routines, and progress tracking. Built with a modern stack (Next.js, React, Node.js, Express, MongoDB), IntelliFit helps users achieve their health goals with tailored recommendations and a vibrant community.

---

## Features

- **Personalized Meal Plans:** AI-generated weekly and daily meal plans based on user profile and preferences.
- **Custom Workout Routines:** 7-day workout plans tailored to fitness goals and activity level.
- **Progress Tracking:** Log and visualize weight, measurements, and achievements.
- **Community Feed:** Share progress, join challenges, and interact with other users.
- **Admin Dashboard:** Manage users, meal/workout plans, and analytics.
- **AI Chatbot:** Get instant fitness and nutrition advice.
- **Secure Authentication:** JWT-based user authentication and profile management.
- **Responsive UI:** Modern, mobile-friendly design using Tailwind CSS.

---

## Directory Structure

```
Intellifit/
│
├── backend/
│   ├── controllers/      # Express controllers (meals, workouts, profile, etc.)
│   ├── middleware/       # Auth and utility middleware
│   ├── models/           # Mongoose models (User, Profile, Meal, Workout, etc.)
│   ├── prompts/          # AI prompt templates (Gemini API)
│   ├── routes/           # Express route definitions
│   ├── utils/            # Utility functions
│   ├── server.js         # Main Express server
│   └── package.json
│
├── frontend/
│   ├── app/              # Next.js app directory (pages, components, hooks, etc.)
│   ├── components/       # Shared React components
│   ├── public/           # Static assets
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   └── package.json
│
├── test-meal-update.js   # Script to test meal update functionality
├── ReadMe.md             # Project documentation
└── package.json

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **pnpm**
- **MongoDB** instance (local or cloud)

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/intellifit.git
cd intellifit
```

### 2. Setup Environment Variables

Create a `.env` file in the `backend/` directory with the following content:

```env
MONGODB_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_FROM=IntelliFit <your_email@gmail.com>
EMAIL_PASSWORD=your_app_password
```



### 3. Install Dependencies

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd ../frontend
npm install
```

### 4. Run the Application

#### Start Backend Server

```sh
cd backend
npm run dev
```

#### Start Frontend (Next.js)

```sh
cd ../frontend
npm run dev
```

- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

The backend exposes RESTful endpoints for:

- `/users` - User registration, login, password reset
- `/profile` - Create, update, get, and delete user profile
- `/meal` - Generate and update meal plans
- `/workout` - Generate and update workout plans
- `/feedback` - Submit feedback on plans
- `/progress` - Track user progress
- `/chatbot` - AI assistant

See route files in [`backend/routes/`](backend/routes/) for details.

---

## Customization

- **AI Prompts:** Modify prompt logic in [`backend/prompts/geminiMeal.js`](backend/prompts/geminiMeal.js) and [`backend/prompts/geminiWorkout.js`](backend/prompts/geminiWorkout.js).
- **UI Theme:** Adjust Tailwind colors in [`frontend/tailwind.config.ts`](frontend/tailwind.config.ts) and global styles in [`frontend/app/globals.css`](frontend/app/globals.css).
- **Components:** Reusable UI components are in [`frontend/components/`](frontend/components/).

---

## Testing

- Use [`test-meal-update.js`](test-meal-update.js) to test meal plan endpoints.
- Add your own tests as needed.

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request


## Environment Variables Example

Create a `.env` file in the `backend` folder and place the following in it:

```env
MONGODB_URI=your_mongodb_uri
PORT=your_port
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key

# 1. Go to Google Account settings under the security tab.
# 2. Enable two-factor authentication.
# 3. Go back to security & search for app passwords.
# 4. Create a password and paste it here.
EMAIL_PASSWORD=
```
