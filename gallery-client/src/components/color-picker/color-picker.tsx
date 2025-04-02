import React, { CSSProperties, FC, useEffect, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { Properties } from "../../models/Properties";
import { updateProperties } from "../../services/catalog-service";

export interface ColorPickerButtonsProps {
  setBgColors: React.Dispatch<
    React.SetStateAction<{
      lower: string;
      higher: string;
      title: string;
    }>
  >;
  properties: Properties;
}

const ColorPickerButtons: FC<ColorPickerButtonsProps> = ({
  setBgColors,
  properties,
}) => {
  const [lowerColor, setlowerColor] = useColor(properties.bgColors.lower);
  const [higherColor, sethigherColor] = useColor(properties.bgColors.higher);
  const [titleColor, setTitleColor] = useColor(properties.bgColors.title);
  const [showPicker, setshowPicker] = useState({
    lower: false,
    higher: false,
    title: false,
  });
  const [saveText, setSaveText] = useState("שמירת צבעים");

  const colorPickerButtonStyle: CSSProperties = {
    zIndex: 100,
    fontFamily: "AlphaRegular",
    height: "50px",
    width: "50px",
    border: "none",
    borderRadius: "50%",
    color: "white",
    fontWeight: 900,
    fontSize: "20px",
  };

  const contentStyle: CSSProperties = {
    zIndex: 100,
    textAlign: "center",
    fontSize: "10px",
    position: "fixed",
    bottom: 120,
    left: 10,
    width: "99px",
  };

  useEffect(() => {
    setBgColors((bgColors) => ({ ...bgColors, lower: lowerColor.hex }));
  }, [lowerColor]);

  useEffect(() => {
    setBgColors((bgColors) => ({ ...bgColors, higher: higherColor.hex }));
  }, [higherColor]);

  useEffect(() => {
    setBgColors((bgColors) => ({ ...bgColors, title: titleColor.hex }));
  }, [titleColor]);

  const saveColors = async () => {
    setSaveText("✔");
    await updateProperties({
      Id: properties.Id,
      askBeforeItemRemoval: properties.askBeforeItemRemoval,
      bgColors: {
        lower: lowerColor.hex,
        higher: higherColor.hex,
        title: titleColor.hex,
      },
    });
    setTimeout(() => {
      setSaveText("שמירת צבעים");
    }, 1000);
  };

  const pickerContainer = {
    width: '450px',
  };

  return (
    <div style={contentStyle}>
      {showPicker.higher ? (
        <div style={pickerContainer}>
          <ColorPicker
            height={228}
            color={higherColor}
            onChange={sethigherColor}
            hideAlpha
          />
        </div>
      ) : null}
      <button
        style={{ ...colorPickerButtonStyle, backgroundColor: higherColor.hex }}
        onClick={() =>
          setshowPicker({
            lower: false,
            higher: !showPicker.higher,
            title: false,
          })
        }
      ></button>
      {showPicker.lower ? (
        <div style={pickerContainer}>
          <ColorPicker
            height={228}
            color={lowerColor}
            onChange={setlowerColor}
            hideAlpha
          />
        </div>
      ) : null}
      <button
        style={{ ...colorPickerButtonStyle, backgroundColor: lowerColor.hex }}
        onClick={() =>
          setshowPicker({
            lower: !showPicker.lower,
            higher: false,
            title: false,
          })
        }
      ></button>
      {showPicker.title ? (
        <div style={pickerContainer}>
          <ColorPicker
            height={228}
            color={titleColor}
            onChange={setTitleColor}
            hideAlpha
          />
        </div>
      ) : null}
      <button
        style={{ ...colorPickerButtonStyle, backgroundColor: titleColor.hex }}
        onClick={() =>
          setshowPicker({
            lower: false,
            higher: false,
            title: !showPicker.title,
          })
        }
      ></button>
      <button
        style={{
          ...colorPickerButtonStyle,
          backgroundColor: "#FF9900",
          height: "100px",
          width: "100px",
        }}
        onClick={saveColors}
      >
        {saveText}
      </button>
    </div>
  );
};

export default ColorPickerButtons;
