import { Tabs, type TabsProps } from "antd";
import React from "react";
import type { IFrame, IObject } from "../types";
import LayoutMan from "./LayoutMan";
import CodeEditor from "./CodeEditor";

export interface LeftPanProps {
  frames: IFrame[];
  currentFrameIndex: number;
  selectedObject?: IObject | null;
  setSelectedObject?: (object: IObject | null) => void;
  updateObject?: (
    frameIndex: number,
    objectId: string,
    updates: Partial<IObject>
  ) => void;
  deleteObject?: (frameIndex: number, objectId: string) => void;
  updateFrame?: (frameIndex: number, frame: IFrame) => void;
}

const LeftPan: React.FC<LeftPanProps> = (props: LeftPanProps) => {
  const {
    frames,
    currentFrameIndex,
    selectedObject,
    setSelectedObject,
    updateObject,
    deleteObject,
    updateFrame,
  } = props;

  const currentFrame = frames[currentFrameIndex];

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "图层管理",
      children: (
        <LayoutMan
          currentFrame={currentFrame}
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          updateObject={updateObject}
          deleteObject={deleteObject}
          currentFrameIndex={currentFrameIndex}
        />
      ),
    },
    {
      key: "2",
      label: "代码编辑器",
      children: (
        <CodeEditor 
          width={"100%"} 
          currentFrame={currentFrame}
          updateFrame={updateFrame}
          currentFrameIndex={currentFrameIndex}
        />
      ),
    },
    {
      key: "3",
      label: "AI Agent",
      children: "Content of Tab Pane 3",
    },
  ];
  return (
    <div className="bg-white h-full p-2">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default LeftPan;
