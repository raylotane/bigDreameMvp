import React, { useEffect, useMemo, useState } from "react";
import Toolbar from "../Toolbar";
import Canvas from "../Canvas";
import Timeline from "../Timeline";
import { Divider, Drawer, Form, InputNumber, Button, ColorPicker, Space } from "antd";
import useStore from "./useStore";

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

    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,

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

  console.log(currentFrameObjects);

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
        onionSkin={onionSkin}
        setOnionSkin={setOnionSkin}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
      />
      <Divider size="small" />

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
        onionSkin={onionSkin}
        setOnionSkin={setOnionSkin}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
      />
      <Divider size="small" />

      <Timeline
        currentFrameIndex={currentFrameIndex}
        setCurrentFrameIndex={setCurrentFrameIndex}
        frames={frames}
        addFrame={addFrame}
      />

      <Drawer
        title={selectedObject ? "编辑图形" : "对象列表"}
        closable={{ "aria-label": "Close Button" }}
        onClose={() => {
          setOpenObjectList(false);
        }}
        open={openObjectList}
        size="large"
      >
        {selectedObject ? (
          <Form layout="vertical">
            <Form.Item label="图形ID">
              <span>{selectedObject.id}</span>
            </Form.Item>
            <Form.Item label="图形类型">
              <span>{selectedObject.type}</span>
            </Form.Item>
            
            {selectedObject.type === "line" && (
              <>
                <Form.Item label="线条颜色">
                  <ColorPicker 
                    value={selectedObject.stroke || "#000"}
                    onChange={(color) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        stroke: color.toHexString()
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="线条宽度">
                  <InputNumber 
                    value={selectedObject.strokeWidth || 1} 
                    onChange={(value) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        strokeWidth: value || 1
                      });
                    }}
                  />
                </Form.Item>
              </>
            )}
            
            {selectedObject.type === "rect" && (
              <>
                <Form.Item label="X坐标">
                  <InputNumber 
                    value={selectedObject.x || 0} 
                    onChange={(value) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        x: value || 0
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="Y坐标">
                  <InputNumber 
                    value={selectedObject.y || 0}
                    onChange={(value) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        y: value || 0
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="宽度">
                  <InputNumber 
                    value={selectedObject.width || 0}
                    onChange={(value) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        width: value || 0
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="高度">
                  <InputNumber 
                    value={selectedObject.height || 0}
                    onChange={(value) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        height: value || 0
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="填充颜色">
                  <ColorPicker 
                    value={selectedObject.fill || "transparent"}
                    onChange={(color) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        fill: color.toHexString()
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="边框颜色">
                  <ColorPicker 
                    value={selectedObject.stroke || "#000"}
                    onChange={(color) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        stroke: color.toHexString()
                      });
                    }}
                  />
                </Form.Item>
              </>
            )}
            
            {selectedObject.type === "circle" && (
              <>
                <Form.Item label="X坐标（圆心）">
                  <InputNumber 
                    value={selectedObject.x || 0}
                    onChange={(value) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        x: value || 0
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="Y坐标（圆心）">
                  <InputNumber 
                    value={selectedObject.y || 0}
                    onChange={(value) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        y: value || 0
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="半径">
                  <InputNumber 
                    value={selectedObject.radius || 0}
                    min={0}
                    onChange={(value) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        radius: value || 0
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="填充颜色">
                  <ColorPicker 
                    value={selectedObject.fill || "transparent"}
                    onChange={(color) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        fill: color.toHexString()
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="边框颜色">
                  <ColorPicker 
                    value={selectedObject.stroke || "#000"}
                    onChange={(color) => {
                      updateObject(currentFrameIndex, selectedObject.id, {
                        stroke: color.toHexString()
                      });
                    }}
                  />
                </Form.Item>
              </>
            )}
            
            <Space style={{ marginTop: 16 }}>
              <Button 
                onClick={() => setSelectedObject(null)}
              >
                返回对象列表
              </Button>
              <Button 
                danger
                onClick={() => {
                  deleteObject(currentFrameIndex, selectedObject.id);
                }}
              >
                删除图形
              </Button>
            </Space>
          </Form>
        ) : (
          <div>
            {currentFrameObjects.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  padding: 12, 
                  border: '1px solid #d9d9d9', 
                  borderRadius: 4, 
                  marginBottom: 8,
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedObject(item)}
              >
                <div><strong>类型:</strong> {item.type}</div>
                <div><strong>ID:</strong> {item.id}</div>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      <div>
        <p
          onClick={() => {
            setOpenObjectList(true);
          }}
        >
          展开
        </p>
      </div>
    </div>
  );
};

export default Editor;
