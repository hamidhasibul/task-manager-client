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
import { CalendarClock, EllipsisVertical } from "lucide-react";
import DropdownTask from "@/components/dropdown-task";
import { cn } from "@/lib/utils";

type Props = {
  task: Task;
  fetchTasks: () => void;
};

export default function TaskCard({ task, fetchTasks }: Props) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3 className="text-lg capitalize">{task?.title}</h3>
          <DropdownTask task={task} fetchTasks={fetchTasks}>
            <EllipsisVertical />
          </DropdownTask>
        </CardTitle>
        <CardDescription className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-xs capitalize p-1 rounded-lg",
              task?.status === "PENDING" && "bg-orange-100 text-orange-500",
              task?.status === "COMPLETED" && "bg-teal-100 text-teal-500"
            )}
          >
            {task?.status.toLowerCase()}
          </p>
          <p className="text-xs font-semibold capitalize bg-blue-100 text-blue-500 p-2 rounded-lg">
            {task?.Category.name}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-800">{task?.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <CalendarClock />
          <p className="text-sm font-semibold">
            {format(task?.dueDate, "dd/MM/yyyy")}
          </p>
        </div>
        <span
          className={cn(
            "font-bold capitalize text-sm p-2 rounded-lg",
            task.priority === "HIGH" && "bg-red-100 text-red-500",
            task.priority === "NORMAL" && "bg-yellow-100 text-yellow-500",
            task.priority === "LOW" && "bg-green-100 text-green-500"
          )}
        >
          {task.priority.toLowerCase()}
        </span>
      </CardFooter>
    </Card>
  );
}
