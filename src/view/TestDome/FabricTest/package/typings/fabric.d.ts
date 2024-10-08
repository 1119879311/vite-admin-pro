// fabric.d.ts
import "fabric";

declare module "fabric" {
  namespace fabric {
    interface IObjectOptions {
      customTextOptions?: ICustomTextOptions;
    }

    interface ICustomTextOptions {
      text?: string;
      visible?: boolean;
      color?: string;
      fontSize?: number;
      alignment?: string;
      offsetX?: number;
      offsetY?: number;
    }

    interface Object {
      customTextOptions: ICustomTextOptions;

      calculateTextPosition(
        ctx: CanvasRenderingContext2D,
        opts: ICustomTextOptions
      ): { x: number; y: number };
    }
  }
}
