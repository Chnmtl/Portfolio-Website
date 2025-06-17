import { TextField, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TagInputState } from '../types';
import { TAG_COLORS } from '../constants';
import { hasDuplicateTagNames } from '../utils';
import { 
    DeleteButton, 
    TagInputContainer, 
    TagRowContainer, 
    TagFieldsContainer, 
    TagInputWrapper, 
    ColorPalette, 
    ColorSwatch 
} from '../styles';

interface TagInputProps {
    tags: TagInputState[];
    onTagsChange: (tags: TagInputState[]) => void;
    label?: string;
}

export const TagInput = ({ tags, onTagsChange, label = 'Tags' }: TagInputProps) => {
    const addTag = () => {
        onTagsChange([...tags, { name: '', color: TAG_COLORS[0] }]);
    };

    const updateTag = (index: number, field: 'name' | 'color', value: string) => {
        onTagsChange(tags.map((tag, i) => i === index ? { ...tag, [field]: value } : tag));
    };

    const removeTag = (index: number) => {
        onTagsChange(tags.filter((_, i) => i !== index));
    };

    return (
        <TagInputContainer>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>{label}</Typography>
            {tags.map((tag, idx) => {
                const duplicate = tag.name && tags.filter((t, i) => t.name.trim().toLowerCase() === tag.name.trim().toLowerCase() && i !== idx).length > 0;
                return (
                    <TagRowContainer key={idx}>
                        <TagFieldsContainer>
                            <TagInputWrapper>
                                <TextField
                                    label="Tag Name"
                                    value={tag.name}
                                    onChange={e => updateTag(idx, 'name', e.target.value)}
                                    size="small"
                                    sx={{ width: 120, my: 0 }}
                                    error={!!duplicate}
                                    helperText={duplicate ? 'Duplicate tag name' : ' '}
                                />
                            </TagInputWrapper>
                            <ColorPalette>
                                {TAG_COLORS.map((color) => (
                                    <ColorSwatch
                                        key={color}
                                        bgcolor={color}
                                        selected={tag.color === color}
                                        onClick={() => updateTag(idx, 'color', color)}
                                    />
                                ))}
                            </ColorPalette>
                        </TagFieldsContainer>
                        <DeleteButton
                            onClick={() => removeTag(idx)}
                            sx={{ ml: 1 }}
                        >
                            <DeleteIcon fontSize="small" />
                        </DeleteButton>
                    </TagRowContainer>
                );
            })}
            {tags.length === 0 && (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={addTag}
                    disabled={hasDuplicateTagNames(tags) || tags.some(t => !t.name.trim())}
                >Add Tag</Button>
            )}
            {hasDuplicateTagNames(tags) && (
                <Typography color="error" variant="caption">Duplicate tag names are not allowed.</Typography>
            )}
        </TagInputContainer>
    );
};
