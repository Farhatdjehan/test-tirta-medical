"use client";

import styles from "./dashboard.module.css";
import Button from "@mui/material/Button";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import moreMenu from "@/public/icons/more-menu.svg";
import plus from "@/public/icons/plus.svg";
import deleteIcon from "@/public/icons/delete.svg";
import emptyState from "@/public/empty-state.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

// import SaveIcon from "@mui/icons-material/Save";
// import CloseIcon from "@mui/icons-material/Close";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E0E0",
    },
    "&:hover fieldset": {
      borderColor: "#2F80ED",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2F80ED",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
    fontSize: "16px",
  },
});

type TodoItem = {
  id: number;
  userId: number;
  todo: string;
  is_done: boolean;
  dueDate: string;
  subTodos: { id: number; is_done: boolean; name: string }[];
  overdue?: boolean;
};

type SubTodoItem = {
  id: number;
  is_done: boolean;
  name: string;
};

export default function Home() {
  const infoUserLogin = localStorage.getItem("userLogin");
  const storedItems = localStorage.getItem("todoItems");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [todoItemsState, setTodoItemsState] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState<TodoItem>(defaultValueTodo);
  const [newSubTodo, setNewSubTodo] =
    useState<SubTodoItem>(defaultValueSubTodo);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addingSubTodoId, setAddingSubTodoId] = useState<number | null>(null);

  useEffect(() => {
    const userLogin = localStorage.getItem("userLogin");
    if (!userLogin) router.push("/");
  }, []);

  useEffect(() => {
    if (storedItems && infoUserLogin) {
      let userId = JSON.parse(infoUserLogin).id;
      let todoListItem = JSON.parse(storedItems);
      const userTodos = todoListItem.filter(
        (todo: TodoItem) => todo.userId === userId
      );
      setTodoItemsState(userTodos);
    } else {
      setTodoItemsState([]);
      localStorage.setItem("todoItems", JSON.stringify([]));
    }
  }, []);

  const handleStartEdit = (item: TodoItem) => {
    setEditingId(item.id);
    setNewTodo(item);
    handleClose();
    setOpen(true);
  };

  const handleDeleteTodo = (item: TodoItem) => {
    let clone = [...todoItemsState];
    const parentIndex = clone.findIndex((todo) => todo.id === item.id);
    clone.splice(parentIndex, 1);
    setTodoItemsState(clone);
    localStorage.setItem("todoItems", JSON.stringify(clone));
  };

  const handleDeleteSubTodo = () => {
    setAddingSubTodoId(null);
    setNewSubTodo(defaultValueSubTodo);
  };

  const handleAddSubTodo = (item: TodoItem) => {
    setAddingSubTodoId(item.id);
    handleClose();
  };

  const handleEditTodo = () => {
    let clone = [...todoItemsState];
    const parentIndex = clone.findIndex((todo) => todo.id === newTodo.id);
    if (parentIndex !== -1) {
      clone[parentIndex] = {
        ...newTodo,
        todo: newTodo.todo,
        dueDate: newTodo.dueDate,
      };
    }
    setTodoItemsState(clone);
    handleCloseModal();
    localStorage.setItem("todoItems", JSON.stringify(clone));
  };

  const handleOpenModal = () => setOpen(true);

  const handleCloseModal = () => {
    setOpen(false);
    setNewTodo(defaultValueTodo);
  };

  const handleCreateTodo = () => {
    if (newTodo.todo && newTodo.dueDate && infoUserLogin) {
      let clone = [...todoItemsState];

      newTodo.id = Date.now();
      newTodo.userId = JSON.parse(infoUserLogin).id;
      clone.push(newTodo);
      setTodoItemsState(clone);
      localStorage.setItem("todoItems", JSON.stringify(clone));
      handleCloseModal();
      setNewTodo(defaultValueTodo);
    }
  };

  const handleToggle = (item: TodoItem, idx: number) => {
    const updatedItems = [...todoItemsState];
    const parentIndex = updatedItems.findIndex((todo) => todo.id === item.id);
    updatedItems[parentIndex] = {
      ...item,
      is_done: !item.is_done,
    };
    if (item.subTodos.length > 0) {
      updatedItems[parentIndex].subTodos = item.subTodos.map((subTodo) => ({
        ...subTodo,
        is_done: !item.is_done, // Toggle sub-todos based on parent todo status
      }));
    }
    setTodoItemsState(updatedItems);
    localStorage.setItem("todoItems", JSON.stringify(updatedItems));
  };

  const handleToggleSubTodo = (
    item: TodoItem,
    subItem: SubTodoItem,
    idx: number
  ) => {
    const updatedItems = [...todoItemsState];
    const parentIndex = updatedItems.findIndex((todo) => todo.id === item.id);
    if (parentIndex !== -1) {
      updatedItems[parentIndex].subTodos[idx] = {
        ...subItem,
        is_done: !subItem.is_done,
      };
      const allSubTodosDone = updatedItems[parentIndex].subTodos.every(
        (subTodo) => subTodo.is_done
      );
      updatedItems[parentIndex].is_done = allSubTodosDone;

      if (!allSubTodosDone) updatedItems[parentIndex].is_done = false;

      setTodoItemsState(updatedItems);
      localStorage.setItem("todoItems", JSON.stringify(updatedItems));
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    itemId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(itemId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleSaveSubTodo = (item: TodoItem, idx: number) => {
    const updatedItems = [...todoItemsState];
    updatedItems[idx] = {
      ...item,
      subTodos: [
        ...item.subTodos,
        {
          id: Date.now(),
          is_done: false,
          name: newSubTodo.name,
        },
      ],
    };
    setTodoItemsState(updatedItems);
    setNewSubTodo(defaultValueSubTodo);
    localStorage.setItem("todoItems", JSON.stringify(updatedItems));
  };

  const handleCancelAddSubTodo = () => {
    setAddingSubTodoId(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div className={styles.mainTitle}>Todo</div>
        <Button
          variant="outlined"
          sx={{
            "& .MuiButton-endIcon": {
              marginLeft: "32px", // Adds space between text and icon
            },
          }}
          endIcon={<Image src={plus} alt="plus" />}
          onClick={handleOpenModal}
        >
          Create Todo{" "}
        </Button>
      </Box>
      <Box>
        <Grid container spacing={2}>
          {todoItemsState?.length > 0 ? (
            <>
              <Grid size={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      gutterBottom
                      sx={{ fontSize: 18, marginBottom: "24px" }}
                    >
                      Not Checked
                    </Typography>
                    <List>
                      {todoItemsState.filter((item) => item.is_done === false)
                        ?.length > 0 ? (
                        todoItemsState
                          .filter((item) => item.is_done === false)
                          .map((item, idx) => (
                            <Box key={item.id} className={styles.todoContainer}>
                              <ListItem
                                sx={{
                                  backgroundColor: "white",
                                }}
                                secondaryAction={
                                  <>
                                    <IconButton
                                      edge="end"
                                      onClick={(e) => handleClick(e, item.id)}
                                    >
                                      <Image src={moreMenu} alt="more-menu" />
                                    </IconButton>
                                    <Menu
                                      anchorEl={anchorEl}
                                      open={
                                        Boolean(anchorEl) &&
                                        selectedItem === item.id
                                      }
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
                                        boxShadow:
                                          "2px 5px 28px rgba(0, 0, 0, 0.05)",
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() => handleStartEdit(item)}
                                      >
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => handleDeleteTodo(item)}
                                      >
                                        Delete
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => handleAddSubTodo(item)}
                                      >
                                        Create Sub To-do
                                      </MenuItem>
                                    </Menu>
                                  </>
                                }
                              >
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    checked={item.is_done}
                                    onChange={() => handleToggle(item, idx)}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography component="span">
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
                                        color: item.overdue
                                          ? "error.main"
                                          : "text.secondary",
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      {item.dueDate}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              {item.subTodos.length > 0 && (
                                <List sx={{ pl: 4, pr: 2 }}>
                                  {item.subTodos.map((subTodo, index) => (
                                    <ListItem
                                      key={subTodo.id}
                                      sx={{
                                        mb: 1,
                                        backgroundColor: "white",
                                        border: "none",
                                        boxShadow:
                                          "2px 5px 28px rgba(0, 0, 0, 0.05)",
                                      }}
                                      secondaryAction={
                                        <IconButton edge="end">
                                          <Image
                                            src={deleteIcon}
                                            alt="more-menu"
                                          />
                                        </IconButton>
                                      }
                                    >
                                      <ListItemIcon>
                                        <Checkbox
                                          edge="start"
                                          checked={subTodo.is_done}
                                          onChange={() =>
                                            handleToggleSubTodo(
                                              item,
                                              subTodo,
                                              index
                                            )
                                          }
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary={subTodo.name} />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                              {addingSubTodoId === item.id && (
                                <List sx={{ pl: 4, pr: 2 }}>
                                  <ListItem
                                    sx={{
                                      mb: 1,
                                      backgroundColor: "white",
                                      border: "1px solid #2F80ED",

                                      boxShadow:
                                        "2px 5px 28px rgba(0, 0, 0, 0.05)",
                                    }}
                                    secondaryAction={
                                      <IconButton
                                        edge="end"
                                        onClick={handleDeleteSubTodo}
                                      >
                                        <Image
                                          src={deleteIcon}
                                          alt="more-menu"
                                        />
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
                                      onChange={(e) =>
                                        setNewSubTodo({
                                          ...newSubTodo,
                                          name: e.target.value,
                                        })
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleSaveSubTodo(item, idx);
                                        } else if (e.key === "Escape") {
                                          handleCancelAddSubTodo();
                                        }
                                      }}
                                    />
                                    <Box
                                      sx={{ display: "flex", gap: 1, ml: 1 }}
                                    >
                                      {/* <IconButton
                                    size="small"
                                    onClick={() => handleSaveSubTodo(item.id)}
                                    disabled={!newSubTodo.trim()}
                                  ></IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={handleCancelAddSubTodo}
                                  ></IconButton> */}
                                    </Box>
                                  </ListItem>
                                </List>
                              )}
                            </Box>
                          ))
                      ) : (
                        <Typography style={{ textAlign: "center" }}>
                          No Todo Found
                        </Typography>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      gutterBottom
                      sx={{ fontSize: 18, marginBottom: "24px" }}
                    >
                      Checked
                    </Typography>
                    <List>
                      {todoItemsState.filter((item) => item.is_done === true)
                        ?.length > 0 ? (
                        todoItemsState
                          .filter((item) => item.is_done === true)
                          .map((item, idx) => (
                            <Box key={item.id} className={styles.todoContainer}>
                              <ListItem
                                sx={{
                                  backgroundColor: "white",
                                }}
                                secondaryAction={
                                  <>
                                    <IconButton
                                      edge="end"
                                      onClick={(e) => handleClick(e, item.id)}
                                    >
                                      <Image src={moreMenu} alt="more-menu" />
                                    </IconButton>
                                    <Menu
                                      anchorEl={anchorEl}
                                      open={
                                        Boolean(anchorEl) &&
                                        selectedItem === item.id
                                      }
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
                                        boxShadow:
                                          "2px 5px 28px rgba(0, 0, 0, 0.05)",
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() => handleDeleteTodo(item)}
                                      >
                                        Delete
                                      </MenuItem>
                                    </Menu>
                                  </>
                                }
                              >
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    checked={item.is_done}
                                    onChange={() => handleToggle(item, idx)}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography
                                      component="span"
                                      sx={{
                                        textDecoration: item.is_done
                                          ? "line-through"
                                          : "none",
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
                                        color: item.overdue
                                          ? "error.main"
                                          : "text.secondary",
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      {item.dueDate}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              {item.subTodos.length > 0 && (
                                <List sx={{ pl: 4, pr: 2 }}>
                                  {item.subTodos.map((subTodo, index) => (
                                    <ListItem
                                      key={subTodo.id}
                                      sx={{
                                        mb: 1,
                                        backgroundColor: "white",
                                        border: "none",
                                        boxShadow:
                                          "2px 5px 28px rgba(0, 0, 0, 0.05)",
                                      }}
                                      secondaryAction={
                                        <IconButton edge="end">
                                          <Image
                                            src={deleteIcon}
                                            alt="more-menu"
                                          />
                                        </IconButton>
                                      }
                                    >
                                      <ListItemIcon>
                                        <Checkbox
                                          edge="start"
                                          checked={subTodo.is_done}
                                          onChange={() =>
                                            handleToggleSubTodo(
                                              item,
                                              subTodo,
                                              index
                                            )
                                          }
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary={subTodo.name} />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                              {addingSubTodoId === item.id && (
                                <List sx={{ pl: 4, pr: 2 }}>
                                  <ListItem
                                    sx={{
                                      mb: 1,
                                      backgroundColor: "white",
                                      border: "1px solid #2F80ED",

                                      boxShadow:
                                        "2px 5px 28px rgba(0, 0, 0, 0.05)",
                                    }}
                                    secondaryAction={
                                      <IconButton
                                        edge="end"
                                        onClick={handleDeleteSubTodo}
                                      >
                                        <Image
                                          src={deleteIcon}
                                          alt="more-menu"
                                        />
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
                                      onChange={(e) =>
                                        setNewSubTodo({
                                          ...newSubTodo,
                                          name: e.target.value,
                                        })
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleSaveSubTodo(item, idx);
                                        } else if (e.key === "Escape") {
                                          handleCancelAddSubTodo();
                                        }
                                      }}
                                    />
                                    <Box
                                      sx={{ display: "flex", gap: 1, ml: 1 }}
                                    >
                                      {/* <IconButton
                                    size="small"
                                    onClick={() => handleSaveSubTodo(item.id)}
                                    disabled={!newSubTodo.trim()}
                                  ></IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={handleCancelAddSubTodo}
                                  ></IconButton> */}
                                    </Box>
                                  </ListItem>
                                </List>
                              )}
                            </Box>
                          ))
                      ) : (
                        <Typography style={{ textAlign: "center" }}>
                          No Finished Todo Found
                        </Typography>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : (
            <Grid
              size={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "64px",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image src={emptyState} alt="empty-state" />
              <Typography
                variant="h6"
                sx={{ marginTop: "32px", color: "#154886", opacity: 0.6 }}
              >
                You Don't Have a Todo Yet
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit" : "Add"} Todo</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth required>
              <FormLabel
                sx={{
                  fontWeight: 400,
                  color: "#4F4F4F",
                  fontSize: "14px",
                  marginBottom: 1,
                }}
              >
                Todo
              </FormLabel>

              <StyledTextField
                id="todo"
                name="todo"
                variant="outlined"
                placeholder="Todo"
                value={newTodo.todo}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, todo: e.target.value })
                }
                sx={{ marginBottom: 1 }}
              />
            </FormControl>
            <FormControl fullWidth required>
              <FormLabel
                sx={{
                  fontWeight: 400,
                  color: "#4F4F4F",
                  fontSize: "14px",
                  marginBottom: 1,
                }}
              >
                Due Date
              </FormLabel>

              <StyledTextField
                id="date"
                name="date"
                type="date"
                variant="outlined"
                value={newTodo.dueDate}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, dueDate: e.target.value })
                }
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={editingId ? handleEditTodo : handleCreateTodo}
          >
            {editingId ? "Edit" : "Save"}
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const defaultValueTodo = {
  id: 1,
  userId: 1,
  todo: "",
  dueDate: "",
  is_done: false,
  subTodos: [],
};

const defaultValueSubTodo = {
  id: 1,
  is_done: false,
  name: "",
};
