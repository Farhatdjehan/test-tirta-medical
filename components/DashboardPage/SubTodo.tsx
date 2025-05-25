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

interface SubTodoProps {
  item: any;
  deleteSavedSubTodo: any;
  handleToggleSubTodo: any;
  handleEditSubTodo: any;
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
      {item.subTodos.map((subTodo: any, index: any) => (
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
            onClick={() => handleEditSubTodo(idx, subTodo.id)}
          />
        </ListItem>
      ))}
    </List>
  );
}
