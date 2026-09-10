import Image from "next/image";
import css from "./EmptyState.module.css";

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className={css["empty-state"]}>
      <Image
        src="/no-cars.webp"
        alt=""
        width={414}
        height={388}
        className={css["empty-state__image"]}
      />
      <h2 className={css["empty-state__title"]}>No cars found</h2>
      <p className={css["empty-state__description"]}>
        We couldn&apos;t find any cars that match your current filters. Try
        changing your search criteria or reset the filters.
      </p>
      <button
        type="button"
        className={css["empty-state__button"]}
        onClick={onReset}
      >
        Reset filters
      </button>
    </div>
  );
}
