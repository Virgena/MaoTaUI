/**
 * 组件元数据的单一事实源：文档站、脚手架与 AI 都从这里读取。
 * 约定：属性 kebab-case，布尔属性「存在即 true」，事件统一 mt-* 前缀。
 */

export type ComponentGroup = "操作" | "输入" | "展示" | "反馈" | "导航" | "布局";

export interface AttributeMeta {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentMeta {
  tag: `mao-${string}`;
  title: string;
  titleCn: string;
  group: ComponentGroup;
  description: string;
  attributes: AttributeMeta[];
  events: string[];
  slots: string[];
  example: string;
}

const attr = (name: string, type: string, description: string, def?: string): AttributeMeta =>
  def === undefined ? { name, type, description } : { name, type, description, default: def };

export const GROUP_ORDER: readonly ComponentGroup[] = ["操作", "输入", "展示", "反馈", "导航", "布局"];

export const COMPONENT_REGISTRY: readonly ComponentMeta[] = [
  {
    tag: "mao-button",
    title: "Button",
    titleCn: "按钮",
    group: "操作",
    description: "触发操作的基础按钮，支持 5 种外观、7 种语义色与加载态。",
    attributes: [
      attr("color", '"primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral"', "语义色", "neutral"),
      attr("variant", '"solid" | "shadow" | "bordered" | "flat" | "light"', "外观变体", "solid"),
      attr("size", '"sm" | "md" | "lg"', "尺寸", "md"),
      attr("loading", "boolean", "加载态：禁用点击并显示转圈"),
      attr("disabled", "boolean", "禁用"),
      attr("href", "string", "点击后导航（真实链接请改用 <a class=\"mt-btn\">）"),
      attr("block", "boolean", "占满整行"),
      attr("icon", "boolean", "仅图标按钮，收窄内边距"),
    ],
    events: ["click"],
    slots: ["默认插槽：按钮文字或 <mao-icon>"],
    example: '<mao-button color="primary">保存更改</mao-button>\n<mao-button variant="bordered" loading>处理中</mao-button>',
  },
  {
    tag: "mao-button-group",
    title: "ButtonGroup",
    titleCn: "按钮组",
    group: "操作",
    description: "把多个按钮拼接为一组。",
    attributes: [attr("orientation", '"horizontal" | "vertical"', "排列方向", "horizontal")],
    events: [],
    slots: ["默认插槽：mao-button"],
    example:
      '<mao-button-group>\n  <mao-button variant="bordered">日</mao-button>\n  <mao-button variant="bordered">周</mao-button>\n</mao-button-group>',
  },
  {
    tag: "mao-link",
    title: "Link",
    titleCn: "链接",
    group: "操作",
    description: "文本链接，支持下划线策略与外链标记。",
    attributes: [
      attr("href", "string", "跳转地址"),
      attr("target", '"_self" | "_blank"', "打开方式", "_self"),
      attr("color", "语义色名", "文字颜色", "neutral"),
      attr("underline", '"always" | "hover" | "none"', "下划线策略", "always"),
      attr("size", '"sm" | "md" | "lg"', "字号", "md"),
      attr("external", "boolean", "显示外链箭头"),
    ],
    events: ["click"],
    slots: ["默认插槽：链接文字"],
    example: '<mao-link href="https://example.com" external>查看文档</mao-link>',
  },
  {
    tag: "mao-copy",
    title: "Copy",
    titleCn: "复制按钮",
    group: "操作",
    description: "复制文本并显示成功态，成功后派发 mt-copy。",
    attributes: [
      attr("text", "string", "要复制的文本"),
      attr("label", "string", "默认文案", "复制"),
      attr("copied-label", "string", "成功文案", "已复制"),
      attr("color", "语义色名", "文字颜色"),
      attr("variant", '"light" | "solid"', "外观", "light"),
      attr("size", '"sm" | "md" | "lg"', "尺寸", "md"),
      attr("disabled", "boolean", "禁用"),
    ],
    events: ["mt-copy"],
    slots: [],
    example: '<mao-copy text="pnpm add maotaui" label="复制命令"></mao-copy>',
  },
  {
    tag: "mao-reaction",
    title: "Reaction",
    titleCn: "表情反馈",
    group: "操作",
    description: "点赞 / 表情按钮，可带计数。",
    attributes: [
      attr("active", "boolean", "是否已选中"),
      attr("count", "number", "计数"),
      attr("icon", "IconName", "图标名", "heart"),
      attr("color", "语义色名", "主题色", "danger"),
      attr("size", '"sm" | "md" | "lg"', "尺寸", "md"),
      attr("label", "string", "无障碍标签"),
    ],
    events: ["mt-change"],
    slots: ["默认插槽：附加文字"],
    example: '<mao-reaction count="12">喜欢</mao-reaction>',
  },
  {
    tag: "mao-chip",
    title: "Chip",
    titleCn: "标签",
    group: "导航",
    description: "可点击选中的胶囊标签。",
    attributes: [
      attr("active", "boolean", "选中态"),
      attr("disabled", "boolean", "禁用"),
      attr("value", "string", "值"),
    ],
    events: ["mt-toggle"],
    slots: ["默认插槽：文字"],
    example: '<mao-chip active value="all">全部</mao-chip>',
  },
  {
    tag: "mao-text-field",
    title: "TextField",
    titleCn: "单行输入",
    group: "输入",
    description: "表单关联的单行输入框，内部结构封装在 Shadow DOM。",
    attributes: [
      attr("label", "string", "标签"),
      attr("hint", "string", "提示文字"),
      attr("value", "string", "值"),
      attr("placeholder", "string", "占位文字"),
      attr("type", "string", "原生 input type", "text"),
      attr("name", "string", "表单字段名"),
      attr("required", "boolean", "必填"),
      attr("disabled", "boolean", "禁用"),
      attr("readonly", "boolean", "只读"),
      attr("invalid", "boolean", "错误态"),
    ],
    events: ["mt-input"],
    slots: [],
    example: '<mao-text-field label="项目名称" placeholder="MaoTaUI" value="MaoTaUI"></mao-text-field>',
  },
  {
    tag: "mao-text-area",
    title: "TextArea",
    titleCn: "多行输入",
    group: "输入",
    description: "表单关联的多行文本域。",
    attributes: [
      attr("label", "string", "标签"),
      attr("hint", "string", "提示文字"),
      attr("value", "string", "值"),
      attr("rows", "number", "行数", "3"),
      attr("placeholder", "string", "占位文字"),
      attr("name", "string", "表单字段名"),
      attr("required", "boolean", "必填"),
      attr("disabled", "boolean", "禁用"),
      attr("readonly", "boolean", "只读"),
      attr("invalid", "boolean", "错误态"),
    ],
    events: ["mt-input"],
    slots: [],
    example: '<mao-text-area label="备注" rows="4" placeholder="写点什么"></mao-text-area>',
  },
  {
    tag: "mao-select",
    title: "Select",
    titleCn: "下拉选择",
    group: "输入",
    description: "选项通过 options 属性以 JSON 传入，避免子节点拷贝。",
    attributes: [
      attr("label", "string", "标签"),
      attr("hint", "string", "提示文字"),
      attr("options", 'Array<{ value: string; label: string }>', "JSON 选项数组"),
      attr("value", "string", "当前值"),
      attr("placeholder", "string", "占位选项"),
      attr("name", "string", "表单字段名"),
      attr("required", "boolean", "必填"),
      attr("disabled", "boolean", "禁用"),
    ],
    events: ["mt-change"],
    slots: [],
    example: '<mao-select label="主题" options=\'[{"value":"light","label":"浅色"},{"value":"dark","label":"深色"}]\'></mao-select>',
  },
  {
    tag: "mao-switch",
    title: "Switch",
    titleCn: "开关",
    group: "输入",
    description: "表单关联的开关，点击标签文字也可切换。",
    attributes: [
      attr("checked", "boolean", "是否开启"),
      attr("disabled", "boolean", "禁用"),
      attr("name", "string", "表单字段名"),
      attr("value", "string", "开启时提交的值", "on"),
      attr("size", '"sm" | "md"', "尺寸", "md"),
    ],
    events: ["mt-change"],
    slots: ["默认插槽：标签文字"],
    example: '<mao-switch checked>自动保存</mao-switch>',
  },
  {
    tag: "mao-checkbox",
    title: "Checkbox",
    titleCn: "复选框",
    group: "输入",
    description: "表单关联的复选框，支持半选态。",
    attributes: [
      attr("checked", "boolean", "是否选中"),
      attr("indeterminate", "boolean", "半选态"),
      attr("disabled", "boolean", "禁用"),
      attr("name", "string", "表单字段名"),
      attr("value", "string", "提交值", "on"),
    ],
    events: ["mt-change"],
    slots: ["默认插槽：标签文字"],
    example: '<mao-checkbox checked>同意条款</mao-checkbox>',
  },
  {
    tag: "mao-segmented",
    title: "Segmented",
    titleCn: "分段控制器",
    group: "导航",
    description: "在少量互斥选项间切换，方向键可移动焦点。",
    attributes: [
      attr("value", "string", "当前选中值"),
      attr("label", "string", "无障碍标签"),
      attr("disabled", "boolean", "禁用"),
    ],
    events: ["mt-change"],
    slots: ["默认插槽：mao-segment"],
    example:
      '<mao-segmented value="week">\n  <mao-segment value="day">日</mao-segment>\n  <mao-segment value="week">周</mao-segment>\n</mao-segmented>',
  },
  {
    tag: "mao-segment",
    title: "Segment",
    titleCn: "分段项",
    group: "导航",
    description: "mao-segmented 的子项，选中态由父级维护。",
    attributes: [attr("value", "string", "值"), attr("disabled", "boolean", "禁用")],
    events: [],
    slots: ["默认插槽：文字"],
    example: '<mao-segment value="week">周</mao-segment>',
  },
  {
    tag: "mao-icon",
    title: "Icon",
    titleCn: "图标",
    group: "展示",
    description: "内置 40 个 SVG 图标，绝不发起网络请求。",
    attributes: [
      attr("name", "IconName", "图标名，见 core/icons.ts"),
      attr("size", "number | string", "尺寸", "16"),
      attr("label", "string", "无障碍标签，省略则 aria-hidden"),
      attr("stroke-width", "number", "描边宽度", "2"),
    ],
    events: [],
    slots: [],
    example: '<mao-icon name="check" size="18" label="已完成"></mao-icon>',
  },
  {
    tag: "mao-avatar",
    title: "Avatar",
    titleCn: "头像",
    group: "展示",
    description: "首字或图片头像，图片通过 background-image 渲染，不注入子节点。",
    attributes: [
      attr("label", "string", "首字（如「林」）"),
      attr("src", "string", "图片地址"),
      attr("alt", "string", "图片替代文字"),
      attr("size", '"sm" | "md" | "lg"', "尺寸", "md"),
      attr("tone", '"sage" | "blue" | "accent"', "色调"),
    ],
    events: [],
    slots: [],
    example: '<mao-avatar label="林" tone="accent"></mao-avatar>',
  },
  {
    tag: "mao-badge",
    title: "Badge",
    titleCn: "徽标",
    group: "展示",
    description: "小号状态徽标。",
    attributes: [attr("tone", '"neutral" | "accent" | "danger" | "sage" | "blue" | "solid"', "色调", "neutral")],
    events: [],
    slots: ["默认插槽：文字"],
    example: '<mao-badge tone="sage">已上线</mao-badge>',
  },
  {
    tag: "mao-progress",
    title: "Progress",
    titleCn: "进度条",
    group: "展示",
    description: "属性驱动的进度条，支持标签与百分比。",
    attributes: [
      attr("value", "number", "当前值", "0"),
      attr("max", "number", "最大值", "100"),
      attr("label", "string", "左侧标签"),
      attr("show-value", "boolean", "显示百分比"),
      attr("tone", '"accent" | "sage" | "blue"', "色调", "accent"),
    ],
    events: [],
    slots: [],
    example: '<mao-progress value="68" label="同步进度" show-value></mao-progress>',
  },
  {
    tag: "mao-metric",
    title: "Metric",
    titleCn: "指标",
    group: "展示",
    description: "大号数值 + 标签 + 趋势说明。",
    attributes: [
      attr("label", "string", "指标名"),
      attr("value", "string", "数值"),
      attr("trend", "string", "趋势说明"),
      attr("tone", '"sage" | "danger"', "趋势颜色", "sage"),
    ],
    events: [],
    slots: [],
    example: '<mao-metric label="本周完成" value="128" trend="+12%"></mao-metric>',
  },
  {
    tag: "mao-mini-chart",
    title: "MiniChart",
    titleCn: "迷你图表",
    group: "展示",
    description: "纯 CSS 柱状图，values 为逗号分隔数值。",
    attributes: [
      attr("values", "string", "逗号分隔数值，如 \"38,57,44\""),
      attr("active", "number", "高亮索引", "最后一个"),
      attr("label", "string", "图表标签"),
      attr("unit", "string", "单位"),
      attr("tone", '"sage" | "blue" | "accent"', "色调", "sage"),
    ],
    events: [],
    slots: [],
    example: '<mao-mini-chart values="38,57,44,84,62,72,49" label="活跃度" unit="次/日"></mao-mini-chart>',
  },
  {
    tag: "mao-divider",
    title: "Divider",
    titleCn: "分隔线",
    group: "布局",
    description: "水平或垂直分隔线，可带中间文案。",
    attributes: [
      attr("orientation", '"horizontal" | "vertical"', "方向", "horizontal"),
      attr("dashed", "boolean", "虚线"),
      attr("color", "CSS 颜色", "线条颜色"),
    ],
    events: [],
    slots: ["默认插槽：中间文案"],
    example: '<mao-divider>或</mao-divider>',
  },
  {
    tag: "mao-brand",
    title: "Brand",
    titleCn: "品牌标识",
    group: "展示",
    description: "品牌图标 + 名称，图标通过 icon-src 以背景图渲染。",
    attributes: [
      attr("name", "string", "品牌名称"),
      attr("href", "string", "点击跳转"),
      attr("icon-src", "string", "图标地址"),
      attr("icon-alt", "string", "图标替代文字"),
    ],
    events: [],
    slots: ["默认插槽：附加内容（如 mao-badge）"],
    example: '<mao-brand name="MaoTaUI" href="/" icon-src="/logo.svg"></mao-brand>',
  },
  {
    tag: "mao-card",
    title: "Card",
    titleCn: "卡片",
    group: "布局",
    description: "内容容器，支持描边、悬浮、可点击。",
    attributes: [
      attr("color", "语义色名", "主题色"),
      attr("padding", '"sm" | "md" | "lg"', "内边距", "lg"),
      attr("bordered", "boolean", "显示描边"),
      attr("hoverable", "boolean", "悬浮上浮"),
      attr("clickable", "boolean", "可点击"),
      attr("transparent", "boolean", "透明背景"),
      attr("href", "string", "点击跳转"),
    ],
    events: ["click"],
    slots: ["默认插槽：内容"],
    example: '<mao-card bordered hoverable><div class="mt-card-body">内容</div></mao-card>',
  },
  {
    tag: "mao-header",
    title: "Header",
    titleCn: "标题",
    group: "布局",
    description: "标题 + 描述 + 右侧 end 插槽。",
    attributes: [
      attr("name", "string", "标题"),
      attr("description", "string", "描述"),
      attr("level", '"1" | "2" | "3"', "语义层级", "2"),
    ],
    events: [],
    slots: ['end：右侧内容'],
    example: '<mao-header name="组件" description="21 个无头组件"></mao-header>',
  },
  {
    tag: "mao-scroll-shadow",
    title: "ScrollShadow",
    titleCn: "滚动阴影",
    group: "布局",
    description: "滚动容器，溢出时用渐变提示；支持滚轮与拖拽。",
    attributes: [
      attr("axis", '"horizontal" | "vertical"', "滚动方向", "horizontal"),
      attr("shadow-size", "CSS 长度", "阴影宽度", "2rem"),
      attr("shadow-color", "CSS 颜色", "阴影颜色", "var(--mt-bg)"),
      attr("scrollbar", '"none" | "thin"', "滚动条", "none"),
      attr("wheel", "boolean", "滚轮转为横向滚动"),
      attr("draggable", "boolean", "指针拖拽滚动"),
    ],
    events: [],
    slots: ["默认插槽：滚动内容"],
    example: '<mao-scroll-shadow wheel draggable>\n  <div class="mt-card">…</div>\n</mao-scroll-shadow>',
  },
  {
    tag: "mao-notice",
    title: "Notice",
    titleCn: "通知",
    group: "反馈",
    description: "内联通知条，自带图标与标题。",
    attributes: [
      attr("tone", '"info" | "sage" | "blue" | "accent" | "danger"', "语义色调", "info"),
      attr("title", "string", "标题"),
    ],
    events: [],
    slots: ["默认插槽：正文"],
    example: '<mao-notice tone="sage" title="更改已保存">你的内容已经安全保存。</mao-notice>',
  },
  {
    tag: "mao-dialog",
    title: "Dialog",
    titleCn: "对话框",
    group: "反馈",
    description: "基于原生 dialog，自带焦点陷阱与 Esc 关闭。",
    attributes: [
      attr("open", "boolean", "是否打开"),
      attr("heading", "string", "标题"),
      attr("size", '"sm" | "md" | "lg"', "尺寸", "md"),
      attr("closable", "boolean", "显示关闭按钮并允许 Esc / 遮罩关闭"),
    ],
    events: ["mt-open", "mt-close"],
    slots: ["默认插槽：内容", "actions：底部操作区"],
    example:
      '<mao-dialog open heading="确认删除" closable>\n  <p>删除后无法恢复。</p>\n  <mao-button slot="actions" color="danger">删除</mao-button>\n</mao-dialog>',
  },
];

export const COMPONENT_BY_TAG: Readonly<Record<string, ComponentMeta>> = Object.fromEntries(
  COMPONENT_REGISTRY.map((component) => [component.tag, component]),
);

export function componentMeta(tag: string): ComponentMeta | undefined {
  return COMPONENT_BY_TAG[tag];
}

export function componentsByGroup(group: ComponentGroup): ComponentMeta[] {
  return COMPONENT_REGISTRY.filter((component) => component.group === group);
}
