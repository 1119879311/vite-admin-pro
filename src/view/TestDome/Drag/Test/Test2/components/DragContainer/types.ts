import { SortableEvent } from "react-sortablejs";

interface MultiIndices {
  multiDragElement: HTMLElement;
  index: number;
}
export interface MultiDragEvent extends SortableEvent {
  [x: string]: any;
  // @todo - add this to @types
  clones: HTMLElement[];
  oldIndicies: MultiIndices[];
  newIndicies: MultiIndices[];
  swapItem: HTMLElement | null;
}

export interface ItemInterface {
  [key: string]: any;
}

export interface CustomNode {
  parentElement: HTMLElement;
  element: HTMLElement;
  oldIndex: number;
  newIndex: number;
}

export interface Normalized<T> extends CustomNode {
  item: T;
}
