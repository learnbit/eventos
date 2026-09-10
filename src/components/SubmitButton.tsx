import { useFormStatus } from "react-dom";

export default function SubmitButton({
  className,
  title,
}: {
  className: string;
  title: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button className={className} type="submit" disabled={pending}>
      {pending ? "Guardando..." : title}
    </button>
  );
}
