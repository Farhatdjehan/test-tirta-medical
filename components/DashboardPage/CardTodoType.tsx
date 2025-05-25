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

type CardTodoTypeProps = {
  title: string;
  children: any;
};
export default function CardTodoType(props: CardTodoTypeProps) {
  const { title, children } = props;
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom sx={{ fontSize: 18, marginBottom: "24px" }}>
          {title}
        </Typography>
        <List>{children}</List>
      </CardContent>
    </Card>
  );
}
