/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
  Button,
  ButtonGroup,
  ColorPalette,
  ColorPicker,
  DuotoneSwatch,
  Modal,
  PanelBody,
  SegmentedControl,
} from "@wordpress/components";

import DividerColorsPanel from "./components/DividerColorsPanel";
import RestoreToDefaults from "./components/RestoreToDefaults";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
// import "./editor.scss";
import blockMetadata from "./block.json";
import timeZoneData from "./assets/time-zone-names.json";

const timeZoneNames = timeZoneData.timeZoneNames;

import { useRef, useEffect, useState } from "@wordpress/element";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
  const { dividerColorLeft, dividerColorRight, cardBgColor, cardFontColor } =
    attributes;
  const DEFAULT_FONT_COLOR = blockMetadata.attributes.cardFontColor.default;
  const DEFAULT_BG_COLOR = blockMetadata.attributes.cardBgColor.default;
  const DEFAULT_LEFT_COLOR = blockMetadata.attributes.dividerColorLeft.default;
  const DEFAULT_RIGHT_COLOR =
    blockMetadata.attributes.dividerColorRight.default;
  const THEME_ATTRIBUTES = {
    blue: {
      dividerColorLeft: "#1a56d6",
      dividerColorRight: "#e07b20",
      cardFontColor: "#1a56d6",
      cardBgColor: "#c2ddf7",
    },
    forest: {
      dividerColorLeft: "#1a6b3c",
      dividerColorRight: "#c4962a",
      cardFontColor: "#1a6b3c",
      cardBgColor: "#b8dfc8",
    },
    plum: {
      dividerColorLeft: "#5b2d8e",
      dividerColorRight: "#c0392b",
      cardFontColor: "#5b2d8e",
      cardBgColor: "#d4bfee",
    },
    slate: {
      dividerColorLeft: "#2c4a6e",
      dividerColorRight: "#e05c3a",
      cardFontColor: "#2c4a6e",
      cardBgColor: "#b8cfe0",
    },
  };

  const DEFAULT_DUOTONE_COLORS = [DEFAULT_LEFT_COLOR, DEFAULT_RIGHT_COLOR];
  const [duotone, setDuotone] = useState(DEFAULT_DUOTONE_COLORS);
  const DUOTONE_PALETTE = [
    {
      colors: DEFAULT_DUOTONE_COLORS,
      name: "Default",
      slug: "default-theme-colors",
    },
    {
      colors: ["#1a56d6", "#e07b20"], // #c2ddf7;
      name: "Blue and orange",
      slug: "blue-orange",
    },
    {
      colors: ["#1a6b3c", "#c4962a"], // #b8dfc8;
      name: "Forest and gold",
      slug: "forest-gold",
    },
    {
      colors: ["#5b2d8e", "#c0392b"], // #d4bfee;
      name: "Plum and red",
      slug: "plum-red",
    },
    {
      colors: ["#2c4a6e", "#e05c3a"], // #b8cfe0;
      name: "Slate and salmon",
      slug: "slate-salmon",
    },
    {
      colors: ["#8c00b7", "#fcff41"],
      name: "Purple and yellow",
      slug: "purple-yellow",
    },
    {
      colors: ["#6e0edc", "#b7b7b7"],
      name: "Purple and grey",
      slug: "purple-grey",
    },
    { colors: ["#000097", "#ff4747"], name: "Blue and red", slug: "blue-red" },
    {
      colors: ["#000097", "#82c1f2"],
      name: "Blue and light blue",
      slug: "blue-light-blue",
    },
  ];

  const [activeTab, setActiveTab] = useState("presets");
  const [activeSubTab, setActiveSubTab] = useState("background");
  const [activeTheme, setActiveTheme] = useState("default-colors");
  const [isModalOpenDefaultCard, setIsModalOpenDefaultCard] = useState(false);
  const blockProps = useBlockProps({ className: "local-time-container" });
  const containerRef = useRef();
  const apiDataRef = useRef();
  const duotoneRef = useRef(null);
  const [time, setTime] = useState(new Date());
  const [compareDifference, setCompareDifference] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Remove unused Duotone items
  // useEffect(() => {
  //   if (!duotoneRef.current) return;
  //   duotoneRef.current
  //     .querySelectorAll(".components-color-list-picker__swatch-button")
  //     .forEach((btn) => {
  //       btn.remove();
  //     });
  //   duotoneRef.current
  //     .querySelector("button.components-circular-option-picker__clear")
  //     ?.remove();
  // });

  // Date strings
  //   const currentDateTime = new Date();

  //  const timeDifference = utcOffsetMinutes*60 + time.getTimezoneOffset(); //getTimezoneOffset();

  const currentDate = time.toLocaleString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const currentDOW = time.toLocaleString("default", { weekday: "long" });
  const currentHours = time.getHours().toString().padStart(2, "0");
  const currentMinutes = time.getMinutes().toString().padStart(2, "0");
  const currentSeconds = time.getSeconds().toString().padStart(2, "0");

  // Timezone name (e.g. "Central European Summer Time")
  const timeZoneLong = time
    .toLocaleString("default", { timeZoneName: "long" })
    .split(", ")[1];

  // Timezone abbreviation/offset (e.g. "GMT+2" or "CEST")
  const timeZoneShort = time
    .toLocaleString("default", { timeZoneName: "short" })
    .split(", ")[1];

  // IANA timezone string (e.g. "Europe/Brussels")
  const timeZoneIANA = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timeCompare = moment(time).add(compareDifference, "m").toDate();
  const compareDate = timeCompare.toLocaleString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const compareDOW = timeCompare.toLocaleString("default", { weekday: "long" });
  const compareHours = timeCompare.getHours().toString().padStart(2, "0");
  const compareMinutes = timeCompare.getMinutes().toString().padStart(2, "0");
  const compareSeconds = timeCompare.getSeconds().toString().padStart(2, "0");

  // let Dropdown = ({ timeZones, setIsDropdownOpen, isDropdownOpen }) => {
  let Dropdown = () => {
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
            // Function to show the dropdown on click
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
            // <div className="absolute bottom-full translate-x-9  left-full translate-y-full rounded bg-[#20212c] w-max">
            <ul className="dropdown-content">
              {timeZoneNames.map((zone) => (
                <li
                  onClickCapture={() => {
                    console.log("li clicked: ", zone);
                    fetchTimeApiData(containerRef.current, zone);
                  }}
                  // key={zone.id}
                >
                  {zone}
                  {/* <span>{zone}</span> */}
                </li>
              ))}
            </ul>
            // </div>
          )}
        </div>
      </>
    );
  };

  // API

  function fetchTimeApiData(containerRef, selectedZone) {
    const apiDataDiv = containerRef.querySelector(".api-data");
    // if (!apiDataDiv) return;
    const apiUrl = `https://timeapi.io/api/v1/time/current/zone?timezone=${selectedZone}`;
    //const apiUrl = "https://timeapi.io/api/v1/timezone/availabletimezones";
    //const apiUrl = getApiDataUrl(date);
    console.log("apiUrl:", apiUrl);
    //const apiPath = apiUrl;
    const apiPath = `${dailyFeedBlock.ajaxUrl}?action=api_proxy&url=${apiUrl}`;
    console.log("apiPath", apiPath);

    fetchWithRetry(apiPath)
      .then((jsondta) => {
        if (jsondta) {
          console.log("jsondta:", jsondta);
          const utcOffsetMinutes = jsondta.utc_offset_seconds / 60;
          setCompareDifference(utcOffsetMinutes + time.getTimezoneOffset());
          console.log("localOffset: ", timeCompare);
          console.log("utcOffset: ", utcOffsetMinutes);
          console.log("compareDifference: ", compareDifference);
        } else {
          if (jsondta == "Too many requests.") {
            apiDataDiv.innerHTML =
              "Too many requests. Please wait at least 30 seconds.";
          } else {
            apiDataDiv.innerHTML = "No data found. Try reloading page.";
            return;
          }
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        console.log("data: ", data);
        if ("success" in data && !data.success) {
          if (
            data.data &&
            data.data.error &&
            data.data.error.includes("cURL error 28")
          ) {
            throw new Error("timeout");
          }
          throw new Error(data.message || "API returned success: false");
        }

        if (!data) {
          if (
            data[0]?.q &&
            data[0]?.q?.includes(
              "Too many requests. Obtain an auth key for unlimited access",
            )
          ) {
            console.log("Too many requests: ", data);
            return "Too many requests.";
          } else {
            console.log("data missing expected structure error:", data);
            throw new Error("API data missing expected structure.");
          }
        }
        return data;
      } catch (err) {
        if (
          attempt < retries &&
          (err.message === "timeout" || err.name === "TypeError")
        ) {
          console.log("Trying to fetch again, attempt:", attempt);
          await new Promise((res) => setTimeout(res, delay));
          // retry!
        } else {
          throw err;
        }
      }
    }
  }
  // Panels and UI

  function presetColorsPanel() {
    return (
      <ButtonGroup className="btn-grid">
        {addActiveTheme("blue", "Blue theme")}
        {addActiveTheme("forest", "Forest theme")}
        {addActiveTheme("plum", "Plum theme")}
        {addActiveTheme("slate", "Slate theme")}
      </ButtonGroup>
    );
  }

  function cardColorsPanel() {
    return (
      <PanelBody title="Card Design">
        <ButtonGroup>
          {addActiveTab("presets", "Presets")}
          {addActiveTab("custom", "Custom")}
          {addActiveTab("defaults", "Defaults")}
        </ButtonGroup>
        {activeTab === "presets" && presetColorsPanel()}
        {activeTab === "custom" && customColorsPanel()}
        {activeTab === "defaults" && (
          <RestoreToDefaults
            isModalOpenDefaultCard={isModalOpenDefaultCard}
            setIsModalOpenDefaultCard={setIsModalOpenDefaultCard}
            setAttributes={setAttributes}
          />
        )}
      </PanelBody>
    );
  }

  // function customColorsPanel() {
  //   return (
  //     <>
  //       <ButtonGroup>
  //         {addActiveSubTab("background", "Background")}
  //         {addActiveSubTab("text", "Text")}
  //         {addActiveSubTab("divider", "Divider")}
  //       </ButtonGroup>
  //       {activeSubTab === "background" && (
  //         <ColorPicker
  //           color={cardBgColor}
  //           onChangeComplete={(value) =>
  //             setAttributes({ cardBgColor: value.hex })
  //           }
  //           disableAlpha
  //         />
  //       )}
  //       {activeSubTab === "text" && (
  //         <ColorPicker
  //           color={cardFontColor}
  //           onChangeComplete={(value) =>
  //             setAttributes({ cardFontColor: value.hex })
  //           }
  //           disableAlpha
  //         />
  //       )}
  //       {activeSubTab === "divider" && <DividerColorsPanel
  //         dividerColorLeft={dividerColorLeft}
  //         dividerColorRight={dividerColorRight}
  //         setAttributes={setAttributes}
  //       />}
  //     </>
  //   );
  // }

  function customColorsPanel() {
    return (
      <>
        <ButtonGroup>
          {addActiveSubTab("background", "Background")}
          {addActiveSubTab("text", "Text")}
          {addActiveSubTab("divider", "Divider")}
        </ButtonGroup>
        {subTabContent[activeSubTab]}
      </>
    );
  }

  const subTabContent = {
    background: (
      <ColorPicker
        color={cardBgColor}
        onChangeComplete={(value) => setAttributes({ cardBgColor: value.hex })}
        disableAlpha
      />
    ),
    text: (
      <ColorPicker
        color={cardFontColor}
        onChangeComplete={(value) =>
          setAttributes({ cardFontColor: value.hex })
        }
        disableAlpha
      />
    ),
    divider: (
      <DividerColorsPanel
        dividerColorLeft={dividerColorLeft}
        dividerColorRight={dividerColorRight}
        setAttributes={setAttributes}
      />
    ),
  };

  // function restoreToDefaults() {
  //   return (
  //     <div style={{ marginTop: "1em", textAlign: "center" }}>
  //       <Button
  //         variant="primary"
  //         onClickCapture={() => setIsModalOpenDefaultCard(true)}
  //       >
  //         Restore to defaults
  //       </Button>
  //       {isModalOpenDefaultCard && (
  //         <Modal
  //           title="Restore Defaults"
  //           onRequestClose={() => setIsModalOpenDefaultCard(false)}
  //         >
  //           <p>Are you sure you want to restore the default colors?</p>
  //           <Button
  //             variant="primary"
  //             onClick={() => {
  //               setAttributes({
  //                 dividerColorLeft: DEFAULT_LEFT_COLOR,
  //                 dividerColorRight: DEFAULT_RIGHT_COLOR,
  //                 cardBgColor: DEFAULT_BG_COLOR,
  //                 cardFontColor: DEFAULT_FONT_COLOR,
  //               });
  //               setIsModalOpenDefaultCard(false);
  //             }}
  //           >
  //             Yes, restore.
  //           </Button>
  //           <Button
  //             variant="secondary"
  //             onClick={() => setIsModalOpenDefaultCard(false)}
  //             style={{ marginLeft: "1em" }}
  //           >
  //             Cancel
  //           </Button>
  //         </Modal>
  //       )}
  //     </div>
  //   );
  // }

  // function dividerColorsPanel() {
  //   return (
  //     <PanelBody ref={duotoneRef} title="Divider Colors">
  //       <>
  //         <DuotonePicker
  //           duotonePalette={DUOTONE_PALETTE}
  //           value={
  //             dividerColorLeft && dividerColorRight
  //               ? [dividerColorLeft, dividerColorRight]
  //               : DEFAULT_DUOTONE_COLORS
  //           }
  //           onChange={(newValue) => {
  //             if (newValue === undefined || newValue === "unset") {
  //               setAttributes({
  //                 dividerColorLeft: "transparent",
  //                 dividerColorRight: "transparent",
  //               });
  //             } else if (!Array.isArray(newValue) || newValue.length !== 2) {
  //               setDuotone(DEFAULT_DUOTONE_COLORS);
  //             } else {
  //               setAttributes({
  //                 dividerColorLeft: newValue[0],
  //                 dividerColorRight: newValue[1],
  //               });
  //             }
  //           }}
  //         />
  //       </>
  //     </PanelBody>
  //   );
  // }

  const addActiveTab = (tabName, tabText) => {
    return (
      <Button
        variant={activeTab === tabName ? "primary" : "secondary"}
        onClick={() => setActiveTab(tabName)}
      >
        {tabText}
      </Button>
    );
  };

  const addActiveSubTab = (tabName, tabText) => {
    return (
      <Button
        variant={activeSubTab === tabName ? "primary" : "secondary"}
        onClick={() => setActiveSubTab(tabName)}
      >
        {tabText}
      </Button>
    );
  };

  const addActiveTheme = (themeName, themeText) => {
    return (
      <button
        className={`btn-theme-color btn-${themeName}${
          activeTheme === themeName ? " selected" : ""
        }`}
        onClick={() => {
          setActiveTheme(themeName);
          setAttributes({ ...THEME_ATTRIBUTES[themeName] });
        }}
      >
        {themeText}
      </button>
    );
  };

  return (
    <>
      <InspectorControls>{cardColorsPanel()}</InspectorControls>
      <div
        {...blockProps}
        style={{
          "--base-bg": cardBgColor,
          "--font-selected": cardFontColor,
          "--accent-primary": dividerColorLeft,
          "--accent-secondary": dividerColorRight,
        }}
      >
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="iconGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        <div class="card" ref={containerRef}>
          <div className="card-container">
            <div className="local-time-header">
              <div class="local-time-title">Local time comparison</div>
              <div class="calendar-icon">
                <span className="tool-tip">Open calendar to choose date</span>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <g fill="url(#iconGrad)">
                    <path d="M24,29H8a5,5,0,0,1-5-5V10A5,5,0,0,1,8,5H24a5,5,0,0,1,5,5V24A5,5,0,0,1,24,29ZM8,7a3,3,0,0,0-3,3V24a3,3,0,0,0,3,3H24a3,3,0,0,0,3-3V10a3,3,0,0,0-3-3Z" />
                    <path d="M24,25H20a1,1,0,0,1-1-1V20a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,24,25Zm-3-2h2V21H21Z" />
                    <path d="M28,13H4a1,1,0,0,1,0-2H28a1,1,0,0,1,0,2Z" />
                    <path d="M11,9a1,1,0,0,1-1-1V4a1,1,0,0,1,2,0V8A1,1,0,0,1,11,9Z" />
                    <path d="M21,9a1,1,0,0,1-1-1V4a1,1,0,0,1,2,0V8A1,1,0,0,1,21,9Z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="api-data-column">
              <div class="api-data-date-container">
                <div class="clock-card">
                  <p class="clock-iana" id="clock-iana">
                    {timeZoneIANA}
                  </p>
                  <p class="clock-dow" id="clock-dow">
                    {currentDOW}
                  </p>
                  <p class="clock-date" id="clock-date">
                    {currentDate}
                  </p>
                  <div class="clock-divider"></div>
                  <div class="clock-time">
                    <span class="clock-digits" id="clock-hh">
                      {currentHours}
                    </span>
                    <span class="clock-sep">:</span>
                    <span class="clock-digits" id="clock-mm">
                      {currentMinutes}
                    </span>
                    <span class="clock-sep">:</span>
                    <span class="clock-digits" id="clock-ss">
                      {currentSeconds}
                    </span>
                  </div>
                  <div class="clock-tz-row">
                    <span class="clock-tz-badge" id="clock-tz-short">
                      {timeZoneShort}
                    </span>
                    <span class="clock-tz-long" id="clock-tz-long">
                      {timeZoneLong}
                    </span>
                  </div>
                </div>
              </div>
              <div class="api-data-date-container">
                <div class="clock-card">
                  <p class="clock-iana" id="clock-iana">
                    {timeZoneIANA}
                  </p>
                  <p class="clock-dow" id="clock-dow">
                    {compareDOW}
                  </p>
                  <p class="clock-date" id="clock-date">
                    {compareDate}
                  </p>
                  <div class="clock-divider"></div>
                  <div class="clock-time">
                    <span class="clock-digits" id="clock-hh">
                      {compareHours}
                    </span>
                    <span class="clock-sep">:</span>
                    <span class="clock-digits" id="clock-mm">
                      {compareMinutes}
                    </span>
                    <span class="clock-sep">:</span>
                    <span class="clock-digits" id="clock-ss">
                      {compareSeconds}
                    </span>
                  </div>
                  <div class="clock-tz-row">
                    <span class="clock-tz-badge" id="clock-tz-short">
                      {timeZoneShort}
                    </span>
                    <span class="clock-tz-long" id="clock-tz-long">
                      {timeZoneLong}
                    </span>
                  </div>
                </div>
                <Dropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
