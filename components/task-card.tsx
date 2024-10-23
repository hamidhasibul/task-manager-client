import { type Task } from "@/types/task";
import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import DropdownTask from "@/components/dropdown-task";

type Props = {
  task: Task;
  fetchTasks: () => void;
};

export default function TaskCard({ task, fetchTasks }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{task?.title}</span>
          <DropdownTask task={task} fetchTasks={fetchTasks}>
            <EllipsisVertical />
          </DropdownTask>
        </CardTitle>
        <CardDescription className="flex flex-col">
          <span>{task?.status}</span> <span>{task?.Category.name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{task?.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span>Due on {format(task?.dueDate, "dd/MM/yyyy")}</span>
        <span className="font-bold">{task.priority.toLowerCase()}</span>
      </CardFooter>
    </Card>
  );
}
