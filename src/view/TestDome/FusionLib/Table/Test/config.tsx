function getWeekDates() {
  const weeks = {};

  const startDate = getMonday(new Date()); // 获取本周周一的日期
  const date = new Date(startDate);
  const weekFirstDay = date.getDate();

  // 获取指定日期所在周的周一日期
  function getMonday(date) {
    const dayOfWeek = date.getDay(); // 0表示周日，1表示周一，...，6表示周六
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // 调整到周一
    return new Date(date.setDate(diff));
  }
  const getWeekDay = (updateDay) => {
    // const date = new Date();
    date.setDate(updateDay);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始计数，所以需要+1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 计算当前周，往前推算的第
  const computWeekDay = (week, key) => {
    let startDay = weekFirstDay;
    if (week !== 0) {
      startDay = week * 7 + weekFirstDay;
    }
    const startDate = getWeekDay(startDay);
    const endDay = startDay + 6; //0:9  1:16
    const endDate = getWeekDay(endDay);
    return { startDate, endDate, text: `${startDate} ~ ${endDate}`, key };
  };
  // 计算连续五周的日期
  for (let i = 0; i < 6; i++) {
    const weekKey = `W+${i}`;
    weeks[weekKey] = computWeekDay(i, weekKey);
  }

  return weeks;
}

const weeks = getWeekDates();

function addWeekDaysList(week) {
  return {
    title: `${week.key} (${week.text})`,
    align: "center",
    dataIndex: week.key,
    key: week.key,
    children: Array.from({ length: 5 }, (_, i) => {
      return {
        title: `D${i + 1}`,
        dataIndex: `${week.key}_D${i + 1}`,
        key: `${week.key}_D${i + 1}`,
        align: "center",
        width: 80,
      };
    }),
  };
}

// 主表格
export const mainColums = [
  {
    title: "产品编码",
    dataIndex: "productCode",
    key: "productCode",
    width: 140,
    lock: true,
    align: "center",
  },
  {
    title: "产品名称",
    dataIndex: "productName",
    key: "productName",
    width: 140,
    lock: true,
    align: "center",
  },
  {
    title: "W+0",
    dataIndex: "W0Value",
    key: "W0Value",
    width: 140,
    lock: true,
    align: "center",
  },
  ...["W+1", "W+2", "W+3", "W+4", "W+5"].map((item) => {
    const week = weeks[item];
    return {
      title: `${week.key} (${week.text})`,
      align: "center",
      key: week.key,
      dataIndex: week.key,
      children: [
        {
          title: "周滚动需求",
          dataIndex: `${week.key}RollingDemand`,
          width: 140,
          align: "center",
        },
        {
          title: "建议排产量",
          dataIndex: `${week.key}ProposalSchedule`,
          width: 140,
          align: "center",
        },
        {
          title: "期末库存量",
          dataIndex: `${week.key}EndInventory`,
          width: 140,
          align: "center",
        },
      ],
    };
  }),
];

// tab 配置
export const tabsList = [
  {
    key: "packagingPlan",
    label: "包装计划",
  },
  {
    key: "millingPlan",
    label: "制粉计划",
  },
  {
    key: "rawMilkDemand",
    label: "原奶需求",
  },
];

const commonCulums = (isAdjust = false) => {
  let list = ["W+1", "W+2"].reduce((result, item) => {
    result.push(addWeekDaysList(weeks[item]));
    if (isAdjust) {
      result.push(
        {
          title: `${item}人工调整`,
          dataIndex: `${item}Adjustvalue`,
          key: `${item}Adjustvalue`,
          isEdit: true,
          align: "center",
          width: 140,
        },
        {
          title: "调整后差异",
          dataIndex: `${item}AdjustDiffValue`,
          key: `${item}AdjustDiffValue`,
          width: 140,
        }
      );
    }
    return result;
  }, [] as any[]);

  return list.concat(
    ["W+3", "W+4", "W+5"].map((item) => ({
      title: item,
      dataIndex: `${item}Adjustvalue`,
      key: `${item}Adjustvalue`,
      align: "center",
      width: 80,
    }))
  );
};

// 包装计划
const packagingPlanColumns = [
  {
    title: "工厂名称",
    dataIndex: "factoryName",
    key: "factoryName",
    width: 140,
    lock: true,
    align: "center",
  },
  {
    title: "主/备",
    dataIndex: "mainBackup",
    key: "mainBackup",
    width: 140,
    lock: true,
    align: "center",
  },
  ...commonCulums(true),
];

// 制粉计划
const millingPlanColumns = [
  {
    title: "基粉编码",
    dataIndex: "baseFoodCode",
    key: "baseFoodCode",
    width: 140,
    lock: true,
    align: "center",
  },
  {
    title: "工厂名称",
    dataIndex: "factoryName",
    key: "factoryName",
    width: 140,
    lock: true,
    align: "center",
  },
  {
    title: "主/备",
    dataIndex: "mainBackup",
    key: "mainBackup",
    width: 140,
    lock: true,
    align: "center",
  },
  ...commonCulums(false),
];

// 原奶需求
const rawMilkDemandColumns = [
  {
    title: "工厂名称",
    dataIndex: "factoryName",
    key: "factoryName",
    width: 140,
    lock: true,
    align: "center",
  },
  {
    title: "原奶类型",
    dataIndex: "rawMilkType",
    key: "rawMilkType",
    lock: true,
    align: "center",
    width: 140,
  },
  {
    title: "期初奶量/吨",
    dataIndex: "rawMilkAmount",
    key: "rawMilkAmount",
    lock: true,
    align: "center",
    width: 140,
  },
  ...commonCulums(false),
];

export const tablesMapColums = {
  packagingPlan: packagingPlanColumns,
  millingPlan: millingPlanColumns,
  rawMilkDemand: rawMilkDemandColumns,
};
