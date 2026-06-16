import Button from "../ui/Button";
import SurfaceCard from "../ui/SurfaceCard";

const ReportFilters = ({
  filters,
  onChange,
  onReset,
  showCustomerType = false,
  showLeadSource = false,
}) => (
  <SurfaceCard className="p-4 sm:p-6">
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          From
        </span>
        <input
          type="date"
          value={filters.from}
          onChange={(event) =>
            onChange(
              "from",
              event.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          To
        </span>
        <input
          type="date"
          value={filters.to}
          onChange={(event) =>
            onChange(
              "to",
              event.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
        />
      </label>

      {showCustomerType ? (
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Customer Type
          </span>
          <select
            value={filters.customerType}
            onChange={(event) =>
              onChange(
                "customerType",
                event.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="">
              All Types
            </option>
            <option value="REGULAR">
              Regular
            </option>
            <option value="WHOLESALE">
              Wholesale
            </option>
            <option value="VIP">
              VIP
            </option>
          </select>
        </label>
      ) : null}

      {showLeadSource ? (
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Lead Source
          </span>
          <select
            value={filters.leadSource}
            onChange={(event) =>
              onChange(
                "leadSource",
                event.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="">
              All Sources
            </option>
            <option value="WEBSITE">
              Website
            </option>
            <option value="FACEBOOK">
              Facebook
            </option>
            <option value="INSTAGRAM">
              Instagram
            </option>
            <option value="WHATSAPP">
              WhatsApp
            </option>
            <option value="REFERRAL">
              Referral
            </option>
            <option value="WALK_IN">
              Walk In
            </option>
            <option value="TRADE_SHOW">
              Trade Show
            </option>
            <option value="EXISTING_CUSTOMER">
              Existing Customer
            </option>
            <option value="OTHER">
              Other
            </option>
          </select>
        </label>
      ) : null}

      <div className="flex items-end">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onReset}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  </SurfaceCard>
);

export default ReportFilters;
