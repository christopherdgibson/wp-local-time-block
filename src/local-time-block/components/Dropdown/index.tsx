import { useEffect, useState } from "@wordpress/element";
import type {OnChange} from "@block-root/types";
import { zoneClean } from "@block-root/utils/stringUtils";

import "./styles.css";

interface DropdownProps {
  dropdownOptions: string[];
  onOptionSelect: OnChange;
}

export default function Dropdown({ dropdownOptions, onOptionSelect }: DropdownProps): JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string>("Select time zone");
  const [search, setSearch] = useState("");
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    setSearch("");
  };

  useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
          if (e.key.length === 1) setSearch(prev => prev + e.key);
      };
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filteredOptions = dropdownOptions.filter(option =>
      option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dropdown">
      <button
        className="dropbtn"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            toggleDropdown();
            e.stopPropagation();
          }
        }}
      >
        {selectedZone} {isDropdownOpen ? <>&#11205;</> : <>&#11206;</>}
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="dropdown-backdrop"
            onClick={() => toggleDropdown()}
          />
          <ul className="dropdown-content">
            {filteredOptions.map((zone) => (
              <li
                onClickCapture={() => {
                  onOptionSelect(zone);
                  setSelectedZone(zoneClean(zone));
                  setIsDropdownOpen(false)
                }}
                // key={zone.id}
              >
                {zoneClean(zone)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
