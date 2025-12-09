import React, { useEffect } from "react";
import { List, Button, Form, InputNumber, ColorPicker, Space } from "antd";
import type { IFrame, IObject, ETool } from "../types";

interface LayoutManProps {
  currentFrame: IFrame;
  selectedObject?: IObject | null;
  setSelectedObject?: (object: IObject | null) => void;
  updateObject?: (
    frameIndex: number,
    objectId: string,
    updates: Partial<IObject>
  ) => void;
  deleteObject?: (frameIndex: number, objectId: string) => void;
  currentFrameIndex?: number;
}

const LayoutMan: React.FC<LayoutManProps> = (props: LayoutManProps) => {
  const {
    currentFrame,
    selectedObject,
    setSelectedObject,
    updateObject,
    deleteObject,
    currentFrameIndex,
  } = props;

  const handleObjectClick = (object: IObject) => {
    setSelectedObject?.(object);
  };

  const handleUpdateObject = (objectId: string, updates: Partial<IObject>) => {
    if (updateObject && currentFrameIndex !== undefined) {
      updateObject(currentFrameIndex, objectId, updates);
    }
  };

  const handleDeleteObject = (objectId: string) => {
    if (deleteObject && currentFrameIndex !== undefined) {
      deleteObject(currentFrameIndex, objectId);
      setSelectedObject?.(null);
    }
  };

  const handleBackToList = () => {
    setSelectedObject?.(null);
  };

  // 如果有选中的对象，显示编辑表单
  if (selectedObject) {
    return (
      <div className="p-4">
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
                    handleUpdateObject(selectedObject.id, {
                      stroke: color.toHexString(),
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="线条宽度">
                <InputNumber
                  value={selectedObject.strokeWidth || 1}
                  onChange={(value) => {
                    handleUpdateObject(selectedObject.id, {
                      strokeWidth: value || 1,
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
                    handleUpdateObject(selectedObject.id, {
                      x: value || 0,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="Y坐标">
                <InputNumber
                  value={selectedObject.y || 0}
                  onChange={(value) => {
                    handleUpdateObject(selectedObject.id, {
                      y: value || 0,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="宽度">
                <InputNumber
                  value={selectedObject.width || 0}
                  onChange={(value) => {
                    handleUpdateObject(selectedObject.id, {
                      width: value || 0,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="高度">
                <InputNumber
                  value={selectedObject.height || 0}
                  onChange={(value) => {
                    handleUpdateObject(selectedObject.id, {
                      height: value || 0,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="填充颜色">
                <ColorPicker
                  value={selectedObject.fill || "transparent"}
                  onChange={(color) => {
                    handleUpdateObject(selectedObject.id, {
                      fill: color.toHexString(),
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="边框颜色">
                <ColorPicker
                  value={selectedObject.stroke || "#000"}
                  onChange={(color) => {
                    handleUpdateObject(selectedObject.id, {
                      stroke: color.toHexString(),
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
                    handleUpdateObject(selectedObject.id, {
                      x: value || 0,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="Y坐标（圆心）">
                <InputNumber
                  value={selectedObject.y || 0}
                  onChange={(value) => {
                    handleUpdateObject(selectedObject.id, {
                      y: value || 0,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="半径">
                <InputNumber
                  value={selectedObject.radius || 0}
                  min={0}
                  onChange={(value) => {
                    handleUpdateObject(selectedObject.id, {
                      radius: value || 0,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="填充颜色">
                <ColorPicker
                  value={selectedObject.fill || "transparent"}
                  onChange={(color) => {
                    handleUpdateObject(selectedObject.id, {
                      fill: color.toHexString(),
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="边框颜色">
                <ColorPicker
                  value={selectedObject.stroke || "#000"}
                  onChange={(color) => {
                    handleUpdateObject(selectedObject.id, {
                      stroke: color.toHexString(),
                    });
                  }}
                />
              </Form.Item>
            </>
          )}

          <Space style={{ marginTop: 16 }}>
            <Button onClick={handleBackToList}>返回对象列表</Button>
            <Button
              danger
              onClick={() => handleDeleteObject(selectedObject.id)}
            >
              删除图形
            </Button>
          </Space>
        </Form>
      </div>
    );
  }

  // 显示图形列表
  const getShapeTypeText = (type: ETool): string => {
    switch (type) {
      case "line":
        return "线条";
      case "rect":
        return "矩形";
      case "circle":
        return "圆形";
      default:
        return "未知";
    }
  };

  return (
    <div className="p-4">
      <List
        dataSource={currentFrame?.objects || []}
        renderItem={(item) => (
          <List.Item
            style={{
              cursor: "pointer",
              border: "1px solid #d9d9d9",
              borderRadius: 4,
              marginBottom: 8,
            }}
            onClick={() => handleObjectClick(item)}
          >
            <List.Item.Meta
              title={`类型: ${getShapeTypeText(item.type)}`}
              description={`ID: ${item.id}`}
            />
          </List.Item>
        )}
        locale={{ emptyText: "当前帧暂无图形" }}
      />
    </div>
  );
};

export default LayoutMan;
