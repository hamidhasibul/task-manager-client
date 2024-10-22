import { z } from "zod";
import Modal from "./modal";
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
import { axiosIns } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { isAxiosError } from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const formSchema = z.object({
  name: z.string().min(2).max(10),
});

export type AddCategoryValues = z.infer<typeof formSchema>;

export default function AddCategoryModal({ isOpen, onClose }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<AddCategoryValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: AddCategoryValues) {
    setIsLoading(true);
    try {
      const response = await axiosIns.post("/categories", data);

      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success("Category added successfully");
        form.reset();
        onClose();
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
      title="Add Category"
      description="Add a new category"
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

          <Button disabled={isLoading}>Create</Button>
        </form>
      </Form>
    </Modal>
  );
}
