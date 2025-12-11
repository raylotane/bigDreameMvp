import { SyncOutlined } from "@ant-design/icons";
import type { BubbleListProps } from "@ant-design/x";
import { Bubble, Sender } from "@ant-design/x";
import XMarkdown from "@ant-design/x-markdown";
import {
  OpenAIChatProvider,
  useXChat,
  type XModelParams,
  type XModelResponse,
  XRequest,
} from "@ant-design/x-sdk";
import { Button, Flex, Tooltip } from "antd";
import React from "react";

export interface IChatPanProps {
  addFrame: () => void;
}

const role: BubbleListProps["role"] = {
  assistant: {
    placement: "start",
    contentRender(content: string) {
      // Double '\n' in a mark will causes markdown parse as a new paragraph, so we need to replace it with a single '\n'
      const newContent = content.replace("/\n\n/g", "<br/><br/>");
      return <XMarkdown content={newContent} />;
    },
  },
  user: {
    placement: "end",
  },
};

const ChatPan: React.FC<IChatPanProps> = (props) => {
  // const { addFrame } = props;

  const [content, setContent] = React.useState("");
  const [provider] = React.useState(
    new OpenAIChatProvider({
      request: XRequest<XModelParams, XModelResponse>(
        "https://apis.iflow.cn/v1/chat/completions",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
          manual: true,
          params: {
            model: "Qwen3-Max",
            stream: true,
            tools: [
              {
                type: "function",
                function: {
                  description: "添加一帧",
                  name: "addFrame",
                  parameters: {},
                  strict: false,
                },
              },
            ],
          },
        }
      ),
    })
  );
  // Chat messages
  const {
    onRequest,
    messages,
    // setMessages,
    // setMessage,
    isRequesting,
    abort,
    onReload,
  } = useXChat({
    provider,
    defaultMessages: [
      {
        id: "system",
        message: {
          role: "system",
          content:
            "你是一个帮助用户设计二维帧动画的助手，你将帮助用户设计动画，并提供代码，用户可以直接复制代码到项目中使用。",
        },
        status: "success",
      },
    ],
    requestFallback: (_, { error }) => {
      if (error.name === "AbortError") {
        return {
          content: "Request is aborted",
          role: "assistant",
        };
      }
      return {
        content: error.message || "Request failed, please try again!",
        role: "assistant",
      };
    },
    requestPlaceholder: () => {
      return {
        content: "Please wait...",
        role: "assistant",
      };
    },
  });

  const chatMessages = messages.filter((m) => m.message.role !== "system");

  return (
    <Flex vertical gap="middle">
      <Bubble.List
        style={{ height: 500 }}
        role={role}
        items={chatMessages.map(({ id, message, status }) => {
          return {
            key: id,
            role: message.role,
            status: status,
            loading: status === "loading",
            content: message.content,
            components:
              message.role === "assistant"
                ? {
                    footer: (
                      <Tooltip title="Retry">
                        <Button
                          size="small"
                          type="text"
                          icon={<SyncOutlined />}
                          style={{ marginInlineEnd: "auto" }}
                          onClick={() =>
                            onReload(id, {
                              userAction: "retry",
                            })
                          }
                        />
                      </Tooltip>
                    ),
                  }
                : {},
          };
        })}
      />
      <Sender
        loading={isRequesting}
        value={content}
        onCancel={() => {
          abort();
        }}
        onChange={setContent}
        onSubmit={(nextContent) => {
          onRequest({
            messages: [
              {
                role: "user",
                content: nextContent,
              },
            ],
            frequency_penalty: 0,
            max_tokens: 1024,
            thinking: {
              type: "disabled",
            },
          });
          setContent("");
        }}
      />
    </Flex>
  );
};

export default ChatPan;
