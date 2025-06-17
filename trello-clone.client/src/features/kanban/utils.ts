import { Task } from './types';

// Helper for migration type guard
export function isTaskWithTags(task: unknown): task is Task {
    return typeof task === 'object' && task !== null && 'name' in task && 'description' in task;
}

// Helper for duplicate tag name detection (case-insensitive, ignores empty)
export function hasDuplicateTagNames(tags: { name: string }[]) {
    const seen = new Set<string>();
    for (const t of tags) {
        if (!t.name.trim()) continue;
        const lower = t.name.trim().toLowerCase();
        if (seen.has(lower)) return true;
        seen.add(lower);
    }
    return false;
}
