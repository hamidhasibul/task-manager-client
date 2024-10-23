import React, { useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import Modal from "./modal";
import { Task } from "@/types/task";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { axiosIns, cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  fetchTasks: () => void;
};

const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(1),
  dueDate: z.date(),
});

export type EditTaskValues = z.infer<typeof formSchema>;

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
  fetchTasks,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<EditTaskValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
    },
  });

  async function onSubmit(data: EditTaskValues) {
    try {
      const response = await axiosIns.patch(`/tasks/${task.id}`, data);

      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success("Task updated successfully");
        onClose();
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
    <Modal
      title="Edit Task"
      description="Edit existing task"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter task description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
