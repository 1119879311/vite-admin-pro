/**
 * 加载图片资源
 * @param url
 * @returns
 */

export function loadImage(url: string): Promise<HTMLImageElement> {
  const imgIns = new Image();
  imgIns.src = url;
  return new Promise((resolve, reject) => {
    imgIns.onload = () => {
      resolve(imgIns);
    };
    imgIns.onerror = (error) => {
      reject(error);
    };
  });
}

type IeleSize = {
  width: number;
  height: number;
};
export function getImageSize(imgIns: HTMLImageElement): IeleSize {
  const width = imgIns.width;
  const height = imgIns.height;
  return { width, height };
}

/**
 * 获取通用节点的大小
 * @param ele
 * @returns
 */
export function getElementSize(ele: Element): IeleSize {
  const sizes = ele?.getBoundingClientRect();
  const width = sizes?.width as number;
  const height = sizes?.height as number;
  return { width, height };
}
