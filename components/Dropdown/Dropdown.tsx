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
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeaheadRef = useRef({ query: "", timeoutId: 0 });

  const listId = `${id}-options`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const selectedIndex = options.findIndex((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  // Keeps the highlighted option visible while arrowing through a long list.
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;

    listRef.current?.children[activeIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [isOpen, activeIndex]);

  const open = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const select = (next: string) => {
    onChange(next);
    setIsOpen(false);
  };

  const findByPrefix = (query: string, startIndex: number) => {
    for (let offset = 0; offset < options.length; offset += 1) {
      const index = (startIndex + offset) % options.length;

      if (options[index].label.toLowerCase().startsWith(query)) return index;
    }

    return -1;
  };

  // Typing jumps to a matching option: repeating one letter cycles through
  // its matches, while different letters typed quickly form a prefix.
  const handleTypeahead = (character: string) => {
    const buffer = typeaheadRef.current;
    const key = character.toLowerCase();
    const isCycling = buffer.query === key;
    const current = isOpen ? activeIndex : selectedIndex;

    buffer.query = isCycling ? key : buffer.query + key;
    window.clearTimeout(buffer.timeoutId);
    buffer.timeoutId = window.setTimeout(() => {
      buffer.query = "";
    }, 500);

    const startIndex =
      isCycling || buffer.query.length === 1 ? current + 1 : current;
    const match = findByPrefix(buffer.query, Math.max(startIndex, 0));

    if (match < 0) return;
    if (isOpen) setActiveIndex(match);
    else open(match);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) return open(selectedIndex >= 0 ? selectedIndex : 0);
        return setActiveIndex(activeIndex >= last ? 0 : activeIndex + 1);
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) return open(selectedIndex >= 0 ? selectedIndex : last);
        return setActiveIndex(activeIndex <= 0 ? last : activeIndex - 1);
      case "Home":
        if (!isOpen) return;
        event.preventDefault();
        return setActiveIndex(0);
      case "End":
        if (!isOpen) return;
        event.preventDefault();
        return setActiveIndex(last);
      case "Enter":
      case " ":
        event.preventDefault();
        if (!isOpen) return open(selectedIndex >= 0 ? selectedIndex : 0);
        if (activeIndex >= 0) select(options[activeIndex].value);
        return;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        return;
      default:
        if (
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          handleTypeahead(event.key);
        }
    }
  };

  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  // A value from a shared link can be missing from the options while it still
  // filters the cars, so it is shown instead of the placeholder.
  const buttonText = value
    ? (displayValue ?? selected?.label ?? value)
    : placeholder;

  return (
    <div className={css.dropdown} ref={wrapperRef}>
      <span className={css.dropdown__label} id={`${id}-label`}>
        {label}
      </span>

      <button
        type="button"
        id={`${id}-button`}
        className={css.dropdown__control}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-labelledby={`${id}-label ${id}-button`}
        aria-activedescendant={
          isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
        }
        onClick={() =>
          isOpen
            ? setIsOpen(false)
            : open(selectedIndex >= 0 ? selectedIndex : 0)
        }
        onKeyDown={handleKeyDown}
        onBlur={() => setIsOpen(false)}
      >
        <span className={css.dropdown__value}>{buttonText}</span>
        {isOpen ? (
          <HiChevronUp className={css.dropdown__icon} aria-hidden="true" />
        ) : (
          <HiChevronDown className={css.dropdown__icon} aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <ul
          className={css.dropdown__list}
          id={listId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          ref={listRef}
          // Keeps focus on the button, otherwise pressing the scrollbar or the
          // gap between options blurs it and the list closes mid-scroll.
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={index === selectedIndex}
              className={`${css.dropdown__option} ${
                index === selectedIndex ? css["dropdown__option--selected"] : ""
              } ${index === activeIndex ? css["dropdown__option--active"] : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
