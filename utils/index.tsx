import dayjs from "dayjs";

type TodoItem = {
  dueDate: string | Date;
};

export function formatDueDate(item: TodoItem) {
  const today = dayjs().startOf("day");
  const dueDate = dayjs(item.dueDate);

  if (dueDate.isSame(today, "day")) {
    return <span className="today">Today</span>;
  } else if (dueDate.isBefore(today, "day")) {
    return (
      <span className="overdue">Overdue - {dueDate.format("YYYY-MM-DD")}</span>
    );
  } else {
    return <span className="future">{dueDate.format("YYYY-MM-DD")}</span>;
  }
}
