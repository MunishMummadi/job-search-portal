# Job Search Portal

A modern, responsive web application for browsing and filtering job listings with an intuitive user interface.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Job Search Portal is a Next.js application designed to help job seekers easily find and filter through job listings. It offers a clean, modern interface with powerful search and filtering capabilities to streamline the job hunting process.

## Features

- **Advanced Search** - Search jobs by keyword, location, company, and skills
- **Real-time Filtering** - Instantly filter results based on multiple criteria
- **Responsive Design** - Optimized for both desktop and mobile devices
- **Job Listings** - Clearly presented job cards with essential details
- **Pagination** - Browse through multiple pages of job listings
- **Fast Performance** - Built with Next.js for optimal loading speed

## Project Structure

```
job-search-portal/
├── .next/                # Next.js build output
├── app/                  # Next.js app directory
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   ├── loading.tsx       # Loading state component
│   └── page.tsx          # Main page component (entry point)
├── components/           # Reusable UI components
│   ├── job-card.tsx      # Job listing card component
│   ├── job-filters.tsx   # Filter interface for job search
│   ├── job-listings.tsx  # Job listings container with pagination
│   ├── job-search-header.tsx # Header component with search inputs
│   ├── job-uploader.tsx  # Component for uploading job data
│   ├── pagination.tsx    # Pagination component for job listings
│   ├── theme-provider.tsx # Theme context provider
│   └── ui/               # UI component library
│       ├── accordion.tsx # Expandable accordion component
│       ├── alert.tsx     # Alert notification component
│       ├── button.tsx    # Button component
│       ├── card.tsx      # Card container component
│       ├── dialog.tsx    # Modal dialog component
│       ├── form.tsx      # Form components with validation
│       ├── input.tsx     # Input field component
│       └── ... (50+ UI components)
├── data/                 # Data files and storage
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and business logic
│   ├── actions.ts        # Server actions for form handling
│   ├── jobs.ts           # Job data fetching and processing
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Common utility functions
├── public/               # Static assets (images, fonts)
├── styles/               # Additional styling beyond globals.css
├── .gitignore            # Git ignore configuration
├── components.json       # Component configuration
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/satyakrishna555/job-search-portal
   cd job-search-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Technologies

This project leverages the following technologies:

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is a permissive license that is short and to the point. It lets people do almost anything they want with your project, like making and distributing closed source versions, as long as they provide attribution back to you and don't hold you liable.