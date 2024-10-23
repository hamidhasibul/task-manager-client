import React, { useState } from "react";
import Modal from "./modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Category } from "@/types/category";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { axiosIns, cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { CalendarIcon, CheckIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { isAxiosError } from "axios";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  fetchTasks: () => void;
  categories: Category[] | undefined;
};

const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(1),
  dueDate: z.date(),
  priority: z.string(),
  categoryId: z.string(),
});

export type AddTaskValues = z.infer<typeof formSchema>;

export default function AddTaskModal({
  isOpen,
  onClose,
  categories,
  fetchTasks,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const form = useForm<AddTaskValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      dueDate: undefined,
      categoryId: "",
    },
  });

  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  async function onSubmit(data: AddTaskValues) {
    setIsLoading(true);
    try {
      const response = await axiosIns.post("/tasks", data);
      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success("Task added successfully");
        form.reset();
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
      title="Add Task"
      description="Add a new task"
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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? categories?.find(
                                (category) => category.id === field.value
                              )?.name
                            : "Select Category"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search category..."
                          className="h-9"
                          value={search}
                          onValueChange={setSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No Category found.</CommandEmpty>

                          <CommandGroup>
                            {filteredCategories?.map((category: Category) => (
                              <CommandItem
                                value={category.id}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue("categoryId", category.id);
                                }}
                              >
                                {category.name}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    category.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
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
