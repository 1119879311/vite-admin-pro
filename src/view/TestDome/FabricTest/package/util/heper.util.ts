/**
 * 不为null, undefind
 * @param data
 * @returns
 */
export const isNotNulOrUndefined = (data: any) => {
  return !(data === undefined || data === null);
};

export const isNotEmptyObject = (value: unknown) => {
  try {
    return (
      isNotNulOrUndefined(value) &&
      Object.prototype.toString.call(value) == "[object Object]" &&
      Object.keys(value as Object).length
    );
  } catch (error) {
    return false;
  }
};
export function addUid(length: number = 8): number {
  let id = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return Number(id);
}

export function isNotEmty(value: unknown): boolean {
  return value !== "" && isNotNulOrUndefined(value);
}

export function sleep(ms = 0) {
  return new Promise((resovle) => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      resovle(true);
    }, ms);
  });
}

export const isString = (value: unknown) => {
  return value && typeof value === "string";
};

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: number | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timeout === null) {
      timeout = window.setTimeout(() => {
        timeout = null;
        func.apply(this, args);
      }, wait) as unknown as number;
    }
  } as T;
}
