import CarCard from "@/components/CarCard/CarCard";
import type { Car } from "@/types/car";
import css from "./CarList.module.css";

// One row of the four-column grid is visible without scrolling.
const ABOVE_FOLD_COUNT = 4;

interface CarListProps {
  cars: Car[];
}

export default function CarList({ cars }: CarListProps) {
  return (
    <ul className={css["car-list"]}>
      {cars.map((car, index) => (
        <li key={car.id} className={css["car-list__item"]}>
          <CarCard car={car} isAboveFold={index < ABOVE_FOLD_COUNT} />
        </li>
      ))}
    </ul>
  );
}
