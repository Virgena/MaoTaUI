import { AvatarPage } from "./pages/AvatarPage.tsx";
import { BadgePage } from "./pages/BadgePage.tsx";
import { BrandPage } from "./pages/BrandPage.tsx";
import { ButtonGroupPage } from "./pages/ButtonGroupPage.tsx";
import { ButtonPage } from "./pages/ButtonPage.tsx";
import { CardPage } from "./pages/CardPage.tsx";
import { ChartPage } from "./pages/ChartPage.tsx";
import { ChipPage } from "./pages/ChipPage.tsx";
import { ColorsPage } from "./pages/ColorsPage.tsx";
import { CopyPage } from "./pages/CopyPage.tsx";
import { DialogPage } from "./pages/DialogPage.tsx";
import { DividerPage } from "./pages/DividerPage.tsx";
import { FieldsPage } from "./pages/FieldsPage.tsx";
import { HeaderPage } from "./pages/HeaderPage.tsx";
import { IconPage } from "./pages/IconPage.tsx";
import { IntegrationPage } from "./pages/IntegrationPage.tsx";
import { LinkPage } from "./pages/LinkPage.tsx";
import { MetricPage } from "./pages/MetricPage.tsx";
import { NoticePage } from "./pages/NoticePage.tsx";
import { ProgressPage } from "./pages/ProgressPage.tsx";
import { ReactionPage } from "./pages/ReactionPage.tsx";
import { ScrollShadowPage } from "./pages/ScrollShadowPage.tsx";
import { SegmentedPage } from "./pages/SegmentedPage.tsx";
import { SwitchPage } from "./pages/SwitchPage.tsx";

export const routes = [
  { id: "colors", group: "开始使用", label: "Colors (色彩)", render: ColorsPage },
  { id: "integration", group: "开始使用", label: "Integration (接入)", render: IntegrationPage },
  { id: "button", group: "操作", label: "Button (按钮)", render: ButtonPage },
  { id: "buttongroup", group: "操作", label: "ButtonGroup (按钮组)", render: ButtonGroupPage },
  { id: "link", group: "操作", label: "Link (链接)", render: LinkPage },
  { id: "copy", group: "操作", label: "Copy (复制)", render: CopyPage },
  { id: "reaction", group: "操作", label: "Reaction (点赞)", render: ReactionPage },
  { id: "fields", group: "输入", label: "Fields (输入框)", render: FieldsPage },
  { id: "switch", group: "输入", label: "Switch (开关)", render: SwitchPage },
  { id: "icon", group: "展示", label: "Icon (图标)", render: IconPage },
  { id: "badge", group: "展示", label: "Badge (徽标)", render: BadgePage },
  { id: "avatar", group: "展示", label: "Avatar (头像)", render: AvatarPage },
  { id: "progress", group: "展示", label: "Progress (进度条)", render: ProgressPage },
  { id: "metric", group: "展示", label: "Metric (指标)", render: MetricPage },
  { id: "chart", group: "展示", label: "MiniChart (图表)", render: ChartPage },
  { id: "brand", group: "展示", label: "Brand (品牌)", render: BrandPage },
  { id: "notice", group: "反馈", label: "Notice (通知)", render: NoticePage },
  { id: "dialog", group: "反馈", label: "Dialog (对话框)", render: DialogPage },
  { id: "segmented", group: "导航", label: "Segmented (分段)", render: SegmentedPage },
  { id: "chip", group: "导航", label: "Chip (标签)", render: ChipPage },
  { id: "header", group: "布局", label: "Header (标题)", render: HeaderPage },
  { id: "card", group: "布局", label: "Card (卡片)", render: CardPage },
  { id: "divider", group: "布局", label: "Divider (分割线)", render: DividerPage },
  { id: "scrollshadow", group: "布局", label: "ScrollShadow (滚动阴影)", render: ScrollShadowPage },
];
