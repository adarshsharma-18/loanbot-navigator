# Loan Bot Navigator

A modern web application that helps users navigate through loan options, calculate EMIs, compare different loans, and manage loan applications with an interactive chat interface.

## Features

- Interactive chat interface for loan-related queries
- EMI calculator
- Loan comparison tools
- Voice interaction capabilities
- Loan application management
- User authentication system
- Dashboard with loan insights

## Technology Stack

This project is built with modern web technologies:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Voice Integration**: Custom voice interface

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Python 3.x for the backend server

### Installation

1. Clone the Repository:
```sh
# Clone the repository
git clone https://github.com/adarshsharma-18/loanbot-navigator

# Navigate to the project directory
cd loanbot-navigator
```

2. Start the Backend Server:
```sh
# Navigate to the api directory
cd api

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

3. Start the Frontend Application:

> **Important**: Ensure the backend server is running before starting the frontend application.

```sh
# In a new terminal, navigate to the project root
cd loanbot-navigator

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

- `/src` - Main source code directory
  - `/components` - React components including chat interface and voice controls
  - `/context` - React context providers for auth and chat state
  - `/pages` - Application pages and routes
  - `/services` - API services and business logic
  - `/types` - TypeScript type definitions

## Development

You can work on this project in several ways:

### Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Make your changes
5. Commit and push your changes

### GitHub Integration

- Edit files directly through GitHub's web interface
- Use GitHub Codespaces for a cloud development environment

## Deployment

The application can be deployed to various platforms that support static site hosting:

1. Build the project:
```sh
npm run build
```

2. Deploy the contents of the `dist` directory to your preferred hosting platform

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
