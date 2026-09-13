"use client";

import { useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import { MILEAGE_MAX_DIGITS, toMileage } from "@/lib/filters";
import type { CarFilterOptions, CarFilters } from "@/types/car";
import css from "./Filters.module.css";

interface FiltersProps {
  initialValue: CarFilters;
  options?: CarFilterOptions;
  onSearch: (filters: CarFilters) => void;
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

export default function Filters({
  initialValue,
  options,
  onSearch,
  onReset,
}: FiltersProps) {
  const [value, setValue] = useState(initialValue);
  const [isRangeErrorShown, setIsRangeErrorShown] = useState(false);

  const brandOptions = (options?.brands ?? []).map((brand) => ({
    value: brand,
    label: brand,
  }));

  const isRangeInvalid = Boolean(
    value.minMileage &&
    value.maxMileage &&
    Number(value.minMileage) > Number(value.maxMileage),
  );
  const showRangeError = isRangeErrorShown && isRangeInvalid;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRangeInvalid) {
      setIsRangeErrorShown(true);
      return;
    }

    setIsRangeErrorShown(false);
    onSearch(value);
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
            onChange={(brand) => setValue({ ...value, brand })}
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
            onChange={(price) => setValue({ ...value, price })}
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
              maxLength={MILEAGE_MAX_DIGITS}
              placeholder="From"
              aria-label="Mileage from"
              aria-invalid={showRangeError}
              aria-describedby={showRangeError ? "mileage-error" : undefined}
              className={`${css.filters__input} ${css["filters__input--from"]} ${
                showRangeError ? css["filters__input--invalid"] : ""
              }`}
              value={value.minMileage ?? ""}
              onChange={(event) =>
                setValue({
                  ...value,
                  minMileage: toMileage(event.target.value),
                })
              }
            />
            <input
              type="text"
              inputMode="numeric"
              maxLength={MILEAGE_MAX_DIGITS}
              placeholder="To"
              aria-label="Mileage to"
              aria-invalid={showRangeError}
              aria-describedby={showRangeError ? "mileage-error" : undefined}
              className={`${css.filters__input} ${css["filters__input--to"]} ${
                showRangeError ? css["filters__input--invalid"] : ""
              }`}
              value={value.maxMileage ?? ""}
              onChange={(event) =>
                setValue({
                  ...value,
                  maxMileage: toMileage(event.target.value),
                })
              }
            />
          </div>
          {showRangeError && (
            <p className={css.filters__error} id="mileage-error" role="alert">
              &quot;From&quot; cannot be greater than &quot;To&quot;
            </p>
          )}
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
