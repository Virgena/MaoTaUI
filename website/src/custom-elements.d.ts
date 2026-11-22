/**
 * mao-* 自定义元素的 JSX 类型声明。
 * 只用 React 做文档站外壳；这些标签本身与框架无关。
 */

import type { CSSProperties, DOMAttributes, ReactNode, RefAttributes } from "react";

type Bool = boolean | undefined;
type Color = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";

interface MaoBase<E extends HTMLElement = HTMLElement> extends DOMAttributes<E>, RefAttributes<E> {
  id?: string;
  className?: string;
  style?: CSSProperties;
  slot?: string;
  hidden?: boolean;
  tabIndex?: number;
  title?: string;
  children?: ReactNode;
  [aria: `aria-${string}`]: string | number | boolean | undefined;
  [data: `data-${string}`]: string | number | boolean | undefined;
}

interface MaoButtonAttrs extends MaoBase {
  color?: Color;
  variant?: "solid" | "shadow" | "bordered" | "flat" | "light";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  loading?: Bool;
  disabled?: Bool;
  href?: string;
  block?: Bool;
  icon?: Bool;
}

interface MaoButtonGroupAttrs extends MaoBase {
  orientation?: "horizontal" | "vertical";
}

interface MaoLinkAttrs extends MaoBase {
  href?: string;
  target?: "_self" | "_blank";
  color?: Color;
  underline?: "always" | "hover" | "none";
  size?: "sm" | "md" | "lg";
  external?: Bool;
}

interface MaoCopyAttrs extends MaoBase {
  text?: string;
  label?: string;
  "copied-label"?: string;
  color?: Color;
  variant?: "light" | "solid";
  size?: "sm" | "md" | "lg";
  disabled?: Bool;
}

