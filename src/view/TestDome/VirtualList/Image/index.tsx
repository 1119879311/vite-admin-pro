import { useEffect, useMemo, useRef, useState } from "react";
import "./index.less";

const loadingJsx = (
  <svg
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="5495"
    width="40"
    height="40"
  >
    <path
      d="M463.99488 32.01024m48.00512 0l0 0q48.00512 0 48.00512 48.00512l0 159.98976q0 48.00512-48.00512 48.00512l0 0q-48.00512 0-48.00512-48.00512l0-159.98976q0-48.00512 48.00512-48.00512Z"
      fill="#424242"
      p-id="5496"
    ></path>
    <path
      d="M783.765799 113.449535m36.774055 30.857096l0 0q36.774055 30.857096 5.916959 67.631152l-102.839435 122.559267q-30.857096 36.774055-67.631152 5.916959l0 0q-36.774055-30.857096-5.916959-67.631152l102.839435-122.559267q30.857096-36.774055 67.631152-5.916959Z"
      fill="#D8D8D8"
      p-id="5497"
    ></path>
    <path
      d="M976.367427 381.384588m8.336002 47.275814l0 0q8.336002 47.275814-38.939813 55.611816l-157.559156 27.78193q-47.275814 8.336002-55.611816-38.939812l0 0q-8.336002-47.275814 38.939813-55.611816l157.559156-27.781931q47.275814-8.336002 55.611816 38.939813Z"
      fill="#CFCFCF"
      p-id="5498"
    ></path>
    <path
      d="M951.698612 710.431467m-24.00256 41.573653l0 0q-24.00256 41.573653-65.576214 17.571093l-138.555196-79.99488q-41.573653-24.00256-17.571094-65.576213l0 0q24.00256-41.573653 65.576214-17.571093l138.555196 79.99488q41.573653 24.00256 17.571094 65.576213Z"
      fill="#C1C1C1"
      p-id="5499"
    ></path>
    <path
      d="M721.25083 946.641422m-45.110057 16.418718l0 0q-45.110057 16.418718-61.528775-28.691339l-54.71972-150.341197q-16.418718-45.110057 28.691339-61.528775l0 0q45.110057-16.418718 61.528775 28.691339l54.71972 150.341197q16.418718 45.110057-28.691339 61.528775Z"
      fill="#ADADAD"
      p-id="5500"
    ></path>
    <path
      d="M392.950039 979.471853m-45.110057-16.418718l0 0q-45.110057-16.418718-28.691339-61.528775l54.71972-150.341196q16.418718-45.110057 61.528775-28.691339l0 0q45.110057 16.418718 28.691339 61.528775l-54.71972 150.341196q-16.418718 45.110057-61.528775 28.691339Z"
      fill="#878787"
      p-id="5501"
    ></path>
    <path
      d="M120.306508 793.578773m-24.00256-41.573653l0 0q-24.00256-41.573653 17.571094-65.576213l138.555196-79.99488q41.573653-24.00256 65.576214 17.571093l0 0q24.00256 41.573653-17.571094 65.576213l-138.555196 79.99488q-41.573653 24.00256-65.576214-17.571093Z"
      fill="#747474"
      p-id="5502"
    ></path>
    <path
      d="M30.964126 475.916048m8.336002-47.275815l0 0q8.336002-47.275814 55.611816-38.939812l157.559156 27.78193q47.275814 8.336002 38.939812 55.611816l0 0q-8.336002 47.275814-55.611816 38.939812l-157.559156-27.78193q-47.275814-8.336002-38.939812-55.611816Z"
      fill="#646464"
      p-id="5503"
    ></path>
    <path
      d="M166.686091 175.163728m36.774055-30.857097l0 0q36.774055-30.857096 67.631152 5.916959l102.839435 122.559267q30.857096 36.774055-5.916959 67.631152l0 0q-36.774055 30.857096-67.631152-5.916959l-102.839435-122.559267q-30.857096-36.774055 5.916959-67.631152Z"
      fill="#535353"
      p-id="5504"
    ></path>
  </svg>
);
const errorJsx = (
  <svg
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="14326"
    width="40"
    height="40"
  >
    <path
      d="M512 768H128V576l192-192 192 192 128-128c68.288 48.448 110.912 69.76 128 64 46.656 0 90.368 12.48 128 34.24V192H64v640h448v-64z m448-169.344A256 256 0 1 1 546.24 896H0V128h960v470.656zM768 384a64 64 0 1 1 0-128 64 64 0 0 1 0 128z m0 576a192 192 0 1 0 0-384 192 192 0 0 0 0 384z m-32-288a32 32 0 1 1 64 0V768a32 32 0 1 1-64 0v-96zM768 896a32 32 0 1 1 0-64 32 32 0 0 1 0 64z"
      fill="#f83838"
      p-id="14327"
    ></path>
  </svg>
);

function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = function () {
      resolve(this);
    };
    image.onerror = function (error) {
      reject({ type: "error" });
    };
  });
}

interface IImageProps {
  src: string;
  id?: string | number;
  delay?: number;
  successCallback?: (...args: any) => void;
  getChacheImage?: (chacheId: string | number) => HTMLImageElement | undefined;
  [key: string]: any;
}

const ImageStatus = {
  Loading: 1,
  Success: 2,
  Error: 3,
};

const CustomImage: React.FC<IImageProps> = ({
  src = "",
  id = "",
  delay = 300,
  successCallback,
  getChacheImage,
}) => {
  const [status, setSatus] = useState<number | null>();
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      const ref = divRef.current;
      const insertImage = (img: HTMLImageElement) => {
        let childNode = ref.childNodes[0];
        if (childNode && childNode.nodeType) {
          ref.replaceChild(img, childNode);
        } else {
          ref.appendChild(img);
        }
        setSatus(null);
        return;
      };
      let chache = getChacheImage?.(id);
      if (chache) {
        return insertImage(chache);
      }

      setSatus(ImageStatus.Loading);

      let timer = setTimeout(async () => {
        const result = await loadImage(src).catch(() => null);
        if (!result) {
          return setSatus(ImageStatus.Error);
        }
        successCallback?.({ id, image: result });
        insertImage(result as HTMLImageElement);
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  const renderLoadIng = useMemo(() => {
    if (status !== ImageStatus.Loading) {
      return null;
    }
    return <div className="Image-loading">{loadingJsx}</div>;
  }, [status]);

  const renderError = useMemo(() => {
    if (status !== ImageStatus.Error) {
      return null;
    }
    return <div className="Image-error">{errorJsx}</div>;
  }, [status]);

  return (
    <div className="Image-warp">
      <div className="Image-container" ref={divRef}></div>
      {renderLoadIng}
      {renderError}
    </div>
  );
};

export default CustomImage;
