import { useState } from "@wordpress/element";

export default function Dropdown({ dropdownOptions, onOptionSelect }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* <input type="checkbox" class="dropdown-toggle" id="workDropdown" />
        <label for="workDropdown" class="dropdown-label">
          TimeZones &dtrif;
        </label> */}
      <div class="dropdown">
        <button
          className="dropbtn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              toggleDropdown();
              e.stopPropagation();
            }
          }}
        >
          Select a time zone
        </button>
        {/* <span className="block">
            <FiChevronDown color="#635FC7" size={24} />
          </span> */}

        {isDropdownOpen && (
          <>
            <div
              className="dropdown-backdrop"
              onClick={() => setIsDropdownOpen(false)}
            />
            <ul className="dropdown-content">
              {dropdownOptions.map((zone) => (
                <li
                  onClickCapture={() => {
                    console.log("li clicked: ", zone);
                    onOptionSelect(zone);
                    setIsDropdownOpen(false)
                  }}
                  // key={zone.id}
                >
                  {zone}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
