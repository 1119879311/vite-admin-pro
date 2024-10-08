import React, { useCallback, useEffect, useRef } from "react";
import { Canvas } from "fabric/fabric-impl";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import img1 from "../images/1.jpg";
import { Mark } from "../package";
import { Button, Modal, Space, message } from "antd";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  RetweetOutlined,
  DragOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { actionMode } from "../package/types";
import { addUid } from "../package/util/heper.util";
import { EventMouseRightKey } from "../package/constants";
import { ClipMark, RectMark } from "../package/marks";
import { MenuPlugin } from "../package/plugins/menu.plugin";

const App: React.FC<{}> = () => {
  const canvasWarpRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasIns = useRef<Canvas>();
  const markIns = useRef<Mark>();

  const resizeCallback = useCallback(
    (entry) => {
      canvasIns.current?.setWidth(entry.contentRect?.width as number);
      canvasIns.current?.setHeight(entry.contentRect?.height as number);
    },
    [canvasIns]
  );

  useResizeObserver(canvasWarpRef, resizeCallback);
  useEffect(() => {
    markIns.current = new Mark(
      canvasRef.current as HTMLCanvasElement,
      canvasWarpRef.current as HTMLElement,
      {
        stopContextMenu: true,
      },
      {
        behaviors: [
          "ZoomInBehavior",
          "DragBehavior",
          {
            name: "DrawBehavior",
            option: {
              isMouseRightSave: true,
              beforeRenderHooK: async (option, fabricEvent) => {
                console.log("this", this, fabricEvent);
                // return
              },
            },
          },
        ],
        marks: [
          ClipMark.shapeType,
          { name: RectMark.shapeType, option: { markType: "Rect" } },
        ],
        plugins: [
          new MenuPlugin({
            context: (data) => {
              if (data.target?.get("_static_")) {
                return "";
              }
              return `<div class="meun-box">
              <div class="meun-box-title"><span>菜单</span><span class="close" data-id="close">x</span></div>
              <div class="meun-box-item" data-id="edit">编辑</div>
              <div class="meun-box-item" data-id="delete">删除</div>
            </div>`;
            },
            // clickCallback: (e, item, colse) => {},
            actions: {
              edit: (opt) => {
                console.log("edit", opt);
                if (opt.selectTarget) {
                  opt.instance.setActionMode(actionMode.DRAW);
                  opt.instance.selectActive({
                    id: opt.selectTarget?.id,
                  });

                  opt.onClose();
                }
              },
              delete: (opt) => {
                console.log("opt", opt);
                opt.instance.delete({ target: opt.selectTarget?.target });
                opt.onClose();
              },
            },
          }),
        ],
      }
    );

    canvasIns.current = markIns.current.canvasIns;

    // markIns.current.eventManager.on(EventMouseRightKey, (opton) => {
    //   console.log("右键", opton);
    // });

    markIns.current.initImage(img1).then((res) => {
      if (!res) return;
      markIns.current?.data([
        {
          top: 0,
          left: 0,
          width: 200,
          height: 200,
          id: addUid(),
          markType: "Rect",
          stroke: "red",
          customTextOptions: {
            text: "Updated Text",
            alignment: "left-top",
            visible: true,
            offsetX: 5,
            offsetY: 5,
          },
        },
        // {
        //   markType: "Cliper",
        //   id: addUid(),
        //   top: -100,
        //   left: -100, //markIns.current.imageWidth / 2,
        //   width: markIns.current.imageWidth / 2,
        //   height: markIns.current.imageHeight / 2,
        //   isClipShape: true,
        //   data: [
        //     {
        //       id: addUid(),
        //       top: 0,
        //       left: 0,
        //       width: 400,
        //       height: 600,
        //       markType: "Rect",
        //     },
        //     {
        //       id: addUid(),
        //       top: 300,
        //       left: 200,
        //       width: 400,
        //       height: 200,
        //       fill: "red",
        //       markType: "Rect",
        //     },
        //   ],
        // },
      ]);
    });

    return () => {};
  }, []);

  return (
    <div className="height-full custom-canvas-warp">
      <div className="height-full tool-left">
        工具
        <Space direction="vertical">
          <Button
            icon={<FormOutlined />}
            onClick={() => {
              markIns.current?.setActionMode(actionMode.DRAW);
              markIns.current?.setDrawOption({ markType: "Rect" });
            }}
          ></Button>
          <Button
            icon={<DragOutlined />}
            onClick={() => {
              markIns.current?.setActionMode(actionMode.DRAG);
            }}
          ></Button>
          <Button
            onClick={() => {
              markIns.current?.setActionMode(actionMode.DISABLE);
            }}
          >
            禁用
          </Button>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              markIns.current?.upZoom();
            }}
          ></Button>
          <Button
            icon={<MinusCircleOutlined />}
            onClick={() => {
              markIns.current?.downZoom();
            }}
          ></Button>
          <Button
            icon={<RetweetOutlined />}
            onClick={() => {
              markIns.current?.setZoom(markIns.current.initZoom);
            }}
          ></Button>
        </Space>
      </div>
      <div className="height-full canvas-bg-2 flex-auto" ref={canvasWarpRef}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default React.memo(App);
