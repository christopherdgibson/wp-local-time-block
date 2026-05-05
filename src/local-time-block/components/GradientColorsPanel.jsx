// components/GradientColorsPanel.jsx
import { PanelBody, DuotonePicker } from "@wordpress/components";

import constants from "../constants.json";

const DEFAULT_GRADIENT_LEFT = constants.defaultAttributes.gradientColorLeft;
const DEFAULT_GRADIENT_RIGHT = constants.defaultAttributes.gradientColorRight;
const DUOTONE_PALETTE = constants.duotonePalette;
console.log('DEFAULT_DUOTONE_COLORS: ', [DEFAULT_GRADIENT_LEFT, DEFAULT_GRADIENT_RIGHT]);
//const THEME_ATTRIBUTES = constants.themeAttributes;

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

export default function GradientColorsPanel({ gradientColorLeft, gradientColorRight, setAttributes }) {
  return (
    <PanelBody title="Gradient Colors">
      <DuotonePicker
        duotonePalette={DUOTONE_PALETTE}
        value={
          gradientColorLeft && gradientColorRight
            ? [gradientColorLeft, gradientColorRight]
            : [DEFAULT_GRADIENT_LEFT, DEFAULT_GRADIENT_LEFT]
        }
        onChange={(newValue) => {
          if (newValue === undefined || newValue === "unset") {
            setAttributes({ gradientColorLeft: "transparent", gradientColorRight: "transparent" });
          } else if (!Array.isArray(newValue) || newValue.length !== 2) {
            setAttributes({ gradientColorLeft: DEFAULT_GRADIENT_LEFT, gradientColorRight: DEFAULT_GRADIENT_RIGHT });
          } else {
            setAttributes({ gradientColorLeft: newValue[0], gradientColorRight: newValue[1] });
          }
        }}
      />
    </PanelBody>
  );
}