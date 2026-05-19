/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";
import { ComboboxControl } from "@wordpress/components";
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { useEffect, useState } from "@wordpress/element";

import type { EditProps, ThemeStyles } from "@block-root/types";

import CardColorsPanel from "@components/ui-panels/CardColorsPanel";
import Dropdown from "@components/Dropdown";
import { fetchTimeApiData } from "./utils/fetchTimeApi";
import { zoneClean } from "./utils/stringUtils";

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

export default function Edit({ attributes, setAttributes }: EditProps): JSX.Element {
  const { gradientColorLeft, gradientColorRight, cardBgColor, cardFontColor } =
    attributes;

  const blockProps = useBlockProps({ className: "local-time-container" });
  const [time, setTime] = useState<Date>(new Date());
  const [compareZone, setCompareZone] = useState<string>("GMT");
  const [compareDifference, setCompareDifference] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // prime the proxy with a cheap request on mount
    fetch(
      `${localTimeBlock.ajaxUrl}?action=api_proxy&url=https://timeapi.io/api/v1/time/current/zone?timezone=UTC`,
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
  const timeZoneIANA = zoneClean(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Timezone for comparison
  //const timeCompare = moment(time).add(compareDifference, "m").toDate();
  const timeCompare = new Date(time.getTime() + compareDifference * 60000);
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

  // const compareTimeZoneIANA = compareZone;

  const handleZoneSelect = async (zone: string) => {
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
        } as ThemeStyles}
      >
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="iconGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="card">
          <div className="card-container">
            <div className="local-time-header">
              <div className="local-time-title">Local time comparison</div>
              <div className="svg-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <g fill="url(#iconGrad)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.9426 1.25H12.0574C14.3658 1.24999 16.1748 1.24998 17.5863 1.43975C19.031 1.63399 20.1711 2.03933 21.0659 2.93414C21.9607 3.82895 22.366 4.96897 22.5603 6.41371C22.75 7.82519 22.75 9.63423 22.75 11.9426V12.0574C22.75 14.3658 22.75 16.1748 22.5603 17.5863C22.366 19.031 21.9607 20.1711 21.0659 21.0659C20.1711 21.9607 19.031 22.366 17.5863 22.5603C16.1748 22.75 14.3658 22.75 12.0574 22.75H11.9426C9.63423 22.75 7.82519 22.75 6.41371 22.5603C4.96897 22.366 3.82895 21.9607 2.93414 21.0659C2.03933 20.1711 1.63399 19.031 1.43975 17.5863C1.24998 16.1748 1.24999 14.3658 1.25 12.0574V11.9426C1.24999 9.63423 1.24998 7.82519 1.43975 6.41371C1.63399 4.96897 2.03933 3.82895 2.93414 2.93414C3.82895 2.03933 4.96897 1.63399 6.41371 1.43975C7.82519 1.24998 9.63423 1.24999 11.9426 1.25ZM6.61358 2.92637C5.33517 3.09825 4.56445 3.42514 3.9948 3.9948C3.42514 4.56445 3.09825 5.33517 2.92637 6.61358C2.75159 7.91356 2.75 9.62177 2.75 12C2.75 14.3782 2.75159 16.0864 2.92637 17.3864C3.09825 18.6648 3.42514 19.4355 3.9948 20.0052C4.56445 20.5749 5.33517 20.9018 6.61358 21.0736C7.91356 21.2484 9.62177 21.25 12 21.25C14.3782 21.25 16.0864 21.2484 17.3864 21.0736C18.6648 20.9018 19.4355 20.5749 20.0052 20.0052C20.5749 19.4355 20.9018 18.6648 21.0736 17.3864C21.2484 16.0864 21.25 14.3782 21.25 12C21.25 9.62177 21.2484 7.91356 21.0736 6.61358C20.9018 5.33517 20.5749 4.56445 20.0052 3.9948C19.4355 3.42514 18.6648 3.09825 17.3864 2.92637C16.0864 2.75159 14.3782 2.75 12 2.75C9.62177 2.75 7.91356 2.75159 6.61358 2.92637ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.8358 12.8964C11.5468 12.6074 11.4022 12.4629 11.3261 12.2791C11.25 12.0954 11.25 11.891 11.25 11.4822V8C11.25 7.58579 11.5858 7.25 12 7.25Z"/>
                  </g>
                </svg>
              </div>
            </div>
            <div className="api-data-column">
              <div className="api-data-date-container">
                <div className="clock-card">
                  <p className="clock-iana" id="clock-iana">
                    {timeZoneIANA}
                  </p>
                  <div className="accent-line"></div>
                  <p className="clock-dow" id="clock-dow">
                    {currentDOW}
                  </p>
                  <p className="clock-date" id="clock-date">
                    {currentDate}
                  </p>
                  <div className="clock-divider"></div>
                  <div className="clock-time">
                    <span className="clock-digits" id="clock-hh">
                      {currentHours}
                    </span>
                    <span className="clock-sep">:</span>
                    <span className="clock-digits" id="clock-mm">
                      {currentMinutes}
                    </span>
                    <span className="clock-sep">:</span>
                    <span className="clock-digits" id="clock-ss">
                      {currentSeconds}
                    </span>
                  </div>
                  <div className="clock-tz-row">
                    <span className="clock-tz-badge" id="clock-tz-short">
                      {timeZoneShort}
                    </span>
                    <span className="clock-tz-long" id="clock-tz-long">
                      {timeZoneLong}
                    </span>
                  </div>
                </div>
              </div>
              <div className="api-data-date-container">
                {apiError && <p className="api-error">{apiError}</p>}
                <div className="clock-card-wrapper">
                  <div className="clock-card">
                    <p className="clock-iana" id="clock-iana">
                      <Dropdown
                        dropdownOptions={timeZoneNames}
                        onOptionSelect={(zone: string) => handleZoneSelect(zone)}
                      />
                      {/* {compareTimeZoneIANA} */}
                    </p>
                    <div className="accent-line"></div>
                    <p className="clock-dow" id="clock-dow">
                      {compareDOW}
                    </p>
                    <p className="clock-date" id="clock-date">
                      {compareDate}
                    </p>
                    <div className="clock-divider"></div>
                    <div className="clock-time">
                      <span className="clock-digits" id="clock-hh">
                        {compareHours}
                      </span>
                      <span className="clock-sep">:</span>
                      <span className="clock-digits" id="clock-mm">
                        {compareMinutes}
                      </span>
                      <span className="clock-sep">:</span>
                      <span className="clock-digits" id="clock-ss">
                        {compareSeconds}
                      </span>
                    </div>
                    <div className="clock-tz-row">
                      <span className="clock-tz-badge" id="clock-tz-short">
                        {compareTimeZoneShort}
                      </span>
                      <span className="clock-tz-long" id="clock-tz-long">
                        {compareTimeZoneLong}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
