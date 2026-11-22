import { MaoButton, MaoButtonGroup } from "./button.ts";
import { MaoIcon, MaoBadge, MaoAvatar, MaoNotice, MaoProgress, MaoMetric, MaoMiniChart, MaoDivider, MaoBrand } from "./display.ts";
import { MaoTextField, MaoTextArea, MaoSelect, MaoSwitch, MaoCheckbox } from "./inputs.ts";
import { MaoLink, MaoCopy, MaoReaction } from "./actions.ts";
import {
  MaoCard,
  MaoHeader,
  MaoSegment,
  MaoSegmented,
  MaoChip,
  MaoScrollShadow,
  MaoDialog,
} from "./layout.ts";
import { MaoToast, MaoSpinner, MaoSkeleton, MaoEmpty, MaoTooltip } from "./feedback.ts";
import { MaoMenu, MaoMenuItem, MaoDropdown, MaoDrawer } from "./nav.ts";
import { MaoPagination, MaoDescriptions, MaoDescriptionsItem } from "./data.ts";
import { MaoForm, MaoFormItem, MaoCheckboxGroup } from "./forms.ts";

export { MaoElement } from "./base.ts";
export { MaoButton, MaoButtonGroup } from "./button.ts";
export { MaoIcon, MaoBadge, MaoAvatar, MaoNotice, MaoProgress, MaoMetric, MaoMiniChart, MaoDivider, MaoBrand } from "./display.ts";
export { MaoTextField, MaoTextArea, MaoSelect, MaoSwitch, MaoCheckbox } from "./inputs.ts";
export { MaoLink, MaoCopy, MaoReaction } from "./actions.ts";
export {
  MaoCard,
  MaoHeader,
  MaoSegment,
  MaoSegmented,
  MaoChip,
  MaoScrollShadow,
  MaoDialog,
} from "./layout.ts";
export { MaoToast, MaoSpinner, MaoSkeleton, MaoEmpty, MaoTooltip } from "./feedback.ts";
export { MaoMenu, MaoMenuItem, MaoDropdown, MaoDrawer } from "./nav.ts";
export { MaoPagination, MaoDescriptions, MaoDescriptionsItem } from "./data.ts";
export { MaoForm, MaoFormItem, MaoCheckboxGroup } from "./forms.ts";

/** 元素名 → 构造器。新增组件只需在这里登记一次。 */
export const ELEMENT_DEFINITIONS = {
  "mao-button": MaoButton,
  "mao-button-group": MaoButtonGroup,
  "mao-icon": MaoIcon,
  "mao-badge": MaoBadge,
  "mao-avatar": MaoAvatar,
  "mao-notice": MaoNotice,
  "mao-progress": MaoProgress,
  "mao-metric": MaoMetric,
  "mao-mini-chart": MaoMiniChart,
  "mao-divider": MaoDivider,
  "mao-brand": MaoBrand,
  "mao-text-field": MaoTextField,
  "mao-text-area": MaoTextArea,
  "mao-select": MaoSelect,
  "mao-switch": MaoSwitch,
  "mao-checkbox": MaoCheckbox,
  "mao-link": MaoLink,
  "mao-copy": MaoCopy,
  "mao-reaction": MaoReaction,
  "mao-card": MaoCard,
  "mao-header": MaoHeader,
  "mao-segment": MaoSegment,
  "mao-segmented": MaoSegmented,
  "mao-chip": MaoChip,
  "mao-scroll-shadow": MaoScrollShadow,
  "mao-dialog": MaoDialog,
  "mao-toast": MaoToast,
  "mao-spinner": MaoSpinner,
  "mao-skeleton": MaoSkeleton,
  "mao-empty": MaoEmpty,
  "mao-tooltip": MaoTooltip,
  "mao-menu": MaoMenu,
  "mao-menu-item": MaoMenuItem,
  "mao-dropdown": MaoDropdown,
  "mao-drawer": MaoDrawer,
  "mao-pagination": MaoPagination,
  "mao-descriptions": MaoDescriptions,
  "mao-descriptions-item": MaoDescriptionsItem,
  "mao-form": MaoForm,
  "mao-form-item": MaoFormItem,
  "mao-checkbox-group": MaoCheckboxGroup,
} as const;

export type MaoTagName = keyof typeof ELEMENT_DEFINITIONS;

/**
 * 幂等注册全部自定义元素。
 * 在 Node / SSR 中不会被调用；调用方也可传入自己的 registry。
 */
export function defineMaoElements(registry: CustomElementRegistry = customElements): void {
  for (const [tag, ctor] of Object.entries(ELEMENT_DEFINITIONS)) {
    if (!registry.get(tag)) registry.define(tag, ctor as CustomElementConstructor);
  }
}

export function isMaoElement(node: unknown): node is HTMLElement {
  return node instanceof HTMLElement && node.localName.startsWith("mao-");
}
