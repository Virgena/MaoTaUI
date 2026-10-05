import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ArrowLeft,
  ArrowUp,
  Bookmark,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Cpu,
  Ellipsis,
  ExternalLink,
  Folder,
  FolderOpen,
  Hand,
  Heart,
  Info,
  Lightbulb,
  Link,
  MessageSquare,
  Minus,
  Moon,
  Palette,
  Pin,
  Plug,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Square,
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
  cpu: Cpu,
  refresh: RefreshCw,
  link: Link,
  external: ExternalLink,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  back: ArrowLeft,
  arrowUp: ArrowUp,
  square: Square,
  trash: Trash2,
  calendar: Calendar,
  clock: Clock,
  folder: Folder,
  folderOpen: FolderOpen,
  plug: Plug,
  sliders: SlidersHorizontal,
  bulb: Lightbulb,
  hand: Hand,
  shield: ShieldCheck,
  pin: Pin,
  archive: Archive,
  restore: RotateCcw,
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
      strokeWidth={1.5}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
