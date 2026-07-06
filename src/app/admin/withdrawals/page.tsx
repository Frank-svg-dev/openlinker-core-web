import { Icon } from "@/components/ui/icon";
import { apiFetchAuthed, localizedErrorMessage } from "@/lib/api";

import { payWithdrawalAction, rejectWithdrawalAction } from "../actions";
import {
  ADMIN_PAGE_SIZE,
  AdminShell,
  type AdminSearchParams,
  EmptyState,
  ErrorBox,
  ForbiddenAdmin,
  Pagination,
  type WithdrawalListResponse,
  adminStatusLabel,
  adminCopy,
  buildQuery,
  formatDate,
  formatNumber,
  formatUsd,
  getAdminContext,
  offsetForPage,
  pageFromParams,
  pageHref,
  shortID,
  statusChip,
} from "../_components/shared";

function messageFromError(error: unknown, locale: "zh" | "en", fallback: string): string {
  return localizedErrorMessage(error, locale, fallback);
}

async function loadWithdrawals(page: number, locale: "zh" | "en") {
  const withdrawalsPath = `/api/v1/admin/withdrawals/pending${buildQuery({
    limit: ADMIN_PAGE_SIZE,
    offset: offsetForPage(page),
  })}`;
  try {
    const payload = await apiFetchAuthed<WithdrawalListResponse>(withdrawalsPath, { cache: "no-store" });
    return {
      withdrawals: {
        ...payload,
        items: payload.items ?? [],
      },
      error: null,
    };
  } catch (error) {
    return {
      withdrawals: { items: [], total: 0, limit: ADMIN_PAGE_SIZE, offset: offsetForPage(page) },
      error: messageFromError(
        error,
        locale,
        locale === "zh" ? "提现列表加载失败" : "Failed to load withdrawal list",
      ),
    };
  }
}

export default async function AdminWithdrawalsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const params = await searchParams;
  const page = pageFromParams(params);
  const { locale, me } = await getAdminContext(`/admin/withdrawals${buildQuery(params)}`);
  if (!me?.is_admin) return <ForbiddenAdmin locale={locale} />;

  const copy = adminCopy(locale);
  const { withdrawals, error } = await loadWithdrawals(page, locale);
  const returnTo = pageHref("/admin/withdrawals", params, page);

  return (
    <AdminShell active="withdrawals" locale={locale} status={params.status} error={params.error}>
      <section className="ol-panel ol-panel-pad mt-6">
        <div className="ol-panel-head">
          <div>
            <strong>{copy.withdrawals}</strong>
            <p>
              {formatNumber(withdrawals.total)} {copy.pending}
            </p>
          </div>
        </div>

        {error ? <ErrorBox message={error} /> : null}
        {!error && withdrawals.items.length === 0 ? (
          <EmptyState title={copy.noWithdrawals} body={copy.noWithdrawalsBody} />
        ) : null}
        {!error && withdrawals.items.length > 0 ? (
          <>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[1080px] border-separate border-spacing-y-2 text-left text-[13px]">
                <thead className="text-[11px] uppercase text-[color:var(--ol-muted)]">
                  <tr>
                    <th className="px-3 py-2">{copy.withdrawalCol}</th>
                    <th className="px-3 py-2">{copy.creatorCol}</th>
                    <th className="px-3 py-2">{copy.amountCol}</th>
                    <th className="px-3 py-2">{copy.stateCol}</th>
                    <th className="px-3 py-2">{copy.notesCol}</th>
                    <th className="px-3 py-2">{copy.actionCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.items.map((item) => (
                    <tr key={item.id} className="bg-white align-top shadow-sm">
                      <td className="rounded-l-2xl border-y border-l border-[color:var(--ol-line)] px-3 py-3">
                        <div className="font-mono text-[12px] text-[color:var(--ol-ink)]" title={item.id}>
                          {shortID(item.id)}
                        </div>
                        <div className="mt-1 text-[12px] text-[color:var(--ol-muted)]">
                          {formatDate(item.created_at, locale)}
                        </div>
                      </td>
                      <td className="border-y border-[color:var(--ol-line)] px-3 py-3 font-mono text-[12px] text-[color:var(--ol-muted)]">
                        <span title={item.creator_id}>{shortID(item.creator_id)}</span>
                      </td>
                      <td className="border-y border-[color:var(--ol-line)] px-3 py-3 font-black text-[color:var(--ol-ink)]">
                        {formatUsd(item.amount_cents)}
                      </td>
                      <td className="border-y border-[color:var(--ol-line)] px-3 py-3">
                        <span className={statusChip(item.status)}>{adminStatusLabel(item.status, locale)}</span>
                      </td>
                      <td className="max-w-[220px] border-y border-[color:var(--ol-line)] px-3 py-3 text-[color:var(--ol-muted)]">
                        {item.notes || "-"}
                      </td>
                      <td className="rounded-r-2xl border-y border-r border-[color:var(--ol-line)] px-3 py-3">
                        <div className="grid min-w-[380px] gap-2">
                          <form action={payWithdrawalAction} className="flex gap-2">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="return_to" value={returnTo} />
                            <input
                              name="notes"
                              maxLength={500}
                              placeholder={copy.notesPlaceholder}
                              className="h-9 min-w-0 flex-1 rounded-xl border border-[color:var(--ol-line)] bg-white px-3 text-[12px] outline-none focus:border-[color:var(--ol-primary)]"
                            />
                            <button className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-[color:var(--ol-primary)] px-3 text-[12px] font-black text-white">
                              <Icon name="check" size="sm" />
                              {copy.markPaid}
                            </button>
                          </form>
                          <form action={rejectWithdrawalAction} className="flex gap-2">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="return_to" value={returnTo} />
                            <input
                              required
                              name="reason"
                              maxLength={500}
                              placeholder={copy.reasonPlaceholder}
                              className="h-9 min-w-0 flex-1 rounded-xl border border-[color:var(--ol-line)] bg-white px-3 text-[12px] outline-none focus:border-rose-500"
                            />
                            <button className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[12px] font-black text-rose-700">
                              <Icon name="x" size="sm" />
                              {copy.reject}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              path="/admin/withdrawals"
              params={params}
              page={page}
              total={withdrawals.total}
              limit={withdrawals.limit}
              locale={locale}
            />
          </>
        ) : null}
      </section>
    </AdminShell>
  );
}
