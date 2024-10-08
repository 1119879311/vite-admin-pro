import { Mark } from "..";
import { isNotEmptyObject, isString } from "../util";

/**
 * 插件标注管理中心
 */
export class MarkPluginsManager {
  static markPluginMap = new Map();
  static add(name, markPlugin) {
    if (!this.markPluginMap.has(name) && markPlugin) {
      this.markPluginMap.set(name, markPlugin);
    }
  }

  markPlugins = new Map();
  markInstance!: Mark;
  constructor(plugins, markInstance) {
    this.markInstance = markInstance;
    this.addMarkPlugins(plugins || []);
  }

  /**
   * 单个注册插件实例
   * @param name
   * @param option
   * @returns
   */
  addMarkPlugin = (name, option?: Record<string, any>, force = false) => {
    let markType = option?.markType || name;

    if (this.markPlugins.has(markType) && !force) {
      return null;
    }
    let pluginObj = MarkPluginsManager.markPluginMap.get(name);
    if (!pluginObj) {
      return null;
    }
    this.markPlugins.set(markType, new pluginObj(this.markInstance, option));
  };

  /**
   * 多个注册插件
   * @param pluginList
   */
  addMarkPlugins(pluginList: any[] = []) {
    pluginList.forEach((item) => {
      let name,
        option = {};

      if (isNotEmptyObject(item)) {
        name = item.name;
        option = item.option;
      } else if (isString(item)) {
        name = item;
      }

      this.addMarkPlugin(name, option);
    });
  }
}
