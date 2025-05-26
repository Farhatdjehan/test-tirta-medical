import { formatDueDate } from "@/utils";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Image from "next/image";
import moreMenu from "@/public/icons/more-menu.svg";

interface TodoItemProps {
  id: number;
  userId: number;
  todo: string;
  is_done: boolean;
  dueDate: string;
  subTodos: { id: number; is_done: boolean; name: string }[];
  overdue?: boolean;
}
interface TodoProps {
  item: TodoItemProps;
  anchorEl: null | HTMLElement;
  handleStartEdit: (item: TodoItemProps) => void;
  handleDeleteTodo: (item: TodoItemProps) => void;
  handleAddSubTodo: (item: TodoItemProps) => void;
  handleToggle: (item: TodoItemProps) => void;
  selectedItem: number | null;
  handleClick: (event: React.MouseEvent<HTMLElement>, itemId: number) => void;
  handleClose: () => void;
  type: string;
}

export default function Todo(props: TodoProps) {
  const {
    anchorEl,
    item,
    handleStartEdit,
    handleDeleteTodo,
    handleAddSubTodo,
    handleToggle,
    selectedItem,
    handleClick,
    handleClose,
    type,
  } = props;
  return (
    <ListItem
      sx={{
        backgroundColor: "white",
      }}
      secondaryAction={
        <>
          <IconButton edge="end" onClick={(e) => handleClick(e, item.id)}>
            <Image src={moreMenu} alt="more-menu" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedItem === item.id}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              boxShadow: "2px 5px 28px rgba(0, 0, 0, 0.05)",
            }}
          >
            {type === "not_checked" && (
              <MenuItem onClick={() => handleStartEdit(item)}>Edit</MenuItem>
            )}
            <MenuItem onClick={() => handleDeleteTodo(item)}>Delete</MenuItem>
            {type === "not_checked" && (
              <MenuItem onClick={() => handleAddSubTodo(item)}>
                Create Sub To-do
              </MenuItem>
            )}
          </Menu>
        </>
      }
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={item.is_done}
          onChange={() => handleToggle(item)}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            component="span"
            sx={{
              textDecoration:
                type === "checked" && item.is_done ? "line-through" : "none",
            }}
          >
            {item.todo}
          </Typography>
        }
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        secondary={
          <Typography
            component="span"
            sx={{
              fontSize: "0.875rem",
            }}
          >
            {formatDueDate(item)}
          </Typography>
        }
      />
    </ListItem>
  );
}
