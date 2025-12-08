import { Button, ColorPicker, Radio, Space, Switch } from "antd";
import React from "react";
import { ETool, type ICommonProps } from "./types";

interface ToolbarProps extends ICommonProps {
  fillColor: string;
  setFillColor: (color: string) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  onionSkin: boolean;
  setOnionSkin: (onionSkin: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  isPlaying: boolean;
}

const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
  const {
    selectTool,
    setSelectTool,
    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,
    onionSkin,
    setOnionSkin,
    setIsPlaying,
    isPlaying
  } = props;

  return (
    <div className="h-[40px] shrink-0 flex">
      <Space>
        <Radio.Group
          value={selectTool}
          onChange={(e) => setSelectTool(e.target.value)}
        >
          <Radio.Button value={ETool.LINE}>{ETool.LINE}</Radio.Button>
          <Radio.Button value={ETool.RECT}>{ETool.RECT}</Radio.Button>
          <Radio.Button value={ETool.CIRCLE}>{ETool.CIRCLE}</Radio.Button>
        </Radio.Group>
        <Space>
          <ColorPicker
            value={fillColor}
            allowClear
            onChange={(c) => {
              setFillColor(c.toHexString());
            }}
          />
          <ColorPicker
            value={strokeColor}
            onChange={(c) => {
              setStrokeColor(c.toHexString());
            }}
            allowClear
          >
            <div
              className="w-[30px] h-[30px] bg-white"
              style={{
                border: `5px solid ${strokeColor}`,
              }}
            ></div>
          </ColorPicker>
        </Space>
        <Switch value={onionSkin} onChange={setOnionSkin} />
        <Switch value={isPlaying} onChange={setIsPlaying} />
      </Space>
    </div>
  );
};

export default Toolbar;
