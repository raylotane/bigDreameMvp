import React, { useEffect, useState, useCallback } from "react";
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import { message, Button, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import type { IFrame } from "../types";

loader.config({ monaco });

export interface ICodeEditor {
  width?: number | string;
  height?: number | string;
  value?: string;
  onChange?: (value: string) => void;
  currentFrame?: IFrame;
  updateFrame?: (frameIndex: number, frame: IFrame) => void;
  currentFrameIndex?: number;
}

const CodeEditor: React.FC<ICodeEditor> = (props: ICodeEditor) => {
  const {
    width,
    height = 400,
    onChange,
    currentFrame,
    updateFrame,
    currentFrameIndex,
  } = props;

  const [code, setCode] = useState("// 当前帧暂无图形");
  const [error, setError] = useState<string>("");
  const [isUserEditing, setIsUserEditing] = useState(false);

  // 生成JSX标签代码
  const generateCode = (frame: IFrame | undefined): string => {
    if (!frame || !frame.objects || frame.objects.length === 0) {
      return "// 当前帧暂无图形\n";
    }

    let code = "// 当前帧图形\n";
    code += "<>\n";

    frame.objects.forEach((obj) => {
      switch (obj.type) {
        case "line":
          code += "  <Line";
          if (obj.points) {
            code += `\n    points={[${obj.points.join(", ")}]}`;
          }
          if (obj.strokeWidth) {
            code += `\n    strokeWidth={${obj.strokeWidth}}`;
          }
          if (obj.stroke) {
            code += `\n    stroke="${obj.stroke}"`;
          }
          if (obj.id) {
            code += `\n    key="${obj.id}"`;
          }
          code += "\n  />\n";
          break;

        case "rect":
          code += "  <Rect";
          if (obj.x !== undefined) {
            code += `\n    x={${obj.x}}`;
          }
          if (obj.y !== undefined) {
            code += `\n    y={${obj.y}}`;
          }
          if (obj.width !== undefined) {
            code += `\n    width={${obj.width}}`;
          }
          if (obj.height !== undefined) {
            code += `\n    height={${obj.height}}`;
          }
          if (obj.fill) {
            code += `\n    fill="${obj.fill}"`;
          }
          if (obj.stroke) {
            code += `\n    stroke="${obj.stroke}"`;
          }
          if (obj.id) {
            code += `\n    key="${obj.id}"`;
          }
          code += "\n  />\n";
          break;

        case "circle":
          code += "  <Circle";
          if (obj.x !== undefined) {
            code += `\n    x={${obj.x}}`;
          }
          if (obj.y !== undefined) {
            code += `\n    y={${obj.y}}`;
          }
          if (obj.radius !== undefined) {
            code += `\n    radius={${obj.radius}}`;
          }
          if (obj.fill) {
            code += `\n    fill="${obj.fill}"`;
          }
          if (obj.stroke) {
            code += `\n    stroke="${obj.stroke}"`;
          }
          if (obj.id) {
            code += `\n    key="${obj.id}"`;
          }
          code += "\n  />\n";
          break;
      }
    });

    code += "</>\n";

    return code;
  };

  // 解析JSX代码并更新帧
  const parseAndApplyCode = (codeString: string) => {
    try {
      setError("");

      // 标准化代码：移除多余的空白和换行
      const normalizedCode = codeString.replace(/\s+/g, " ").trim();

      // 解析JSX标签
      const objects: any[] = [];

      // 匹配 Line, Rect, Circle 标签的正则表达式（支持多行属性）
      const lineRegex = /<Line\s+(.*?)\s*\/>/gs;
      const rectRegex = /<Rect\s+(.*?)\s*\/>/gs;
      const circleRegex = /<Circle\s+(.*?)\s*\/>/gs;

      // 解析Line标签
      let match;
      while ((match = lineRegex.exec(normalizedCode)) !== null) {
        const attrs = parseAttributes(match[1]);
        objects.push({
          id: attrs.key || generateId(),
          type: "line",
          points: attrs.points ? parseArray(attrs.points) : undefined,
          strokeWidth: attrs.strokeWidth ? parseInt(attrs.strokeWidth) : 1,
          stroke: attrs.stroke || "#000",
        });
      }

      // 解析Rect标签
      while ((match = rectRegex.exec(normalizedCode)) !== null) {
        const attrs = parseAttributes(match[1]);
        objects.push({
          id: attrs.key || generateId(),
          type: "rect",
          x: attrs.x ? parseFloat(attrs.x) : 0,
          y: attrs.y ? parseFloat(attrs.y) : 0,
          width: attrs.width ? parseFloat(attrs.width) : 100,
          height: attrs.height ? parseFloat(attrs.height) : 100,
          fill: attrs.fill || "transparent",
          stroke: attrs.stroke || "#000",
        });
      }

      // 解析Circle标签
      while ((match = circleRegex.exec(normalizedCode)) !== null) {
        const attrs = parseAttributes(match[1]);
        objects.push({
          id: attrs.key || generateId(),
          type: "circle",
          x: attrs.x ? parseFloat(attrs.x) : 0,
          y: attrs.y ? parseFloat(attrs.y) : 0,
          radius: attrs.radius ? parseFloat(attrs.radius) : 50,
          fill: attrs.fill || "transparent",
          stroke: attrs.stroke || "#000",
        });
      }

      if (objects.length === 0) {
        throw new Error(
          "未找到有效的图形标签，请使用 <Line />, <Rect />, 或 <Circle /> 格式"
        );
      }

      // 构建新的帧数据
      const newFrame: IFrame = {
        id: currentFrame?.id || generateId(),
        objects: objects,
      };

      // 更新帧数据
      if (updateFrame && currentFrameIndex !== undefined) {
        updateFrame(currentFrameIndex, newFrame);
        message.success("代码已成功应用到画布");
        // 重置编辑状态，让代码与画布保持同步
        setTimeout(() => {
          setIsUserEditing(false);
        }, 100);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "代码解析失败";
      setError(errorMessage);
      message.error(errorMessage);
    }
  };

  // 解析标签属性
  const parseAttributes = (attrString: string): Record<string, string> => {
    const attrs: Record<string, string> = {};

    // 匹配属性的正则表达式
    const attrRegex = /(\w+)=({[^}]+}|"([^"]*)")/g;
    let match;

    while ((match = attrRegex.exec(attrString)) !== null) {
      const attrName = match[1];
      const attrValue = match[2];

      // 移除大括号或引号
      const cleanValue = attrValue.replace(/[{}"]/g, "");
      attrs[attrName] = cleanValue;
    }

    return attrs;
  };

  // 解析数组格式的属性值
  const parseArray = (arrayString: string): number[] => {
    try {
      // 移除方括号并按逗号分割
      const cleanString = arrayString.replace(/[\[\]]/g, "");
      return cleanString
        .split(",")
        .map((num) => parseFloat(num.trim()))
        .filter((num) => !isNaN(num));
    } catch {
      return [];
    }
  };

  // 生成唯一ID
  const generateId = (): string => {
    return uuidv4();
  };

  // 当帧数据变化时更新代码
  useEffect(() => {
    console.log("currentFrame", currentFrame);

    if (currentFrame) {
      const generatedCode = generateCode(currentFrame);

      // 只有在用户没有主动编辑时才更新代码
      if (!isUserEditing) {
        setCode(generatedCode);
      }
    }
  }, [currentFrame?.objects, isUserEditing]);

  // 防抖解析代码
  const debouncedParse = useCallback(
    (() => {
      let timeoutId: number;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          parseAndApplyCode(value);
        }, 1000); // 1秒防抖延迟
      };
    })(),
    []
  );

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      setIsUserEditing(true); // 标记用户正在编辑
      onChange?.(value);
      // 使用防抖解析并应用代码
      debouncedParse(value);
    }
  };

  // 手动同步代码与画布
  const syncWithCanvas = useCallback(() => {
    console.log(123123);

    if (currentFrame) {
      const generatedCode = generateCode(currentFrame);
      setCode(generatedCode);
      setIsUserEditing(false);
      setError("");
      message.success("代码已与画布同步");
    }
  }, [currentFrame]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 工具栏 */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #d9d9d9",
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "12px", color: "#666" }}>
          {isUserEditing ? "正在编辑中..." : "代码与画布同步"}
        </span>
        <Space>
          {isUserEditing && (
            <Button
              size="small"
              icon={<SyncOutlined />}
              onClick={syncWithCanvas}
            >
              同步代码
            </Button>
          )}
        </Space>
      </div>

      {error && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#ff4d4f",
            color: "white",
            fontSize: "12px",
          }}
        >
          错误: {error}
        </div>
      )}

      <Editor
        value={code}
        width={width}
        height={height || "calc(100% - 80px)"}
        theme="vs-dark"
        onChange={handleCodeChange}
        defaultLanguage="typescript"
        options={{
          minimap: { enabled: false },
          fontSize: 12,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
