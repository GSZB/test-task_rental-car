"use client";

import Dropdown from "@/components/Dropdown/Dropdown";
import type { CarFilterOptions, CarFilters } from "@/types/car";
import css from "./Filters.module.css";

interface FiltersProps {
  value: CarFilters;
  options?: CarFilterOptions;
  onChange: (filters: CarFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

const PRICE_STEP = 10;

function buildPriceOptions(options?: CarFilterOptions) {
  if (!options) return [];

  const { min, max } = options.price;
  const prices: string[] = [];

  for (let price = min; price <= max; price += PRICE_STEP) {
    prices.push(String(price));
  }

  return prices.map((price) => ({ value: price, label: price }));
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export default function Filters({
  value,
  options,
  onChange,
  onSearch,
  onReset,
}: FiltersProps) {
  const brandOptions = (options?.brands ?? []).map((brand) => ({
    value: brand,
    label: brand,
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form className={css.filters} onSubmit={handleSubmit}>
      <div className={css.filters__row}>
        <div className={css["filters__field--brand"]}>
          <Dropdown
            id="car-brand"
            label="Car brand"
            placeholder="Choose a brand"
            options={brandOptions}
            value={value.brand ?? ""}
            onChange={(brand) => onChange({ ...value, brand })}
          />
        </div>

        <div className={css["filters__field--price"]}>
          <Dropdown
            id="car-price"
            label="Price/ 1 hour"
            placeholder="Choose a price"
            options={buildPriceOptions(options)}
            value={value.price ?? ""}
            displayValue={value.price ? `To $${value.price}` : undefined}
            onChange={(price) => onChange({ ...value, price })}
          />
        </div>

        <div className={css["filters__field--mileage"]}>
          <span className={css.filters__label} id="mileage-label">
            Car mileage / km
          </span>
          <div
            className={css.filters__range}
            role="group"
            aria-labelledby="mileage-label"
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder="From"
              aria-label="Mileage from"
              className={`${css.filters__input} ${css["filters__input--from"]}`}
              value={value.minMileage ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  minMileage: digitsOnly(event.target.value),
                })
              }
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="To"
              aria-label="Mileage to"
              className={`${css.filters__input} ${css["filters__input--to"]}`}
              value={value.maxMileage ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  maxMileage: digitsOnly(event.target.value),
                })
              }
            />
          </div>
        </div>

        <button type="submit" className={css.filters__search}>
          Search
        </button>
      </div>

      <button type="button" className={css.filters__clear} onClick={onReset}>
        Clear filters
      </button>
    </form>
  );
}
