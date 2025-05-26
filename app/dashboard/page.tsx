"use client";

import dayjs from "dayjs";
import styles from "./dashboard.module.css";
import Button from "@mui/material/Button";
import "react-datetime/css/react-datetime.css";

import {
  Box,
  Grid,
  Typography,
  List,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import plus from "@/public/icons/plus.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CardTodoType from "@/components/DashboardPage/CardTodoType";
import EmptyState from "@/components/EmptyState";
import Todo from "@/components/DashboardPage/Todo";
import SubTodo from "@/components/DashboardPage/SubTodo";
import AddSubTodoField from "@/components/DashboardPage/AddSubTodoField";
import { sortingCheckedItem, sortingNotCheckedItem } from "@/utils";

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

interface TodoItem {
  id: number;
  userId: number;
  todo: string;
  is_done: boolean;
  dueDate: string;
  subTodos: { id: number; is_done: boolean; name: string }[];
  overdue?: boolean;
}

interface SubTodoItem {
  id: number;
  is_done: boolean;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmationDelete, setConfirmationDelete] = useState<{
    data: Partial<TodoItem>;
    open: boolean;
  }>(defaultSelectedValue);
  const [todoItemsState, setTodoItemsState] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState<TodoItem>(defaultValueTodo);
  const [newSubTodo, setNewSubTodo] =
    useState<SubTodoItem>(defaultValueSubTodo);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [addingSubTodoId, setAddingSubTodoId] = useState<number | null>(null);
  const [editingSubTodoId, setEditingSubTodoId] = useState<number | null>(null);
  const [indexSubTodo, setIndexSubTodo] = useState<number | null>(null);

  useEffect(() => {
    const userLogin = localStorage.getItem("userLogin");
    if (!userLogin) router.push("/");
  }, []);

  useEffect(() => {
    const infoUserLogin = localStorage.getItem("userLogin");
    const storedItems = localStorage.getItem("todoItems");
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
    setNewTodo(item);
    handleClose();
    setOpen(true);
  };

  const confirmationPopup = (item: TodoItem) => {
    let clone = { ...confirmationDelete };
    clone.data = item;
    clone.open = true;
    setConfirmationDelete(clone);
  };

  const handleDeleteTodo = (item: TodoItem) => {
    let clone = [...todoItemsState];
    const parentIndex = clone.findIndex((todo) => todo.id === item.id);
    clone.splice(parentIndex, 1);
    setTodoItemsState(clone);
    localStorage.setItem("todoItems", JSON.stringify(clone));
    setConfirmationDelete(defaultSelectedValue);
  };

  const handleDeleteSubTodo = () => {
    setAddingSubTodoId(null);
    setNewSubTodo(defaultValueSubTodo);
  };

  const deleteSavedSubTodo = (parentContent: TodoItem, idxSubTodo: number) => {
    let clone = [...todoItemsState];
    const parentIndex = clone.findIndex((todo) => todo.id === parentContent.id);
    if (parentIndex !== -1) {
      const parentTodo = clone[parentIndex];

      const updatedSubTodos = parentTodo.subTodos.filter(
        (_, idx) => idx !== idxSubTodo
      );

      clone[parentIndex] = {
        ...parentTodo,
        subTodos: updatedSubTodos,
      };

      setTodoItemsState(clone);
      localStorage.setItem("todoItems", JSON.stringify(clone));
    }
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

  const updateSubTodo = () => {
    const updatedItems = [...todoItemsState];
    const parentIndex = updatedItems.findIndex(
      (todo) => todo.id === newTodo.id
    );
    if (parentIndex !== -1 && indexSubTodo !== null) {
      updatedItems[parentIndex].subTodos[indexSubTodo] = {
        ...newSubTodo,
        name: newSubTodo.name,
      };
      setOpen(false);
      setNewTodo(defaultValueTodo);
      setNewSubTodo(defaultValueSubTodo);
      setIndexSubTodo(null);
      setTodoItemsState(updatedItems);
      localStorage.setItem("todoItems", JSON.stringify(updatedItems));
    }
  };

  const handleCreateTodo = () => {
    const infoUserLogin = localStorage.getItem("userLogin");
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

  const handleToggle = (item: TodoItem) => {
    const updatedItems = [...todoItemsState];
    const parentIndex = updatedItems.findIndex((todo) => todo.id === item.id);
    updatedItems[parentIndex] = {
      ...item,
      is_done: !item.is_done,
    };
    if (item.subTodos.length > 0) {
      updatedItems[parentIndex].subTodos = item.subTodos.map((subTodo) => ({
        ...subTodo,
        is_done: !item.is_done,
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

  const handleSaveSubTodo = (idx: number, name: string) => {
    const updatedItems = [...todoItemsState];

    const currentParent = updatedItems[idx];
    let updatedSubTodos = [...currentParent.subTodos];

    if (editingSubTodoId === null) {
      const newId = Date.now();
      const newSub = {
        id: newId,
        is_done: false,
        name: name.trim(),
      };

      updatedSubTodos.push(newSub);
      setEditingSubTodoId(newId);
    } else {
      updatedSubTodos = updatedSubTodos.map((sub) =>
        sub.id === editingSubTodoId ? { ...sub, name: name.trim() } : sub
      );
    }

    updatedItems[idx] = {
      ...currentParent,
      subTodos: updatedSubTodos,
    };

    setTodoItemsState(updatedItems);
    setNewSubTodo((prev) => ({ ...prev, name }));
    localStorage.setItem("todoItems", JSON.stringify(updatedItems));
  };

  const handleEditSubTodo = (
    item: TodoItem,
    idx: number,
    itemSubTodo: SubTodoItem
  ) => {
    setNewTodo(item);
    setNewSubTodo(itemSubTodo);
    setIndexSubTodo(idx);
    setOpen(true);
  };

  const createNewTodo = () => {
    setNewSubTodo(defaultValueSubTodo);
    setEditingSubTodoId(null);
  };

  const handleOpenModal = () => setOpen(true);

  const handleCloseModal = () => {
    setOpen(false);
    setNewTodo(defaultValueTodo);
    setNewSubTodo(defaultValueSubTodo);
  };

  const handleCloseModalConfirmation = () => {
    setConfirmationDelete(defaultSelectedValue);
  };

  return (
    <>
      <Box>
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div className={styles.mainTitle}>📝 Todo</div>
          <Button
            variant="outlined"
            sx={{
              "& .MuiButton-endIcon": {
                marginLeft: "32px",
              },
            }}
            endIcon={<Image src={plus} alt="plus" />}
            onClick={handleOpenModal}
          >
            Create Todo{" "}
          </Button>
        </Grid>
      </Box>
      <Box>
        <Grid container spacing={2}>
          {todoItemsState?.length > 0 ? (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <CardTodoType title="Not Checked">
                  <List>
                    {todoItemsState.filter((item) => !item.is_done)?.length >
                    0 ? (
                      todoItemsState
                        .filter((item) => !item.is_done)
                        .sort(sortingNotCheckedItem)
                        .map((item, idx) => (
                          <Box key={item.id} className={styles.todoContainer}>
                            <Todo
                              item={item}
                              anchorEl={anchorEl}
                              handleStartEdit={handleStartEdit}
                              handleDeleteTodo={confirmationPopup}
                              handleAddSubTodo={handleAddSubTodo}
                              handleToggle={handleToggle}
                              selectedItem={selectedItem}
                              handleClick={handleClick}
                              handleClose={handleClose}
                              type="not_checked"
                            />

                            {item.subTodos.length > 0 && (
                              <SubTodo
                                item={item}
                                deleteSavedSubTodo={deleteSavedSubTodo}
                                handleToggleSubTodo={handleToggleSubTodo}
                                handleEditSubTodo={handleEditSubTodo}
                                idx={idx}
                              />
                            )}
                            {addingSubTodoId === item.id && (
                              <AddSubTodoField
                                handleDeleteSubTodo={handleDeleteSubTodo}
                                newSubTodo={newSubTodo}
                                setNewSubTodo={setNewSubTodo}
                                handleSaveSubTodo={handleSaveSubTodo}
                                createNewTodo={createNewTodo}
                                idx={idx}
                              />
                            )}
                          </Box>
                        ))
                    ) : (
                      <Typography style={{ textAlign: "center" }}>
                        No Todo Found
                      </Typography>
                    )}
                  </List>
                </CardTodoType>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CardTodoType title="Checked">
                  <List>
                    {todoItemsState.filter((item) => item.is_done)?.length >
                    0 ? (
                      todoItemsState
                        .filter((item) => item.is_done)
                        .sort(sortingCheckedItem)
                        .map((item, idx) => (
                          <Box key={item.id} className={styles.todoContainer}>
                            <Todo
                              item={item}
                              anchorEl={anchorEl}
                              handleStartEdit={handleStartEdit}
                              handleDeleteTodo={confirmationPopup}
                              handleAddSubTodo={handleAddSubTodo}
                              handleToggle={handleToggle}
                              selectedItem={selectedItem}
                              handleClick={handleClick}
                              handleClose={handleClose}
                              type="checked"
                            />
                            {item.subTodos.length > 0 && (
                              <SubTodo
                                item={item}
                                deleteSavedSubTodo={deleteSavedSubTodo}
                                handleToggleSubTodo={handleToggleSubTodo}
                                handleEditSubTodo={handleEditSubTodo}
                                idx={idx}
                              />
                            )}
                          </Box>
                        ))
                    ) : (
                      <Typography style={{ textAlign: "center" }}>
                        No Finished Todo Found
                      </Typography>
                    )}
                  </List>
                </CardTodoType>
              </Grid>
            </>
          ) : (
            <EmptyState />
          )}
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {newSubTodo?.id ? "Edit Sub" : newTodo.id ? "Edit" : "Add"} Todo
        </DialogTitle>
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
                {newSubTodo?.id ? "Sub" : ""} Todo
              </FormLabel>

              <StyledTextField
                id="todo"
                name="todo"
                variant="outlined"
                placeholder="Todo"
                value={newSubTodo?.id ? newSubTodo?.name : newTodo.todo}
                onChange={(e) => {
                  newSubTodo?.id
                    ? setNewSubTodo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    : setNewTodo({ ...newTodo, todo: e.target.value });
                }}
                sx={{ marginBottom: 1 }}
              />
            </FormControl>
            {!newSubTodo?.id && (
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
                  slotProps={{
                    htmlInput: {
                      min: newTodo.id
                        ? undefined
                        : dayjs().format("YYYY-MM-DD"),
                    },
                  }}
                />
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={
              newSubTodo?.id
                ? updateSubTodo
                : newTodo.id
                ? handleEditTodo
                : handleCreateTodo
            }
          >
            {newTodo.id ? "Edit" : "Save"}
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmationDelete.open}
        onClose={handleCloseModalConfirmation}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography>
              Are you sure want to delete {confirmationDelete.data.todo}?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() =>
              handleDeleteTodo(confirmationDelete.data as TodoItem)
            }
          >
            Delete
          </Button>
          <Button onClick={handleCloseModalConfirmation}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const defaultValueTodo = {
  id: 0,
  userId: 1,
  todo: "",
  dueDate: "",
  is_done: false,
  subTodos: [],
};

const defaultValueSubTodo = {
  id: 0,
  is_done: false,
  name: "",
};

const defaultSelectedValue = {
  data: {},
  open: false,
};
