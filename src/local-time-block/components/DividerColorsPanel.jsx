// components/DividerColorsPanel.jsx
import { PanelBody, DuotonePicker } from "@wordpress/components";

import blockMetadata from "../block.json";
import constants from "../constants.json";

//const DEFAULT_DUOTONE_COLORS = constants.defaultDuotoneColors;
const DUOTONE_PALETTE = constants.duotonePalette;
//const THEME_ATTRIBUTES = constants.themeAttributes;

const DEFAULT_LEFT_COLOR = blockMetadata.attributes.dividerColorLeft.default;
const DEFAULT_RIGHT_COLOR = blockMetadata.attributes.dividerColorRight.default;
// const DEFAULT_DUOTONE_COLORS = ["#0000FF", "#FFA500"];
const DEFAULT_DUOTONE_COLORS = [DEFAULT_LEFT_COLOR, DEFAULT_RIGHT_COLOR];

// const DUOTONE_PALETTE = [
//   {
//       colors: DEFAULT_DUOTONE_COLORS,
//       name: "Default",
//       slug: "default-theme-colors",
//   },
//   {
//       colors: ["#1a56d6", "#e07b20"], // #c2ddf7;
//       name: "Blue and orange",
//       slug: "blue-orange",
//   },
//   {
//       colors: ["#1a6b3c", "#c4962a"], // #b8dfc8;
//       name: "Forest and gold",
//       slug: "forest-gold",
//   },
//   {
//       colors: ["#5b2d8e", "#c0392b"], // #d4bfee;
//       name: "Plum and red",
//       slug: "plum-red",
//   },
//   {
//       colors: ["#2c4a6e", "#e05c3a"], // #b8cfe0;
//       name: "Slate and salmon",
//       slug: "slate-salmon",
//   },
//   {
//       colors: ["#8c00b7", "#fcff41"],
//       name: "Purple and yellow",
//       slug: "purple-yellow",
//   },
//   {
//       colors: ["#6e0edc", "#b7b7b7"],
//       name: "Purple and grey",
//       slug: "purple-grey",
//   },
//   { colors: ["#000097", "#ff4747"], name: "Blue and red", slug: "blue-red" },
//   {
//       colors: ["#000097", "#82c1f2"],
//       name: "Blue and light blue",
//       slug: "blue-light-blue",
//   }
// ];

export default function DividerColorsPanel({ dividerColorLeft, dividerColorRight, setAttributes }) {
  return (
    <PanelBody title="Divider Colors">
      <DuotonePicker
        duotonePalette={DUOTONE_PALETTE}
        value={
          dividerColorLeft && dividerColorRight
            ? [dividerColorLeft, dividerColorRight]
            : DEFAULT_DUOTONE_COLORS
        }
        onChange={(newValue) => {
          if (newValue === undefined || newValue === "unset") {
            setAttributes({ dividerColorLeft: "transparent", dividerColorRight: "transparent" });
          } else if (!Array.isArray(newValue) || newValue.length !== 2) {
            setAttributes({ dividerColorLeft: DEFAULT_DUOTONE_COLORS[0], dividerColorRight: DEFAULT_DUOTONE_COLORS[1] });
          } else {
            setAttributes({ dividerColorLeft: newValue[0], dividerColorRight: newValue[1] });
          }
        }}
      />
    </PanelBody>
  );
}