import { type Category } from "./category";

export type TaskPriority = "HIGH" | "NORMAL" | "LOW";
export type TaskStatus = "PENDING" | "COMPLETED";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  Category: Category;
};
