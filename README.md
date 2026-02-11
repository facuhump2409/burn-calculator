# burn-calculator

A pediatric burn assessment calculator webapp implementing the Parkland Formula and Rule of 9s for estimating body surface area and fluid requirements.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for responsive styling
- **Zustand** for state management
- **Lucide React** for icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deployment to GitHub Pages

```bash
npm run deploy
```

This command builds the app and deploys to GitHub Pages while preserving all source files on the master branch.

## Features

- **Patient Data Input**: Collect age, weight, accident time, location, and hospital service
- **Interactive Body Diagram**: Visual burn area selection with percentages
- **Automated Calculations**: Parkland Formula (4ml × kg × %BSA) and pediatric BSA assessments
- **Clinical Summary**: Comprehensive burn assessment report with fluid plan recommendations
- **Responsive Design**: Mobile-friendly interface matching medical assessment standards
