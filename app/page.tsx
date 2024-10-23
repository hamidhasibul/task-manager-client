"use client";

import { type Category } from "@/types/category";
import { type Task } from "@/types/task";

import AddCategoryModal from "@/components/add-category-modal";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { axiosIns } from "@/lib/utils";
import { Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import CategoryCard from "@/components/category-card";
import TaskCard from "@/components/task-card";
import AddTaskModal from "@/components/add-task-modal";
import { useModal } from "@/hooks/useModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const categoryModal = useModal();
  const taskModal = useModal();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>();
  const [tasks, setTasks] = useState<Task[]>();

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const response = await axiosIns.get("/categories");
      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        setCategories(response.data.data);
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

  async function fetchTasks() {
    setIsLoading(true);
    const statusQuery = taskStatus === "ALL" ? "" : taskStatus;
    const priorityQuery = taskPriority === "ALL" ? "" : taskPriority;
    const categoryQuery = taskCategory === "ALL" ? "" : taskCategory;
    try {
      const response = await axiosIns.get(
        `/tasks?status=${statusQuery}&priority=${priorityQuery}&category=${categoryQuery}`
      );

      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        setTasks(response.data.data);
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

  const renderCategories = categories?.map((category) => {
    return (
      <CategoryCard
        key={category.id}
        category={category}
        fetchCategories={fetchCategories}
        setIsLoading={setIsLoading}
      />
    );
  });

  const renderTasks = tasks?.map((task) => {
    return <TaskCard key={task.id} task={task} fetchTasks={fetchTasks} />;
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [taskStatus, taskPriority, taskCategory]);

  return (
    <div className="flex flex-col  text-gray-900 w-full p-4 rounded">
      <AddCategoryModal
        isOpen={categoryModal.isOpen}
        onClose={categoryModal.handleClose}
        fetchCategories={fetchCategories}
      />
      <AddTaskModal
        isOpen={taskModal.isOpen}
        onClose={taskModal.handleClose}
        categories={categories}
        fetchTasks={fetchTasks}
      />
      <Header title="Task Manager" />
      <div className="flex items-start justify-between gap-8">
        {/* Tasks */}
        <div className="md:w-2/3 bg-gray-100 p-4 rounded-lg space-y-4">
          <h3 className="font-bold text-xl">Tasks</h3>
          <div className="flex items-center justify-between">
            <Button
              onClick={taskModal.handleOpen}
              className="bg-gray-500 hover:bg-gray-500/90"
            >
              <Plus /> Add task
            </Button>
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-2 text-xs">
                <Filter className="h-4 w-4" /> Filters
              </p>

              {/* Status Filter */}
              <Select
                onValueChange={(val) => setTaskStatus(val)}
                defaultValue={taskStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}

              <Select
                onValueChange={(val) => setTaskPriority(val)}
                defaultValue={taskPriority}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}

              <Select
                onValueChange={(val) => setTaskCategory(val)}
                defaultValue={taskCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.length === 0 ? (
                    <>
                      <p>No categories found</p>
                    </>
                  ) : (
                    <>
                      <SelectItem value="ALL">All</SelectItem>
                    </>
                  )}

                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {isLoading && (
              <>
                <p>Loading</p>
              </>
            )}
            {tasks?.length === 0 && !isLoading ? (
              <>
                <p>No tasks at this moment. Add one.</p>
              </>
            ) : (
              <>{renderTasks}</>
            )}
          </div>
        </div>
        {/* Categories */}
        <div className="md:w-1/3 p-4 rounded-lg space-y-4">
          <h3 className="font-bold text-xl">Categories</h3>
          <Button
            onClick={categoryModal.handleOpen}
            className="bg-gray-500 hover:bg-gray-500/90"
          >
            <Plus />
            Category
          </Button>
          <div className="space-y-4 h-[600px] overflow-y-auto">
            {categories?.length === 0 && !isLoading && (
              <>
                <p>No categories found. Add one.</p>
              </>
            )}
            {renderCategories}
          </div>
        </div>
      </div>
    </div>
  );
}
