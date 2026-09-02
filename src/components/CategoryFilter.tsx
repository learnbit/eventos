import { validCategoryOptions } from "@/types/event";
import Link from "next/link";

type CategoryFilterProps = {
  activeCategory: string | undefined;
};

export default function CategoryFilter({
  activeCategory,
}: CategoryFilterProps) {
  const isAllActive = !activeCategory;

  const activeClass = "bg-primary font-semibold";

  return (
    <div className="flex gap-4 justify-center">
      <Link
        className={`border border-border rounded-md px-4 py-2 hover:bg-surface-hover  ${
          isAllActive && activeClass
        }`}
        href="/"
      >
        All
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
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
