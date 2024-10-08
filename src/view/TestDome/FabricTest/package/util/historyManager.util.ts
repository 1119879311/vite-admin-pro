interface IRecord {
  data: string;
  timestamp: number; // 记录操作时间的属性
}
type EventHandler = () => void;
/**
 * 功能实现：
 *  1. 撤销操作
 *  2. 重做操作
 *  3. 最大历史限制
 *  4. 撤销回调
 *  5. 重做回调
 */
export class HistoryManager<T extends Record<string, any>> {
  private undoStack: Array<IRecord> = []; //// 用于撤销栈

  private redoStack: Array<IRecord> = []; /// 用于重做的栈
  private maxLength: number = 50; // 历史记录的最大长度

  // 可以添加事件监听器以在撤销/重做时执行
  private onUndo: EventHandler | null = null;
  private onRedo: EventHandler | null = null;

  constructor(maxLength: number = 100) {
    this.undoStack = [];
    this.redoStack = [];
    this.maxLength = maxLength;
    this.onUndo = null;
    this.onRedo = null;
  }

  /**
   * 添加记录栈
   * @param data
   */
  add(data: T) {
    this.undoStack.push({
      data: JSON.stringify(data),
      timestamp: new Date().getTime(), // 添加记录的时间
    });

    // 清空重做栈,新的操作打断了重做流程
    this.redoStack = [];

    // 如果超过最大长度限制，移除最早的记录
    if (this.undoStack.length > this.maxLength) {
      this.undoStack.shift();
    }
  }

  /**
   * 直接出栈
   */
  pop(): T | null {
    const result = this.undoStack.pop();
    if (result) {
      return JSON.parse(result.data);
    }
    return null;
  }
  /**
   * 撤销操作
   */
  undo(): T | null {
    const result = this.undoStack.pop();
    if (result) {
      this.redoStack.push(result); // 把撤销的操作放入重做栈
      this.onUndo?.(); // 触发撤销事件
      return JSON.parse(result.data);
    }
    return null;
  }

  /**
   * 重做操作
   */
  redo(): T | null {
    const result = this.redoStack.pop();
    if (result) {
      this.undoStack.push(result); // 把重做的操作放回撤销栈
      this.onRedo?.(); // 触发重做事件
      return JSON.parse(result.data);
    }
    return null;
  }

  // 撤销多步操作
  undoSteps(steps: number = 1): Array<T> {
    const records: Array<T> = [];
    while (steps-- > 0 && this.undoStack.length > 0) {
      const data = this.undo();
      if (data !== null) {
        records.push(data);
      }
    }
    return records;
  }

  // 重做多步操作
  redoSteps(steps: number = 1): Array<T> {
    const records: Array<T> = [];
    while (steps-- > 0 && this.redoStack.length > 0) {
      const data = this.redo();
      if (data !== null) {
        records.push(data);
      }
    }
    return records;
  }

  // 设置最大记录长度
  setMaxLength(newMaxLength: number): void {
    this.maxLength = newMaxLength;
    while (this.undoStack.length > newMaxLength) {
      this.undoStack.shift();
    }
  }

  // 清空历史记录
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  setOnUndoHandler(handler: EventHandler): void {
    this.onUndo = handler;
  }

  setOnRedoHandler(handler: EventHandler): void {
    this.onRedo = handler;
  }

  // 检查是否可以执行撤销操作
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  // 检查是否可以执行重做操作
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // 获取撤销栈的记录
  getUndoStack(): IRecord[] {
    return this.undoStack;
  }

  // 获取重做栈的记录
  getRedoStack(): IRecord[] {
    return this.redoStack;
  }

  // 获取当前历史记录的总大小
  getHistorySize(): number {
    return this.undoStack.length + this.redoStack.length;
  }
}

// // 使用案例：注册事件监听器
// const history = new HistoryManager<{[key:string]:any}>();

// // 设置撤销和重做的事件处理函数
// history.setOnUndoHandler(() => {
//   console.log('An undo operation was performed.');
// });
// history.setOnRedoHandler(() => {
//   console.log('A redo operation was performed.');
// });
