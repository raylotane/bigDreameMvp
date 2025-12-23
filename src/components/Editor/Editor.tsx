import React, { useEffect, useMemo, useState } from "react";
import Toolbar from "../Toolbar";
import Canvas from "../Canvas";
import Timeline from "../Timeline";
import {
  Divider,
  Drawer,
  Form,
  InputNumber,
  Button,
  ColorPicker,
  Space,
  Splitter,
} from "antd";
import useStore from "./useStore";
import RightPan from "../RightPan";

const Editor: React.FC = () => {
  const {
    selectTool,
    setSelectTool,
    currentFrameIndex,
    setCurrentFrameIndex,
    addFrame,
    frames,

    isDrawing,
    setIsDrawing,
    startPos,
    setStartPos,
    currentShape,
    setCurrentShape,

    addObject,
    updateObject,
    deleteObject,
    updateFrame,

    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,

    onionSkin,
    setOnionSkin,

    selectedObject,
    setSelectedObject,
  } = useStore();

  const [isPlaying, setIsPlaying] = useState(false);

  const [openObjectList, setOpenObjectList] = useState(false);

  const currentFrameObjects = useMemo(() => {
    const frame = frames[currentFrameIndex];
    console.log(frame);

    return frame?.objects;
  }, [currentFrameIndex]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      const delay = 1000 / 24;
      interval = setInterval(() => {
        const nextIndex = (currentFrameIndex + 1) % frames.length;
        setCurrentFrameIndex(nextIndex);
      }, delay);
    }
    return () => clearInterval(interval as number);
  }, [isPlaying, frames.length, currentFrameIndex]);

  return (
    <div className="exitor-container flex flex-col h-screen">
      <Toolbar
        selectTool={selectTool}
        setSelectTool={setSelectTool}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onionSkin={onionSkin}
        setOnionSkin={setOnionSkin}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
      />
      <Divider size="small" />

      <Splitter
        style={{ height: "100%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel defaultSize="70%" min="50%" max="70%">
          {/* 画布 */}
          <Canvas
            selectTool={selectTool}
            setSelectTool={setSelectTool}
            frames={frames}
            currentFrameIndex={currentFrameIndex}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            startPos={startPos}
            setStartPos={setStartPos}
            currentShape={currentShape}
            setCurrentShape={setCurrentShape}
            addObject={addObject}
            fillColor={fillColor}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
            onionSkin={onionSkin}
            setOnionSkin={setOnionSkin}
            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          {/* 右侧面板 */}
          <RightPan
            frames={frames}
            currentFrameIndex={currentFrameIndex}
            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}
            updateObject={updateObject}
            deleteObject={deleteObject}
            updateFrame={updateFrame}
            // addFrame={addFrame}
          />
        </Splitter.Panel>
      </Splitter>

      <Divider size="small" />

      <Timeline
        currentFrameIndex={currentFrameIndex}
        setCurrentFrameIndex={setCurrentFrameIndex}
        frames={frames}
        addFrame={addFrame}
      />
    </div>
  );
};

export default Editor;
