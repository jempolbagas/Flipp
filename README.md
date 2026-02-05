# Flipp

**Flipp** is a minimalist web application designed for practicing basic arithmetic operations. Built with React, TypeScript, and Vite, it offers a clean and focused interface for users to sharpen their math skills.

## Features

- **Practice Modes**: Select from Addition (+), Subtraction (Inus), Multiplication (Times), and Division (Divide) operations.
- **Randomized Problems**: Generates unlimited unique math problems using numbers between -15 and 15.
- **Smart Division**: Ensures division problems always result in whole numbers for seamless practice.
- **Instant Feedback**: Visual cues indicate correct (green) or incorrect (red) answers immediately.
- **Score Tracking**: Keeps track of your streak with a simple scoring system (score cannot drop below 0).
- **Keyboard Support**: Press `Enter` to submit answers quickly.

## Technology Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Flipp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open in Browser:**
    Navigate to `http://localhost:5173` (or the URL shown in your terminal) to view the app.

## Project Structure

- `src/App.tsx`: Main application component containing the UI and state logic.
- `src/utils/mathLogic.ts`: Core logic for generating random math problems and handling operations.
- `src/App.css` & `src/index.css`: Application styling.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles TypeScript and builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Locally previews the production build.
