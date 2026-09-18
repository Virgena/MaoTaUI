import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Ellipsis,
  ExternalLink,
  Heart,
  Info,
  Link,
  MessageSquare,
  Minus,
  Moon,
  Palette,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Star,
  Sun,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import type { SVGProps } from "react";

export const ICON = {
  plus: Plus,
  minus: Minus,
  check: Check,
  close: X,
  search: Search,
  more: Ellipsis,
  copy: Copy,
  refresh: RefreshCw,
  link: Link,
  external: ExternalLink,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  trash: Trash2,
  calendar: Calendar,
  info: Info,
  alert: TriangleAlert,
  heart: Heart,
  star: Star,
  bookmark: Bookmark,
  share: Share2,
  chat: MessageSquare,
  sun: Sun,
  moon: Moon,
  palette: Palette,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON;

export interface MaoIconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name?: IconName;
  size?: number;
  label?: string;
}

export function MaoIcon({ name, size = 16, label, className = "", ...rest }: MaoIconProps) {
  const Glyph = name ? ICON[name] : undefined;
  if (!Glyph) return null;
  return (
    <Glyph
      {...rest}
      className={`mt-icon ${className}`.trim()}
      size={size}
      strokeWidth={2}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
