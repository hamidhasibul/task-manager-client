import React, { useState } from "react";
import Modal from "./modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/types/category";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { axiosIns } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  fetchCategories: () => void;
};

const formSchema = z.object({
  name: z.string().min(2).max(20),
});

export type EditCategoryValues = z.infer<typeof formSchema>;
export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
  fetchCategories,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<EditCategoryValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
    },
  });

  async function onSubmit(data: EditCategoryValues) {
    try {
      const response = await axiosIns.patch(`/categories/${category.id}`, data);

      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success("Category updated successfully");
        onClose();
        fetchCategories();
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
      title="Edit Category"
      description="Edit existing category"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading}>Submit</Button>
        </form>
      </Form>
    </Modal>
  );
}
