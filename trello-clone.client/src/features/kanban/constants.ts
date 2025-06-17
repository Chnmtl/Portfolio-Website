import { Column } from './types';

// Color palette for tags
export const TAG_COLORS = [
    '#1976d2', // blue
    '#388e3c', // green
    '#d32f2f', // red
    '#fbc02d', // yellow
    '#7b1fa2', // purple
    '#f57c00', // orange
    '#455a64', // gray
    '#c2185b', // pink
    '#0097a7', // teal
    '#5d4037', // brown
];

export const DEFAULT_COLUMNS: Column[] = [
    {
        id: 'column-1',
        title: 'To Do',
        tasks: [
            { id: 'task-1', name: 'Fix login bug', description: 'Users cannot log in with Google on mobile devices.', tags: [{ name: 'BUG', color: 'red' }] },
            { id: 'task-2', name: 'Write docs', description: 'Document the new API endpoints for the frontend team.', tags: [{ name: 'DOC', color: 'blue' }] },
            { id: 'task-3', name: 'Design dashboard', description: 'Create a new dashboard layout for analytics.', tags: [{ name: 'UI', color: 'green' }] },
            { id: 'task-4', name: 'Add dark mode', description: 'Implement dark mode toggle in settings.', tags: [{ name: 'UI', color: 'green' }] },
        ],
    },
    {
        id: 'column-2',
        title: 'In Progress',
        tasks: [
            { id: 'task-5', name: 'Refactor auth', description: 'Refactor authentication logic for better maintainability.', tags: [{ name: 'CODE', color: 'brown' }] },
            { id: 'task-6', name: 'Write tests', description: 'Add unit tests for the user service.', tags: [{ name: 'CODE', color: 'brown' }] },
        ],
    },
    {
        id: 'column-3',
        title: 'Completed',
        tasks: [
            { id: 'task-7', name: 'Setup CI', description: 'Continuous integration pipeline for PRs.', tags: [{ name: 'OPS', color: 'orange' }] },
            { id: 'task-8', name: 'Initial setup', description: 'Project structure and dependencies.', tags: [{ name: 'INIT', color: 'purple' }] },
        ],
    },
];

export const STORAGE_KEY = 'kanban-columns';
