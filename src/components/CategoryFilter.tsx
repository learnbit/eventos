import { validCategoryOptions } from "@/types/event";
import Link from "next/link";

type CategoryFilterProps = {
  activeCategory: string | undefined;
};

export default function CategoryFilter({
  activeCategory,
}: CategoryFilterProps) {
  const isAllActive = !activeCategory;

  return (
    <>
      <Link href="/">All</Link>

      {validCategoryOptions.map((cat) => {
        const isActive = cat === activeCategory;

        return (
          <Link key={cat} href={`/?category=${cat}`}>
            {cat}
          </Link>
        );
      })}
    </>
  );
}
