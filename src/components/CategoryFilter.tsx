"use client";

import { categoryLabels } from "@/constants/event";
import { validCategoryOptions } from "@/types/event";
import Link from "next/link";
import { useState } from "react";

type CategoryFilterProps = {
  activeCategory: string | undefined;
};

export default function CategoryFilter({
  activeCategory,
}: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    activeCategory ?? ""
  );

  const activeClass = "bg-primary border-primary font-semibold";

  return (
    <div className="flex gap-3 flex-wrap">
      <Link
        onClick={() => setSelectedCategory("")}
        className={`border border-border rounded-md px-4 py-2 hover:bg-surface-hover ${
          selectedCategory === "" ? activeClass : ""
        }`}
        href="/"
      >
        Todos
      </Link>

      {validCategoryOptions.map((cat) => (
        <Link
          key={cat}
          href={`/?category=${cat}`}
          onClick={() => setSelectedCategory(cat)}
          className={`border border-border rounded-md px-4 py-2 hover:bg-surface-hover ${
            selectedCategory === cat ? activeClass : ""
          }`}
        >
          {categoryLabels[cat] ?? cat}
        </Link>
      ))}
    </div>
  );
}
