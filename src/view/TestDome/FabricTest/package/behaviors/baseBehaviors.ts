import { Mark } from "..";
import { EventName } from "../types";

export class BaseBehavior {
  enabled: boolean = true;
  priority: number = 1;
  markInstance: Mark;
  option: Record<string, any>;
  eventHandlerMap: Record<EventName | string, string> = {};
  constructor(markInstance, option = {}) {
    this.markInstance = markInstance;
    this.option = option;
  }

  /**
   * 启禁用行为
   * @param value
   */
  setEnable(value: boolean) {
    this.enabled = value;
  }

  /**
   * 设置优先级
   * @param value
   */
  setPriority(value: number) {
    this.priority = value;
  }
}
