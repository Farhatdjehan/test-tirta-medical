import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Image from "next/image";
import deleteIcon from "@/public/icons/delete.svg";

interface SubTodoItem {
  id: number;
  is_done: boolean;
  name: string;
}

interface itemProps {
  id: number;
  userId: number;
  todo: string;
  is_done: boolean;
  dueDate: string;
  subTodos: SubTodoItem[];
  overdue?: boolean;
}

interface SubTodoProps {
  item: itemProps;
  deleteSavedSubTodo: (parentContent: itemProps, idxSubTodo: number) => void;
  handleToggleSubTodo: (
    item: itemProps,
    subItem: SubTodoItem,
    idx: number
  ) => void;
  handleEditSubTodo: (
    item: itemProps,
    idx: number,
    subTodo: SubTodoItem
  ) => void;
  idx: number;
}

export default function SubTodo(props: SubTodoProps) {
  const {
    item,
    deleteSavedSubTodo,
    handleToggleSubTodo,
    handleEditSubTodo,
    idx,
  } = props;
  return (
    <List sx={{ pl: 4, pr: 2 }}>
      {item.subTodos.map((subTodo, index) => (
        <ListItem
          key={subTodo.id}
          sx={{
            mb: 1,
            backgroundColor: "white",
            border: "none",
            boxShadow: "2px 5px 28px rgba(0, 0, 0, 0.05)",
          }}
          secondaryAction={
            <IconButton
              edge="end"
              onClick={() => deleteSavedSubTodo(item, index)}
            >
              <Image src={deleteIcon} alt="more-menu" />
            </IconButton>
          }
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={subTodo.is_done}
              onChange={() => handleToggleSubTodo(item, subTodo, index)}
            />
          </ListItemIcon>

          <ListItemText
            primary={subTodo.name}
            onClick={() => handleEditSubTodo(item, index, subTodo)}
          />
        </ListItem>
      ))}
    </List>
  );
}
