import css from "./Loader.module.css";

interface LoaderProps {
  title?: string;
  description?: string;
}

export default function Loader({
  title = "Loading cars...",
  description = "Please wait while we fetch the best cars for you",
}: LoaderProps) {
  return (
    <div className={css.loader} role="status">
      <span className={css.loader__spinner} />
      <p className={css.loader__title}>{title}</p>
      <p className={css.loader__description}>{description}</p>
    </div>
  );
}
