/**
 * 提现历史列表（创作者中心）。
 *
 * 纯展示组件，不发起请求。由 Server Component 父组件传入 items。
 *
 * 状态映射：
 *   pending  审核中（黄）
 *   paid     已到账（绿）
 *   rejected 已拒绝（红，附 notes）
 */

import { fallbackEnumLabel } from "@/lib/i18n-labels";

export interface Withdrawal {
  id: string;
  amount_cents: number;
  status: "pending" | "paid" | "rejected";
  notes?: string;
  created_at: string;
  paid_at?: string;
}

type Locale = "zh" | "en";

export function WithdrawalList({
  items,
  locale = "zh",
}: {
  items: Withdrawal[];
  locale?: Locale;
}) {
  const copy =
    locale === "zh"
      ? {
          empty: "还没有权益申请记录",
          appliedAt: "申请于",
          paidAt: "到账",
        }
      : {
          empty: "No access request records yet",
          appliedAt: "Requested at",
          paidAt: "Paid at",
        };

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{copy.empty}</p>;
  }

  return (
    <ul className="divide-y">
      {items.map((w) => (
        <li key={w.id} className="flex items-center justify-between py-3">
          <div>
            <div className="font-medium">
              ${(w.amount_cents / 100).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              {copy.appliedAt}{" "}
              {new Date(w.created_at).toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}
              {w.paid_at
                ? ` · ${copy.paidAt} ${new Date(w.paid_at).toLocaleString(
                    locale === "zh" ? "zh-CN" : "en-US",
                  )}`
                : ""}
              {w.notes ? ` · ${w.notes}` : ""}
            </div>
          </div>
          <StatusBadge locale={locale} status={w.status} />
        </li>
      ))}
    </ul>
  );
}

function StatusBadge({
  status,
  locale,
}: {
  status: Withdrawal["status"];
  locale: Locale;
}) {
  const map: Record<
    Withdrawal["status"],
    { label: string; className: string }
  > = {
    pending: {
      label: locale === "zh" ? "审核中" : "In review",
      className: "bg-yellow-100 text-yellow-700",
    },
    paid: {
      label: locale === "zh" ? "已到账" : "Paid",
      className: "bg-green-100 text-green-700",
    },
    rejected: {
      label: locale === "zh" ? "已拒绝" : "Rejected",
      className: "bg-red-100 text-red-700",
    },
  };
  const c = map[status] ?? { label: fallbackEnumLabel(status, locale), className: "bg-gray-100" };
  return (
    <span
      className={`rounded px-2 py-1 text-xs font-semibold ${c.className}`}
    >
      {c.label}
    </span>
  );
}
