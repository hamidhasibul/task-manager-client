import React, { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { type Task } from "@/types/task";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { axiosIns } from "@/lib/utils";
import { useModal } from "@/hooks/useModal";
import EditTaskModal from "./edit-task-modal";
type Props = {
  task: Task;
  fetchTasks: () => void;
  children: ReactNode;
};

export default function DropdownTask({ task, children, fetchTasks }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const editTaskModal = useModal();
  async function toggleStatus() {
    setIsLoading(true);
    const data = {
      status: task.status === "PENDING" ? "COMPLETED" : "PENDING",
    };

    try {
      const response = await axiosIns.patch(
        `/tasks/${task.id}/change-status`,
        data
      );

      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(`Marked as ${data.status.toLowerCase()}`);
        fetchTasks();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteTask() {
    setIsLoading(true);
    try {
      const response = await axiosIns.delete(`/tasks/${task.id}`);
      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(`Task deleted successfully`);
        fetchTasks();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <EditTaskModal
        isOpen={editTaskModal.isOpen}
        onClose={editTaskModal.handleClose}
        task={task}
        fetchTasks={fetchTasks}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {task?.status === "COMPLETED" && (
            <DropdownMenuItem onClick={toggleStatus} disabled={isLoading}>
              Mark as pending
            </DropdownMenuItem>
          )}
          {task?.status === "PENDING" && (
            <DropdownMenuItem onClick={toggleStatus} disabled={isLoading}>
              Mark as completed
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={deleteTask} disabled={isLoading}>
            Delete task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={editTaskModal.handleOpen}
            disabled={isLoading}
          >
            Edit task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
