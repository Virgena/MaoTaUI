import { BrandPage } from "./pages/BrandPage.tsx";
import { ButtonGroupPage } from "./pages/ButtonGroupPage.tsx";
import { ButtonPage } from "./pages/ButtonPage.tsx";
import { CardPage } from "./pages/CardPage.tsx";
import { ColorsPage } from "./pages/ColorsPage.tsx";
import { CopyPage } from "./pages/CopyPage.tsx";
import { DividerPage } from "./pages/DividerPage.tsx";
import { HeaderPage } from "./pages/HeaderPage.tsx";
import { IconPage } from "./pages/IconPage.tsx";
import { LinkPage } from "./pages/LinkPage.tsx";
import { ReactionPage } from "./pages/ReactionPage.tsx";
import { ScrollShadowPage } from "./pages/ScrollShadowPage.tsx";

export const routes = [
  { id: "colors", group: "开始使用", label: "Colors (色彩)", render: ColorsPage },
  { id: "button", group: "通用", label: "Button (按钮)", render: ButtonPage },
  { id: "buttongroup", group: "通用", label: "ButtonGroup (按钮组)", render: ButtonGroupPage },
  { id: "icon", group: "通用", label: "Icon (图标)", render: IconPage },
  { id: "brand", group: "通用", label: "Brand (品牌)", render: BrandPage },
  { id: "copy", group: "通用", label: "Copy (复制)", render: CopyPage },
  { id: "header", group: "通用", label: "Header (标题)", render: HeaderPage },
  { id: "link", group: "通用", label: "Link (链接)", render: LinkPage },
  { id: "reaction", group: "通用", label: "Reaction (点赞)", render: ReactionPage },
  { id: "card", group: "布局", label: "Card (卡片)", render: CardPage },
  { id: "divider", group: "布局", label: "Divider (分割线)", render: DividerPage },
  { id: "scrollshadow", group: "布局", label: "ScrollShadow (滚动阴影)", render: ScrollShadowPage },
];
