import { styled } from '@mui/material/styles';
import { Box, Paper, Card, CardContent, IconButton, Button } from '@mui/material';

export const BoardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    minHeight: '80vh',
    height: '80vh',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
}));

export const ColumnPaper = styled(Paper)(({ theme }) => ({
    flex: 1,
    minWidth: 320,
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    height: 'fit-content',
    maxHeight: '100%',
}));

export const ColumnHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

export const TasksBox = styled(Box)(({ theme }) => ({
    minHeight: 200,
    maxHeight: 'calc(80vh - 120px)',
    overflowY: 'auto',
    flex: 1,
    // Custom scrollbar styles
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.paper}`,
    '&::-webkit-scrollbar': {
        width: 8,
        background: theme.palette.background.paper,
        borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.primary.main,
        borderRadius: 4,
        minHeight: 24,
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.primary.dark,
    },
    '&::-webkit-scrollbar-corner': {
        background: 'transparent',
    },
}));

export const TaskCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    display: 'flex',
    alignItems: 'flex-start', // align items to top
    backgroundColor: theme.palette.background.default,
    position: 'relative', // allow absolute positioning inside
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
}));

export const TaskCardContent = styled(CardContent)({
    flexGrow: 1,
    paddingBottom: 8,
});

export const DeleteButton = styled(IconButton)<{ positioned?: boolean }>(({ theme, positioned = false }) => ({
    ...(positioned && {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
    }),
    padding: 2,
    minWidth: 28,
    minHeight: 28,
    width: 28,
    height: 28,
    fontSize: '1rem',
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    borderRadius: '50%',
    boxShadow: theme.shadows[1],
    transition: 'background 0.2s, color 0.2s',

    '&:hover': {
        background: theme.palette.error.main,
        color: theme.palette.error.contrastText,
    },
}));

export const DeleteAllButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
        background: theme.palette.error.dark,
    },
    fontWeight: 700,
    borderRadius: 20,
    boxShadow: theme.shadows[2],
    textTransform: 'none',
    padding: '6px 20px',
}));

export const TagRibbon = styled('div')<{ bgcolor: string }>(({ bgcolor }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    background: bgcolor,
    height: 36,
    width: 120,
    borderRadius: 6,
    // border removed
    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.25)',
    transform: 'rotate(-45deg) translate(-32px, -16px)',
    transformOrigin: 'top left',
    zIndex: 20,
    pointerEvents: 'none',
}));

export const TagLegendContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    margin: `${theme.spacing(2)} 0`,
    flexWrap: 'wrap',
}));

export const TagSwatch = styled('span')<{ bgcolor: string }>(({ bgcolor, theme }) => ({
    display: 'inline-block',
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: bgcolor,
    marginRight: theme.spacing(1),
    border: `2px solid ${theme.palette.background.paper}`,
    verticalAlign: 'middle',
}));
