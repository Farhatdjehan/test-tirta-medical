import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  TextField,
} from "@mui/material";
import Image from "next/image";
import closeIcon from "@/public/icons/times.svg";
import { Dispatch, SetStateAction } from "react";
interface SubTodoItemProps {
  id: number;
  is_done: boolean;
  name: string;
}

interface SubTodoProps {
  handleDeleteSubTodo: () => void;
  newSubTodo: SubTodoItemProps;
  setNewSubTodo: Dispatch<SetStateAction<SubTodoItemProps>>;
  handleSaveSubTodo: (idx: number, name: string) => void;
  createNewTodo: () => void;
  idx: number;
}

export default function AddSubTodoField(props: SubTodoProps) {
  const {
    handleDeleteSubTodo,
    newSubTodo,
    setNewSubTodo,
    handleSaveSubTodo,
    createNewTodo,
    idx,
  } = props;
  return (
    <List sx={{ pl: 4, pr: 2 }}>
      <ListItem
        sx={{
          mb: 1,
          backgroundColor: "white",
          border: "1px solid #2F80ED",

          boxShadow: "2px 5px 28px rgba(0, 0, 0, 0.05)",
        }}
        secondaryAction={
          <IconButton edge="end" onClick={handleDeleteSubTodo}>
            <Image src={closeIcon} alt="more-menu" />
          </IconButton>
        }
      >
        <ListItemIcon>
          <Checkbox edge="start" disabled />
        </ListItemIcon>
        <TextField
          name="name"
          id="name"
          autoFocus
          placeholder="New sub todo"
          variant="standard"
          fullWidth
          value={newSubTodo.name}
          onChange={(e) => {
            const newName = e.target.value;
            setNewSubTodo({
              ...newSubTodo,
              name: e.target.value,
            });
            handleSaveSubTodo(idx, newName);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") createNewTodo();
          }}
        />
      </ListItem>
    </List>
  );
}
