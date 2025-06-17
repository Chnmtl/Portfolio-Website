export interface Tag {
    name: string;
    color: string; // e.g., 'red', 'blue', 'green'
}

export interface Task {
    id: string;
    name: string;
    description: string;
    tags?: Tag[];
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export interface NewTaskState {
    [columnId: string]: { name: string; description: string };
}

export interface EditTaskState {
    columnId: string;
    task: Task;
}

export interface DeleteConfirmState {
    columnId: string;
    taskId: string;
}

export interface TagInputState {
    name: string;
    color: string;
}
