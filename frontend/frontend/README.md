# React + Weather Tracker Frontend

A modern, responsive weather tracking application built with React and Vite.

## Features

- 🌅 Beautiful sunset background with glass morphism design
- 📱 Fully responsive design for all screen sizes
- 🌡️ Real-time weather data for multiple locations
- 🔄 Sync and forecast functionality
- ⭐ Favorite locations support
- 🎨 Modern dark theme with semi-transparent cards

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite 7** - Fast development and build tool
- **CSS3** - Modern CSS with glass morphism effects
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with host access
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run serve` - Serve production build with host access
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
├── modern.css          # Custom styling
└── index.css           # Base styles

public/
├── hans-sunset-1090164_1920.jpg  # Background image
└── vite.svg            # Vite logo
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEV_MODE=true
```

## Build & Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Features in Detail

### Responsive Design

- **Desktop (>1200px)**: Multi-column layout with optimal spacing
- **Tablet (769px-1200px)**: Adjusted grid layouts
- **Mobile (481px-768px)**: Single column, stacked elements
- **Small Mobile (321px-480px)**: Compact layout with minimal padding
- **Tiny Mobile (≤320px)**: Single column forecast grid

### UI Components

- **Glass Morphism Cards**: Semi-transparent backgrounds with blur effects
- **Dark Theme**: Optimized for sunset background
- **Centered Layout**: Flexbox centering for perfect alignment
- **Touch-Friendly**: Larger buttons and proper spacing for mobile

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
