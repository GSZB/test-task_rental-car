import CarCard from "@/components/CarCard/CarCard";
import type { Car } from "@/types/car";
import css from "./CarList.module.css";

interface CarListProps {
  cars: Car[];
}

export default function CarList({ cars }: CarListProps) {
  return (
    <ul className={css["car-list"]}>
      {cars.map((car) => (
        <li key={car.id} className={css["car-list__item"]}>
          <CarCard car={car} />
        </li>
      ))}
    </ul>
  );
}
