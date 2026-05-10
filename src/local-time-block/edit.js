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
import { useEffect, useState } from "@wordpress/element";

import CardColorsPanel from "@components/ui-panels/CardColorsPanel";
import Dropdown from "@components/Dropdown";
import { fetchTimeApiData } from "./assets/js/fetchTimeApi.js";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
// import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

import timeZoneData from "./assets/time-zone-names.json";
const timeZoneNames = timeZoneData.timeZoneNames;

export default function Edit({ attributes, setAttributes }) {
  const { gradientColorLeft, gradientColorRight, cardBgColor, cardFontColor } =
    attributes;

  const blockProps = useBlockProps({ className: "local-time-container" });
  const [time, setTime] = useState(new Date());
  const [compareZone, setCompareZone] = useState("GMT");
  const [compareDifference, setCompareDifference] = useState(0);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // prime the proxy with a cheap request on mount
    fetch(
      `${dailyFeedBlock.ajaxUrl}?action=api_proxy&url=https://timeapi.io/api/v1/time/current/zone?timezone=UTC`,
    ).catch(() => {}); // silently discard result
  }, []);

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
  const timeZoneLong = new Intl.DateTimeFormat("default", {
    timeZoneName: "long",
  })
    .formatToParts(time)
    .find((p) => p.type === "timeZoneName")?.value;

  // Timezone abbreviation/offset (e.g. "GMT+2" or "CEST")
  const timeZoneShort = new Intl.DateTimeFormat("default", {
    timeZoneName: "short",
  })
    .formatToParts(time)
    .find((p) => p.type === "timeZoneName")?.value;

  // IANA timezone string (e.g. "Europe/Brussels")
  const timeZoneIANA = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Timezone for comparison
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

  const compareTimeZoneLong = compareZone
    ? new Intl.DateTimeFormat("default", {
        timeZoneName: "long",
        timeZone: compareZone,
      })
        .formatToParts(time)
        .find((p) => p.type === "timeZoneName")?.value
    : null;

  const compareTimeZoneShort = compareZone
    ? new Intl.DateTimeFormat("default", {
        timeZoneName: "short",
        timeZone: compareZone,
      })
        .formatToParts(time)
        .find((p) => p.type === "timeZoneName")?.value
    : null;

  const compareTimeZoneIANA = compareZone;

  const handleZoneSelect = async (zone) => {
    setApiError(null);
    setCompareZone(zone);
    const result = await fetchTimeApiData(zone);
    if (result.success) {
      setCompareDifference(result.value + time.getTimezoneOffset());
    } else {
      setApiError(result.error);
    }
  };

  return (
    <>
      <InspectorControls>
        {
          <CardColorsPanel
            attributes={attributes}
            setAttributes={setAttributes}
          />
        }
      </InspectorControls>
      <div
        {...blockProps}
        style={{
          "--base-bg": cardBgColor,
          "--font-selected": cardFontColor,
          "--accent-primary": gradientColorLeft,
          "--accent-secondary": gradientColorRight,
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
        <div class="card">
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
                  <div class="accent-line"></div>
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
                {apiError && <p className="api-error">{apiError}</p>}
                <div class="clock-card-wrapper">
                  <div class="clock-card">
                    <p class="clock-iana" id="clock-iana">
                      {compareTimeZoneIANA}
                    </p>
                    <div class="accent-line"></div>
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
                        {compareTimeZoneShort}
                      </span>
                      <span class="clock-tz-long" id="clock-tz-long">
                        {compareTimeZoneLong}
                      </span>
                    </div>
                  </div>
                </div>
                <Dropdown
                  dropdownOptions={timeZoneNames}
                  onOptionSelect={(zone) => handleZoneSelect(zone)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
