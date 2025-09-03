# Safety Management System - Frontend

A comprehensive React-based frontend application for workplace safety management, built with Material-UI and modern React patterns.

## Features

### 🏠 Dashboard
- Overview of safety metrics and statistics
- Recent incidents display
- Quick access to all modules
- Real-time data visualization

### 🚨 Incident Management
- **Create, Read, Update, Delete** incidents
- Incident categorization (Near Miss, Minor Injury, Major Injury, etc.)
- Status tracking (Open, Under Investigation, Closed)
- Priority levels (Low, Medium, High, Critical)
- Employee assignment and location tracking
- Detailed incident forms with validation

### 📚 Training Management
- **Training session scheduling** and management
- **Participant tracking** and assignment
- **Expiry monitoring** with status indicators
- Training type categorization
- Progress tracking and completion status
- Instructor assignment

### 🔍 Safety Inspections
- **Inspection scheduling** and tracking
- **Score-based evaluation** system
- Status workflow (Scheduled → In Progress → Completed)
- Area and inspector assignment
- Findings and recommendations tracking

### 🦺 PPE Compliance Monitoring
- **Personal Protective Equipment** compliance tracking
- **Compliance rate monitoring** with visual indicators
- **Violation tracking** and management
- Department-wise compliance overview
- Real-time status updates

## Technology Stack

- **React 18** - Modern React with hooks and functional components
- **Material-UI v5** - Comprehensive component library with theming
- **React Router v6** - Client-side routing with nested routes
- **React Hook Form** - Efficient form handling with validation
- **Yup** - Schema validation for forms
- **Axios** - HTTP client for API communication
- **Day.js** - Date manipulation and formatting
- **@mui/x-date-pickers** - Advanced date/time picker components

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Dashboard/       # Dashboard with metrics overview
│   ├── Incidents/       # Incident management module
│   │   ├── IncidentList.js
│   │   ├── IncidentForm.js
│   │   └── IncidentDetail.js
│   ├── Training/        # Training management module
│   │   ├── TrainingList.js
│   │   ├── TrainingForm.js
│   │   └── TrainingDetail.js
│   ├── Inspections/     # Inspection management module
│   │   ├── InspectionList.js
│   │   └── InspectionForm.js
│   ├── PPECompliance/   # PPE compliance module
│   │   ├── PPEComplianceList.js
│   │   └── PPEComplianceForm.js
│   └── Layout/          # Main layout and navigation
├── services/            # API services and utilities
│   └── api.js          # Centralized API service layer
├── utils/              # Utility functions
└── App.js              # Main application component
```

## API Integration

The frontend is designed to work with a FastAPI backend and includes comprehensive API service layer:

- **Incidents API** - Full CRUD operations for incident management
- **Training API** - Training session and participant management
- **Inspections API** - Inspection scheduling and tracking
- **PPE Compliance API** - Compliance monitoring and reporting
- **Employees API** - Employee management integration
- **Locations API** - Location and department management

## Key Features Implementation

### Form Validation
- **Yup schemas** for comprehensive form validation
- **Real-time validation** with user-friendly error messages
- **Required field validation** and custom validation rules

### Responsive Design
- **Mobile-first approach** with Material-UI responsive components
- **Flexible grid system** for various screen sizes
- **Collapsible navigation** for mobile devices

### State Management
- **React hooks** for local state management
- **Context API ready** for global state when needed
- **Efficient re-rendering** with optimized component structure

### Data Visualization
- **Progress indicators** for compliance rates
- **Status badges** with color coding
- **Statistics cards** for quick metrics overview
- **Table pagination** for large datasets

## Available Scripts

In the project directory, you can run:

### `npm install`
Install all project dependencies before running the application.

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload when you make changes and you may see lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder with optimized performance.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safety-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   REACT_APP_API_VERSION=v1
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Environment Variables
- `REACT_APP_API_BASE_URL` - Backend API base URL
- `REACT_APP_API_VERSION` - API version (default: v1)

### API Integration
The application includes mock data for development. To connect to a real backend:
1. Update the API base URL in your `.env` file
2. Ensure your FastAPI backend is running
3. The API service layer will automatically handle all requests

## Development Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper prop validation
- Follow Material-UI design patterns
- Maintain consistent naming conventions

### Form Handling
- Use React Hook Form for all forms
- Implement Yup validation schemas
- Provide clear error messages
- Handle loading and success states

### API Calls
- Use the centralized API service (`services/api.js`)
- Implement proper error handling
- Show loading states during requests
- Handle network errors gracefully

## Testing

The project includes setup for:
- **Unit testing** with Jest and React Testing Library
- **Component testing** for UI components
- **Integration testing** for API interactions

Run tests with:
```bash
npm test
```

## Production Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the build folder** to your web server
   - The build folder contains all static files
   - Configure your server to serve `index.html` for all routes
   - Set up proper HTTPS and security headers

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Follow the existing code style and patterns
2. Write unit tests for new components
3. Update documentation for new features
4. Test on multiple browsers and devices
5. Ensure accessibility standards are met

## License

[Add your license information here]

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions
