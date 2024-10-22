"use client";

import AddCategoryModal from "@/components/add-category-modal";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOpen() {
    setIsOpen(true);
  }
  function handleClose() {
    setIsOpen(false);
  }
  return (
    <div className="flex flex-col bg-gray-100 text-gray-900 w-full p-4 rounded">
      <AddCategoryModal isOpen={isOpen} onClose={handleClose} />
      <Header title="Task Manager" />
      <div className="flex items-center justify-between gap-4">
        {/* Tasks */}
        <div className="md:w-2/3">Tasks</div>
        {/* Categories */}
        <div className="md:w-1/3">
          <h3 className="text-center font-bold">Categories</h3>
          <Button className="w-full" onClick={handleOpen}>
            <Plus />
            Category
          </Button>
        </div>
      </div>
    </div>
  );
}
