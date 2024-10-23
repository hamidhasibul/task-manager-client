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
type Props = {
  task: Task;
  children: ReactNode;
};

export default function DropdownTask({ task, children }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants()}>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
