import css from "./LoadMoreButton.module.css";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function LoadMoreButton({
  onClick,
  isLoading,
}: LoadMoreButtonProps) {
  return (
    <button
      type="button"
      className={css["load-more"]}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Load more"}
    </button>
  );
}
