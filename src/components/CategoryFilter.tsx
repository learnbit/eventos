import { categoryLabels } from "@/constants/event";
import { validCategoryOptions } from "@/types/event";
import Link from "next/link";

type CategoryFilterProps = {
  activeCategory: string | undefined;
};

export default function CategoryFilter({
  activeCategory,
}: CategoryFilterProps) {
  const isAllActive = !activeCategory;

  const activeClass = "bg-primary border-primary font-semibold";

  return (
    <div className="flex gap-3 flex-wrap">
      <Link
        className={`border border-border rounded-md px-4 py-2 hover:bg-surface-hover  ${
          isAllActive && activeClass
        }`}
        href="/"
      >
        Todos
      </Link>

      {validCategoryOptions.map((cat) => {
        const isActive = cat === activeCategory;

        return (
          <Link
            className={`border border-border rounded-md px-4 py-2 hover:bg-surface-hover ${
              isActive && activeClass
            }`}
            key={cat}
            href={`/?category=${cat}`}
          >
            {categoryLabels[cat] ?? cat}
          </Link>
        );
      })}
    </div>
  );
}
