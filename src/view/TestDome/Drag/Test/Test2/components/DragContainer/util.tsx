import { CustomNode, ItemInterface, MultiDragEvent, Normalized } from "./types";

export function getMode(evt: MultiDragEvent): "multidrag" | "swap" | "normal" {
  if (evt.oldIndicies && evt.oldIndicies.length > 0) return "multidrag";
  if (evt.swapItem) return "swap";
  return "normal";
}
export function createCustoms<T extends ItemInterface>(evt: MultiDragEvent) {
  const mode = getMode(evt);
  const parentElement = { parentElement: evt.from };
  let custom: any[] = [];
  switch (mode) {
    case "normal":
      /* eslint-disable */
      const item = {
        element: evt.item,
        newIndex: evt.newIndex!,
        oldIndex: evt.oldIndex!,
        parentElement: evt.from,
      };
      custom = [item];
      break;
    case "swap":
      const drag = {
        element: evt.item,
        oldIndex: evt.oldIndex!,
        newIndex: evt.newIndex!,
        ...parentElement,
      };
      const swap = {
        element: evt.swapItem!,
        oldIndex: evt.newIndex!,
        newIndex: evt.oldIndex!,
        ...parentElement,
      };
      custom = [drag, swap];
      break;
    case "multidrag":
      custom = evt.oldIndicies.map((curr, index) => ({
        element: curr.multiDragElement,
        oldIndex: curr.index,
        newIndex: evt.newIndicies[index].index,
        ...parentElement,
      }));
      break;
  }
  /* eslint-enable */
  return custom;
}

export function removeNode(node: HTMLElement): void {
  if (node.parentElement !== null) node.parentElement.removeChild(node);
}

export function removeNodes<T extends ItemInterface>(
  customs: Normalized<T>[]
): void {
  customs.forEach((curr) => removeNode(curr.element));
}
export function insertNodeAt(
  parent: HTMLElement,
  newChild: HTMLElement,
  index: number
): void {
  const refChild = parent.children[index] || null;
  parent.insertBefore(newChild, refChild);
}
export function insertNodes<T extends ItemInterface>(
  customs: Normalized<T>[]
): void {
  customs.forEach((curr) => {
    insertNodeAt(curr.parentElement, curr.element, curr.oldIndex);
  });
}
