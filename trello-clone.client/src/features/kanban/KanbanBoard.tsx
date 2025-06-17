import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Column, Tag, NewTaskState, EditTaskState, DeleteConfirmState, TagInputState } from './types';
import { DEFAULT_COLUMNS, STORAGE_KEY } from './constants';
import { isTaskWithTags, hasDuplicateTagNames } from './utils';
import { TagInput } from './components/TagInput';
import {
    BoardContainer,
    ColumnPaper,
    ColumnHeader,
    TasksBox,
    TaskCard,
    TaskCardContent,
    DeleteButton,
    DeleteAllButton,
    TagRibbon,
    TagLegendContainer,
    TagSwatch,
} from './styles';

const KanbanBoard = () => {
    // For tag input in add/edit modals
    const [tagInput, setTagInput] = useState<TagInputState[]>([]);
    const [editTagInput, setEditTagInput] = useState<TagInputState[]>([]);

    // On first load, migrate old tasks if needed
    const getInitialColumns = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migrate old format if needed
                return parsed.map((col: Column) => ({
                    ...col,
                    tasks: (col.tasks || []).map((task: unknown) => {
                        if (isTaskWithTags(task)) {
                            if ('tags' in task && Array.isArray(task.tags)) {
                                const tags: Array<string | Tag> = task.tags ?? [];
                                return {
                                    ...task,
                                    tags: tags.map(t =>
                                        typeof t === 'string'
                                            ? { name: t.slice(0, 5), color: 'gray' }
                                            : t
                                    ),
                                };
                            } else {
                                return { ...task, tags: [] };
                            }
                        } else if (typeof task === 'object' && task !== null && 'id' in task) {
                            // fallback for very old format
                            const t = task as { id: string; content?: string };
                            return { id: t.id, name: t.content || '', description: '', tags: [] };
                        }
                        return { id: '', name: '', description: '', tags: [] };
                    }),
                }));
            } catch {
                // fallback to default
            }
        }
        return DEFAULT_COLUMNS;
    };
    const [columns, setColumns] = useState<Column[]>(getInitialColumns);
    const [newTasks, setNewTasks] = useState<NewTaskState>({});
    const [modalColumnId, setModalColumnId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<EditTaskState | null>(null);
    const [editValues, setEditValues] = useState<{ name: string; description: string }>({ name: '', description: '' });
    const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(null);
    // Track if user has cleared the board
    const [cleared, setCleared] = useState(false);

    // Save to localStorage on columns change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
    }, [columns]);

    // Restore default tasks if all columns are empty
    useEffect(() => {
        if (!cleared && columns.every(col => col.tasks.length === 0)) {
            setColumns(DEFAULT_COLUMNS);
        }
    }, [columns, cleared]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        const newColumns = [...columns];
        const sourceColumn = newColumns.find(col => col.id === source.droppableId);
        const destColumn = newColumns.find(col => col.id === destination.droppableId);

        if (sourceColumn && destColumn) {
            const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
            destColumn.tasks.splice(destination.index, 0, movedTask);
            setColumns(newColumns);
        }
    };

    // Add Task handler with tags
    const handleAddTask = (columnId: string) => {
        const name = newTasks[columnId]?.name?.trim();
        const description = newTasks[columnId]?.description?.trim();
        if (!name) return;
        
        // Prevent submission if tags are invalid
        if (hasDuplicateTagNames(tagInput) || tagInput.some(t => !t.name.trim())) {
            return;
        }
        
        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: [
                            ...col.tasks,
                            { id: `task-${Date.now()}`, name, description: description || '', tags: tagInput.map(t => ({ name: t.name, color: t.color })) },
                        ],
                    }
                    : col
            )
        );
        setNewTasks(tasks => ({ ...tasks, [columnId]: { name: '', description: '' } }));
        setTagInput([]);
    };

    const handleDeleteTask = (columnId: string, taskId: string) => {
        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
                    : col
            )
        );
    };

    // Edit task handler
    const handleEditTask = () => {
        if (!editingTask) return;
        
        // Prevent submission if tags are invalid
        if (hasDuplicateTagNames(editTagInput) || editTagInput.some(t => !t.name.trim())) {
            return;
        }
        
        setColumns(cols =>
            cols.map(col =>
                col.id === editingTask.columnId
                    ? {
                        ...col,
                        tasks: col.tasks.map(t =>
                            t.id === editingTask.task.id
                                ? { ...t, name: editValues.name.trim(), description: editValues.description.trim(), tags: editTagInput.map(tg => ({ name: tg.name, color: tg.color })) }
                                : t
                        ),
                    }
                    : col
            )
        );
        setEditingTask(null);
    };

    // When opening edit modal, set editTagInput
    useEffect(() => {
        if (editingTask) {
            setEditTagInput(editingTask.task.tags ? [...editingTask.task.tags] : []);
        }
    }, [editingTask]);

    return (
        <>
            {/* Tag Legend and Delete All Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <TagLegendContainer>
                    {Array.from(new Set(columns.flatMap(col => col.tasks.flatMap(task => task.tags || []))
                        .map(tag => `${tag.name}|${tag.color}`)))
                        .map(key => {
                            const [name, color] = key.split('|');
                            return (
                                <Box key={key} display="flex" alignItems="center">
                                    <TagSwatch bgcolor={color} />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{name}</Typography>
                                </Box>
                            );
                        })}
                </TagLegendContainer>
                <DeleteAllButton
                    variant="contained"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete all tasks?')) {
                            setColumns(cols => cols.map(col => ({ ...col, tasks: [] })));
                            setCleared(true);
                        }
                    }}
                >
                    Delete All Tasks
                </DeleteAllButton>
            </Box>
            <DragDropContext onDragEnd={onDragEnd}>
                <BoardContainer>
                    {columns.map((column) => (
                        <ColumnPaper key={column.id}>
                            <ColumnHeader>
                                <Typography variant="h6">
                                    {column.title}
                                </Typography>
                                <Fab color="primary" size="small"
                                    onClick={() => setModalColumnId(column.id)}
                                    aria-label="add">
                                    <AddIcon />
                                </Fab>
                            </ColumnHeader>
                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <TasksBox ref={provided.innerRef} {...provided.droppableProps}>
                                        {column.tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <TaskCard
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={e => {
                                                            // Prevent edit modal from opening when clicking delete
                                                            if ((e.target as HTMLElement).closest('button')) return;
                                                            setEditingTask({ columnId: column.id, task });
                                                            setEditValues({ name: task.name, description: task.description });
                                                        }}
                                                    >
                                                        {task.tags && task.tags.length > 0 && (
                                                            <TagRibbon bgcolor={task.tags[0].color} />
                                                        )}
                                                        <TaskCardContent>
                                                            <Typography fontWeight="bold">{task.name}</Typography>
                                                            {/* Restrict description to 5 lines in card display (not in modal) */}
                                                            <Typography variant="body2" color="text.secondary" sx={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 5,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}>
                                                                {task.description}
                                                            </Typography>
                                                        </TaskCardContent>
                                                        <DeleteButton positioned onClick={e => {
                                                            e.stopPropagation();
                                                            setDeleteConfirm({ columnId: column.id, taskId: task.id });
                                                        }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </DeleteButton>
                                                    </TaskCard>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </TasksBox>
                                )}
                            </Droppable>
                        </ColumnPaper>
                    ))}
                </BoardContainer>
            </DragDropContext>
            {/* Add Task Modal */}
            <Dialog open={!!modalColumnId} onClose={() => setModalColumnId(null)}>
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={modalColumnId ? newTasks[modalColumnId]?.name || '' : ''}
                        onChange={e => setNewTasks(tasks => ({ ...tasks, [modalColumnId!]: { ...tasks[modalColumnId!], name: e.target.value } }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        minRows={2}
                        value={modalColumnId ? newTasks[modalColumnId]?.description || '' : ''}
                        onChange={e => setNewTasks(tasks => ({ ...tasks, [modalColumnId!]: { ...tasks[modalColumnId!], description: e.target.value } }))}
                        sx={{ mb: 2 }}
                    />
                    <TagInput
                        tags={tagInput}
                        onTagsChange={setTagInput}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setModalColumnId(null);
                        if (modalColumnId) setNewTasks(tasks => ({ ...tasks, [modalColumnId]: { name: '', description: '' } }));
                        setTagInput([]);
                    }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (modalColumnId) {
                                handleAddTask(modalColumnId);
                                setModalColumnId(null);
                            }
                        }}
                    >Add</Button>
                </DialogActions>
            </Dialog>
            {/* Edit Task Modal */}
            <Dialog open={!!editingTask} onClose={() => setEditingTask(null)}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={editValues.name}
                        onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        minRows={2}
                        value={editValues.description}
                        onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TagInput
                        tags={editTagInput}
                        onTagsChange={setEditTagInput}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingTask(null)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleEditTask}
                    >Save</Button>
                </DialogActions>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this task?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={() => {
                        if (deleteConfirm) handleDeleteTask(deleteConfirm.columnId, deleteConfirm.taskId);
                        setDeleteConfirm(null);
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default KanbanBoard;