interface MaoReactionAttrs extends MaoBase {
  active?: Bool;
  count?: number | string;
  icon?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

interface MaoChipAttrs extends MaoBase {
  active?: Bool;
  disabled?: Bool;
  value?: string;
}

interface MaoSegmentedAttrs extends MaoBase {
  value?: string;
  label?: string;
  disabled?: Bool;
}

interface MaoSegmentAttrs extends MaoBase {
  value?: string;
  disabled?: Bool;
}

interface MaoTextFieldAttrs extends MaoBase {
  label?: string;
  hint?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  required?: Bool;
  disabled?: Bool;
  readonly?: Bool;
  invalid?: Bool;
  autocomplete?: string;
  maxlength?: number | string;
  "show-count"?: Bool;
  clearable?: Bool;
  icon?: string;
}

interface MaoTextAreaAttrs extends MaoTextFieldAttrs {
  rows?: number | string;
}

interface MaoSelectAttrs extends MaoBase {
  label?: string;
  hint?: string;
  options?: string;
  value?: string;
  placeholder?: string;
  name?: string;
  required?: Bool;
  disabled?: Bool;
  invalid?: Bool;
  clearable?: Bool;
}

interface MaoSwitchAttrs extends MaoBase {
  checked?: Bool;
  disabled?: Bool;
  name?: string;
  value?: string;
  size?: "sm" | "md";
}

interface MaoCheckboxAttrs extends MaoBase {
  checked?: Bool;
  indeterminate?: Bool;
  disabled?: Bool;
  name?: string;
  value?: string;
}

interface MaoIconAttrs extends MaoBase {
  name?: string;
  size?: number | string;
  label?: string;
  "stroke-width"?: number | string;
}

interface MaoBadgeAttrs extends MaoBase {
  tone?: "neutral" | "accent" | "danger" | "sage" | "blue" | "solid";
}

interface MaoAvatarAttrs extends MaoBase {
  label?: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  tone?: "sage" | "blue" | "accent";
}

interface MaoProgressAttrs extends MaoBase {
  value?: number | string;
  max?: number | string;
  label?: string;
  "show-value"?: Bool;
  tone?: "accent" | "sage" | "blue";
}

interface MaoMetricAttrs extends MaoBase {
  label?: string;
  value?: string;
  trend?: string;
  tone?: "sage" | "danger";
}

interface MaoMiniChartAttrs extends MaoBase {
  values?: string;
  active?: number | string;
  label?: string;
  unit?: string;
  tone?: "sage" | "blue" | "accent";
}

interface MaoDividerAttrs extends MaoBase {
  orientation?: "horizontal" | "vertical";
  dashed?: Bool;
  color?: string;
}

interface MaoBrandAttrs extends MaoBase {
  name?: string;
  href?: string;
  "icon-src"?: string;
  "icon-alt"?: string;
}

interface MaoCardAttrs extends MaoBase {
  color?: Color;
  padding?: "sm" | "md" | "lg";
  bordered?: Bool;
  hoverable?: Bool;
  clickable?: Bool;
  transparent?: Bool;
  href?: string;
}

interface MaoHeaderAttrs extends MaoBase {
  name?: string;
  description?: string;
  level?: "1" | "2" | "3";
}

interface MaoScrollShadowAttrs extends MaoBase {
  axis?: "horizontal" | "vertical";
  "shadow-size"?: string;
  "shadow-color"?: string;
  scrollbar?: "none" | "thin";
  wheel?: Bool;
  draggable?: Bool;
}

interface MaoNoticeAttrs extends MaoBase {
  tone?: "info" | "sage" | "blue" | "accent" | "danger";
  title?: string;
}

interface MaoDialogAttrs extends MaoBase {
  open?: Bool;
  heading?: string;
  size?: "sm" | "md" | "lg";
  closable?: Bool;
}

interface MaoToastAttrs extends MaoBase {
  tone?: "info" | "success" | "warning" | "danger";
  heading?: string;
  closable?: Bool;
}

interface MaoSpinnerAttrs extends MaoBase {
  size?: "sm" | "md" | "lg";
  label?: string;
}

interface MaoSkeletonAttrs extends MaoBase {
  lines?: number | string;
  avatar?: Bool;
  animated?: Bool;
  block?: Bool;
}

interface MaoEmptyAttrs extends MaoBase {
  icon?: string;
  title?: string;
  description?: string;
}

interface MaoTooltipAttrs extends MaoBase {
  content?: string;
  placement?: "top" | "bottom" | "start" | "end";
  delay?: number | string;
}

interface MaoMenuAttrs extends MaoBase {
  value?: string;
  orientation?: "vertical" | "horizontal";
  label?: string;
  disabled?: Bool;
}

interface MaoMenuItemAttrs extends MaoBase {
  value?: string;
  icon?: string;
  href?: string;
  badge?: string;
  active?: Bool;
  disabled?: Bool;
}

interface MaoDropdownAttrs extends MaoBase {
  open?: Bool;
  placement?: "bottom-end" | "bottom-start" | "top-end" | "top-start";
}

interface MaoDrawerAttrs extends MaoBase {
  open?: Bool;
  heading?: string;
  placement?: "end" | "start";
  size?: "sm" | "md" | "lg";
  closable?: Bool;
}

interface MaoPaginationAttrs extends MaoBase {
  total?: number | string;
  page?: number | string;
  "page-size"?: number | string;
  siblings?: number | string;
  simple?: Bool;
  label?: string;
  disabled?: Bool;
}

interface MaoDescriptionsAttrs extends MaoBase {
  columns?: number | string;
  bordered?: Bool;
}

interface MaoDescriptionsItemAttrs extends MaoBase {
  label?: string;
  span?: number | string;
}

interface MaoFormAttrs extends MaoBase {
  disabled?: Bool;
  label?: string;
}

interface MaoFormItemAttrs extends MaoBase {
  name?: string;
  label?: string;
  hint?: string;
  rules?: string;
  required?: Bool;
  error?: string;
}

interface MaoCheckboxGroupAttrs extends MaoBase {
  name?: string;
  value?: string;
  label?: string;
  disabled?: Bool;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "mao-button": MaoButtonAttrs;
      "mao-button-group": MaoButtonGroupAttrs;
      "mao-link": MaoLinkAttrs;
      "mao-copy": MaoCopyAttrs;
      "mao-reaction": MaoReactionAttrs;
      "mao-chip": MaoChipAttrs;
      "mao-segmented": MaoSegmentedAttrs;
      "mao-segment": MaoSegmentAttrs;
      "mao-text-field": MaoTextFieldAttrs;
      "mao-text-area": MaoTextAreaAttrs;
      "mao-select": MaoSelectAttrs;
      "mao-switch": MaoSwitchAttrs;
      "mao-checkbox": MaoCheckboxAttrs;
      "mao-icon": MaoIconAttrs;
      "mao-badge": MaoBadgeAttrs;
      "mao-avatar": MaoAvatarAttrs;
      "mao-progress": MaoProgressAttrs;
      "mao-metric": MaoMetricAttrs;
      "mao-mini-chart": MaoMiniChartAttrs;
      "mao-divider": MaoDividerAttrs;
      "mao-brand": MaoBrandAttrs;
      "mao-card": MaoCardAttrs;
      "mao-header": MaoHeaderAttrs;
      "mao-scroll-shadow": MaoScrollShadowAttrs;
      "mao-notice": MaoNoticeAttrs;
      "mao-dialog": MaoDialogAttrs;
      "mao-toast": MaoToastAttrs;
      "mao-spinner": MaoSpinnerAttrs;
      "mao-skeleton": MaoSkeletonAttrs;
      "mao-empty": MaoEmptyAttrs;
      "mao-tooltip": MaoTooltipAttrs;
      "mao-menu": MaoMenuAttrs;
      "mao-menu-item": MaoMenuItemAttrs;
      "mao-dropdown": MaoDropdownAttrs;
      "mao-drawer": MaoDrawerAttrs;
      "mao-pagination": MaoPaginationAttrs;
      "mao-descriptions": MaoDescriptionsAttrs;
      "mao-descriptions-item": MaoDescriptionsItemAttrs;
      "mao-form": MaoFormAttrs;
      "mao-form-item": MaoFormItemAttrs;
      "mao-checkbox-group": MaoCheckboxGroupAttrs;
    }
  }
}
