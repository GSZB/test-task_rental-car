"use client";

import { useEffect, useRef, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import css from "./Dropdown.module.css";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  id: string;
  label: string;
  placeholder: string;
  options: DropdownOption[];
  value: string;
  displayValue?: string;
  onChange: (value: string) => void;
}

export default function Dropdown({
  id,
  label,
  placeholder,
  options,
  value,
  displayValue,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listId = `${id}-options`;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selected = options.find((option) => option.value === value);
  const buttonText = selected ? (displayValue ?? selected.label) : placeholder;

  const select = (next: string) => {
    onChange(next === value ? "" : next);
    setIsOpen(false);
  };

  return (
    <div className={css.dropdown} ref={wrapperRef}>
      <span className={css.dropdown__label}>{label}</span>

      <button
        type="button"
        className={css.dropdown__control}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span
          className={`${css.dropdown__value} ${
            selected ? "" : css["dropdown__value--placeholder"]
          }`}
        >
          {buttonText}
        </span>
        {isOpen ? (
          <HiChevronUp className={css.dropdown__icon} aria-hidden="true" />
        ) : (
          <HiChevronDown className={css.dropdown__icon} aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <ul className={css.dropdown__list} id={listId} role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={`${css.dropdown__option} ${
                  isSelected ? css["dropdown__option--selected"] : ""
                }`}
                onClick={() => select(option.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(option.value);
                  }
                }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
