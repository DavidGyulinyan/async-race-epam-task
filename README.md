# 🏎️ Async Race

A modern, interactive car racing application built with React, TypeScript, and Redux Toolkit. Experience the thrill of asynchronous car racing with real-time animations, comprehensive car management, and competitive winner tracking.

## 🚀 Live Demo

**Deployed Application**: [https://async-race-davit.netlify.app/garage]

## ✨ Features

### 🏪 Garage Management
- **Complete CRUD Operations**: Create, read, update, and delete cars
- **Color Customization**: Interactive color picker for car customization
- **Bulk Car Generation**: Generate 100 random cars at once
- **Smart Pagination**: Navigate through cars with automatic page management
- **Empty State Handling**: User-friendly messages when garage is empty

### 🏁 Racing System
- **Individual Car Control**: Start, stop, and reset individual cars
- **Garage-Wide Racing**: Race ALL cars from all pages simultaneously
- **Real-Time Animations**: Smooth, physics-based car movement animations
- **Automatic Winner Detection**: Instant winner announcement with timing
- **Race State Management**: Comprehensive race lifecycle handling

### 🏆 Winners Tracking
- **Persistent Winner Records**: Track all race winners with statistics
- **Advanced Sorting**: Sort by wins count or best time (ascending/descending)
- **Detailed Statistics**: View win counts and best race times
- **Pagination Support**: Navigate through winner history

### 🎮 Enhanced User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Loading States**: Visual feedback for all async operations
- **Error Handling**: Graceful error management with user notifications
- **State Persistence**: Maintain page state when switching views
- **Intuitive Controls**: Clear button labels and status indicators

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management with RTK Query
- **React Router DOM** - Client-side routing
- **CSS3** - Modern styling with animations

### Development Tools
- **ESLint** - Code linting with Airbnb configuration
- **Prettier** - Code formatting
- **Create React App** - Build tooling
- **React Testing Library** - Component testing

### Backend
- **Node.js Mock Server** - RESTful API simulation
- **JSON Server** - Lightweight JSON database

## 📁 Project Structure

When you clone this repository, you'll get both the frontend and backend:

```
async-race-epam-task/
├── client/                          # React frontend application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Car/                # Individual car component
│   │   │   ├── Header/             # Navigation header
│   │   │   └── constants/          # App constants
│   │   ├── pages/                  # Page components
│   │   │   ├── Garage/             # Garage management page
│   │   │   └── Winners/            # Winners leaderboard page
│   │   ├── services/               # API services
│   │   ├── store/                  # Redux store
│   │   │   ├── carsSlice.ts        # Cars state management
│   │   │   ├── raceSlice.ts        # Race state management
│   │   │   ├── winnersSlice.ts     # Winners state management
│   │   │   └── index.ts            # Store configuration
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── hooks/                  # Custom React hooks
│   │   └── utils/                  # Utility functions
│   ├── package.json
│   └── README.md
└── 
```

### 📂 What You Get
- **Complete Frontend**: React application with all features implemented
- **Backend Server**: Mock API server for data persistence
- **Documentation**: Comprehensive README with setup instructions
- **Dependencies**: All required packages for both frontend and backend

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/async-race-epam-task.git
   cd async-race-epam-task
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the backend server**
   ```bash
   # From server directory
   cd ../server
   npm start
   ```
   The server will run on `http://localhost:3000`

5. **Start the frontend application**
   ```bash
   # From client directory (new terminal)
   cd ../client
   npm start
   ```
   The app will open at `http://localhost:3000`

### Alternative: Run Both Simultaneously

For convenience, you can also run both server and client from the root directory:

```bash
# Terminal 1 - Start server
cd server && npm start

# Terminal 2 - Start client
cd client && npm start
```

## 🎯 Usage Guide

### Managing Cars
1. **Create Car**: Use the form at the top to create new cars with custom names and colors
2. **Edit Car**: Click the "Select" button on any car, then use the update form
3. **Delete Car**: Click the "Remove" button on any car
4. **Generate Cars**: Use "Generate Cars" to create 100 random cars instantly

### Individual Car Control
1. **Start Car**: Click the "Start" button to begin engine and racing animation
2. **Stop Car**: Click the "Stop" button to halt the car and reset position
3. **Reset Car**: Click the "Reset" button to return car to initial state

### Racing All Cars
1. **Garage-Wide Race**: Click "Race All (X)" to race ALL cars from all pages
2. **Winner Announcement**: View the winner banner with race time
3. **Reset Race**: Click "Reset All" to clear all race states

### Viewing Winners
1. **Navigate to Winners**: Use the header navigation
2. **Sort Results**: Click column headers to sort by wins or time
3. **Pagination**: Navigate through winner pages

## 🔧 Available Scripts

### Client Scripts (from `/client` directory)
```bash
cd client

npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
npm run format     # Format code with Prettier
```

### Server Scripts (from `/server` directory)
```bash
cd server

npm start          # Start mock server
```

### Quick Start (from project root)
```bash
# Start both server and client
npm run dev        # If you add this script to package.json
```

## 🌟 Key Features & Improvements

### 🚀 Performance Optimizations
- **Efficient API Calls**: Batched requests for fetching all cars
- **Optimized Animations**: Smooth 60fps animations with proper cleanup
- **Lazy Loading**: Components load only when needed

### 🎨 UI/UX Enhancements
- **Status Indicators**: Real-time car status with color coding
- **Loading States**: Visual feedback for all operations
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-friendly interface

### 🔧 Technical Improvements
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit for predictable state
- **Code Quality**: ESLint + Prettier for consistent code
- **Modular Architecture**: Clean separation of concerns

## 📊 API Integration

The application communicates with a RESTful API providing:

- **Garage Management**: CRUD operations for cars
- **Engine Control**: Start/stop/drive car engines
- **Winners Tracking**: Persistent winner statistics
- **Pagination**: Efficient data loading
- **Sorting**: Flexible winner data sorting

## 🎯 Task Evaluation Guide

### For EPAM Task Evaluators

1. **Clone Repository**: Get both frontend and backend in one go
2. **Install Dependencies**: Run `npm install` in both `/server` and `/client` directories
3. **Start Services**: Run server first (`npm start` in `/server`), then client (`npm start` in `/client`)
4. **Test Features**:
   - Car CRUD operations
   - Individual car racing with animations
   - Multi-page garage-wide racing
   - Winners tracking and sorting
   - Responsive design on different screen sizes

### Key Features to Evaluate

- ✅ **Multi-page racing** (fixed: now races ALL cars, not just current page)
- ✅ **Car animations** (fixed: smooth animations with proper cleanup)
- ✅ **Winner tracking** (fixed: accurate win counts, no duplicates)
- ✅ **Individual car controls** (enhanced: better UI and error handling)
- ✅ **State management** (Redux Toolkit with proper async handling)
- ✅ **TypeScript** (full type safety throughout the application)
- ✅ **Code quality** (ESLint, Prettier, clean architecture)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Commit Guidelines

This project follows [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `refactor:` - Code refactoring
- `test:` - Testing related changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React, TypeScript, and Redux Toolkit**
