# Task Tackler - React Version

A modern, full-featured task management application built with React and Next.js.

## Features

### Core Task Management
- **Create & Manage Tasks** - Add, edit, and delete tasks with ease
- **Task Categorization** - Organize tasks into Work, Personal, Shopping, Health, Education, or Other
- **Priority Levels** - Set priority levels (Low, Medium, High, Critical) for each task
- **Due Dates** - Assign due dates and track upcoming deadlines
- **Recurring Tasks** - Set tasks to repeat Daily, Weekly, Monthly, or Yearly
- **Subtasks** - Break down complex tasks into smaller subtasks
- **Tags** - Add custom tags for better organization
- **Descriptions** - Include detailed descriptions for each task

### Organization & Discovery
- **Advanced Filtering** - Filter tasks by category, priority, and status
- **Sorting Options** - Sort by due date, priority, category, or creation date
- **Full-Text Search** - Search across task titles, descriptions, and tags
- **Status Tracking** - Quickly see pending and completed tasks

### Statistics & Insights
- **Dashboard Statistics** - View total, completed, pending, and overdue tasks
- **Progress Tracking** - See completion percentage
- **Category Breakdown** - View task distribution by category
- **Priority Distribution** - Understand priority distribution across tasks

### User Experience
- **Dark/Light Theme** - Toggle between light and dark modes
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Local Storage** - All data persists in browser storage (no server required)
- **Real-time Updates** - Changes update instantly across the app
- **Intuitive UI** - Clean, modern interface with Tailwind CSS styling

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: Browser Local Storage

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build

# Start production server
npm start
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/
│   ├── Header.tsx         # Header with theme toggle
│   ├── StatsOverview.tsx  # Statistics dashboard
│   ├── TaskForm.tsx       # Task creation form
│   ├── TaskCard.tsx       # Individual task display
│   ├── TaskList.tsx       # Task list container
│   ├── SearchBar.tsx      # Search functionality
│   └── FilterPanel.tsx    # Filtering and sorting
├── context/
│   ├── TaskContext.tsx    # Task state management
│   └── ThemeContext.tsx   # Theme state management
├── lib/
│   └── taskUtils.ts       # Utility functions for tasks
└── types/
    └── task.ts            # TypeScript types and interfaces
```

## Usage

### Adding a Task
1. Click the "Add Task" button
2. Fill in the task details (title is required)
3. Set category, priority, due date, and recurrence
4. Add tags for better organization
5. Click "Add Task" to create

### Managing Tasks
- Click the circle icon to mark tasks as complete
- Click the trash icon to delete a task
- Use filters on the left to narrow down tasks
- Use the search bar to find specific tasks
- Click the theme toggle to switch between light and dark modes

### Filtering & Sorting
- **Sort By**: Choose how to order your tasks
- **Category**: Filter tasks by specific category
- **Priority**: Filter by priority level
- **Status**: Show only pending or completed tasks
- **Clear All**: Reset all filters at once

## Data Storage

All data is stored in the browser's Local Storage:
- Tasks are automatically saved when modified
- Theme preference is remembered
- Data persists across browser sessions

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Server-side persistence with database
- Cloud synchronization
- Collaboration features
- Mobile app versions
- Advanced reporting and analytics
- Calendar view
- Kanban board view

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.
