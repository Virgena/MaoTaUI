/** 校验规则集：`mao-form-item` 与业务侧手动校验共用。 */

export type ValidationRuleName =
  | "required"
  | "minLength"
  | "maxLength"
  | "pattern"
  | "email"
  | "oneOf"
  | "min"
  | "max";

export interface ValidationRule {
  rule: ValidationRuleName;
  value?: string | number | readonly string[];
  message?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function describe(rule: ValidationRule): string {
  const raw = rule.value;
  switch (rule.rule) {
    case "required":
      return "请填写此字段";
    case "minLength":
      return `至少 ${String(raw)} 个字符`;
    case "maxLength":
      return `最多 ${String(raw)} 个字符`;
    case "pattern":
      return "格式不正确";
    case "email":
      return "邮箱格式不正确";
    case "oneOf":
      return "请选择有效选项";
    case "min":
      return `不能小于 ${String(raw)}`;
    case "max":
      return `不能大于 ${String(raw)}`;
    default:
      return "校验未通过";
  }
}

function fails(rule: ValidationRule, value: string): boolean {
  const raw = rule.value;
  switch (rule.rule) {
    case "required":
      return value.trim().length === 0;
    case "minLength":
      return value.length < Number(raw ?? 0);
    case "maxLength":
      return value.length > Number(raw ?? Number.MAX_SAFE_INTEGER);
    case "pattern":
      return typeof raw === "string" && raw !== "" ? !new RegExp(raw).test(value) : false;
    case "email":
      return value.trim() !== "" && !EMAIL.test(value.trim());
    case "oneOf":
      return Array.isArray(raw) ? !raw.includes(value) : false;
    case "min":
      return value !== "" && Number(value) < Number(raw ?? 0);
    case "max":
      return value !== "" && Number(value) > Number(raw ?? 0);
    default:
      return false;
  }
}
/**
 * 按顺序跑规则，返回第一条错误文案；全部通过返回 null。
 */
export function runRules(value: string, rules: readonly ValidationRule[]): string | null {
  for (const rule of rules) {
    if (!fails(rule, value)) continue;
    return rule.message ?? describe(rule);
  }
  return null;
}

/** 解析 `mao-form-item` 的 rules JSON 属性，格式错误时返回空数组。 */
export function parseRules(raw: string): ValidationRule[] {
  if (!raw.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
      .map((item) => {
        const rule: ValidationRule = { rule: String(item.rule ?? "required") as ValidationRuleName };
        if (typeof item.value === "string" || typeof item.value === "number") rule.value = item.value;
        else if (Array.isArray(item.value)) rule.value = item.value.map(String);
        if (typeof item.message === "string") rule.message = item.message;
        return rule;
      });
  } catch {
    if (typeof console !== "undefined") console.warn("[maotaui] mao-form-item 的 rules 不是合法 JSON：", raw);
    return [];
  }
}
