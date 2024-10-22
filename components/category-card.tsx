import { type Category } from "@/types/category";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { axiosIns } from "@/lib/utils";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type Props = {
  category: Category;
  fetchCategories: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function CategoryCard({
  category,
  fetchCategories,
  setIsLoading,
}: Props) {
  async function deleteCategory(categoryId: string) {
    setIsLoading(true);
    try {
      const response = await axiosIns.delete(`/categories/${categoryId}`);

      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success("Category has been deleted");
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <p className="capitalize">
      {category.name}
      <Button
        variant={"destructive"}
        onClick={() => {
          deleteCategory(category.id);
        }}
      >
        <Trash />
      </Button>
    </p>
  );
}
