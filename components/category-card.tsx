import { type Category } from "@/types/category";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Pencil, Trash } from "lucide-react";
import { axiosIns } from "@/lib/utils";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useModal } from "@/hooks/useModal";
import EditCategoryModal from "./edit-category-modal";

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
  const editCategoryModal = useModal();
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
    <>
      <EditCategoryModal
        isOpen={editCategoryModal.isOpen}
        onClose={editCategoryModal.handleClose}
        category={category}
        fetchCategories={fetchCategories}
      />
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

        <Button onClick={editCategoryModal.handleOpen}>
          <Pencil />
        </Button>
      </p>
    </>
  );
}
