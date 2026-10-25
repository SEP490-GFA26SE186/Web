import { Check, Coins, Crown, Loader2 } from "lucide-react";
import CreditHistory from "../../../components/parent/billing/CreditHistory";
import PaymentHistory from "../../../components/parent/billing/PaymentHistory";
import { useCheckoutPlan, usePlans } from "../../../hooks/useBilling";
import { useParentProfile, useSubscription } from "../../../hooks/useParent";
import { useAiPricing } from "../../../hooks/useStudio";
import { AI_LENGTHS } from "../../../constants/story";
import { toast } from "../../../stores/toastStore";
import { formatNumber } from "../../../utils/format";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString("vi-VN") : null);

// Gói dịch vụ & credit (rev8): mỗi gói cấp credit hằng tháng; truyện AI tốn credit theo độ dài (GET /stories/ai-pricing). Trả qua payOS.
function BillingPage() {
  const { data: plans = [], isLoading } = usePlans();
  const { data: sub } = useSubscription();
  const pricing = useAiPricing();
  const { creditBalance } = useParentProfile();
  const checkout = useCheckoutPlan();
  const currentCode = sub?.plan?.code;

  // Giống BE (addMonths): cộng tháng theo lịch, giữ ngày (31/01 + 1 tháng → 28/02 hoặc 29/02)
  const extendDate = (date, months) => {
    const d = new Date(date);
    const day = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + months);
    d.setUTCDate(Math.min(day, new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()));
    return d;
  };

  const buy = (plan) =>
    checkout.mutate(plan.id, {
      onSuccess: ({ checkoutUrl }) => {
        if (checkoutUrl) window.location.assign(checkoutUrl); // sang trang thanh toán payOS
        else toast.success(`Đã chuyển sang ${plan.name}`);
      },
      onError: (err) => toast.error(err.message),
    });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl">Gói dịch vụ & Credit</h1>
        <p className="mt-1 text-navy/60">
          Mỗi truyện AI viết giúp dùng credit theo độ dài
          {pricing.data?.lengths?.length > 0 && (
            <>
              {" "}(
              {pricing.data.lengths
                .map((p) => `${AI_LENGTHS.find((l) => l.value === p.length)?.label ?? p.length} ${p.pages} trang: ${p.credits} credit`)
                .join(" · ")}
              )
            </>
          )}
          .{pricing.data?.images && ` Tranh AI: ${pricing.data.images.scene} credit mỗi cảnh, chân dung nhân vật ${pricing.data.images.characterPortrait} credit (dùng lại cho mọi truyện).`}{" "}
          Truyện tự viết không dùng credit. Credit được cấp mới mỗi tháng, phần còn dư không cộng dồn sang tháng sau.
        </p>
      </div>

      <div className="card flex flex-wrap items-center gap-6 p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-tint text-primary">
            <Crown size={24} />
          </span>
          <div>
            <p className="text-sm text-navy/60">Gói hiện tại</p>
            <p className="font-display text-xl font-bold">{sub?.plan?.name ?? "—"}</p>
            {sub?.periodEnd && <p className="text-sm text-navy/60">Đến {formatDate(sub.periodEnd)}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary-tint text-secondary-dark">
            <Coins size={24} />
          </span>
          <div>
            <p className="text-sm text-navy/60">Credit còn lại</p>
            <p className="font-display text-xl font-bold">{creditBalance ?? "—"}</p>
            {sub?.nextCreditGrantAt && <p className="text-sm text-navy/60">Cấp mới ngày {formatDate(sub.nextCreditGrantAt)}</p>}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-16">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const current = plan.code === currentCode;
            // Gói trả phí đang dùng: mua lại = gia hạn, cộng thêm thời hạn vào ngày hết hạn hiện tại
            const renewable = current && plan.priceVnd > 0;
            const busy = checkout.isPending && checkout.variables === plan.id;
            const features = [
              `${plan.creditsPerMonth} credit mỗi tháng (${plan.creditsPerMonth} truyện AI)`,
              `Tối đa ${plan.maxChildren} bé`,
              `Tối đa ${plan.maxCharacters} nhân vật`,
              plan.canSell ? "Được đăng bán truyện trên Chợ truyện" : "Chưa đăng bán truyện",
            ];
            return (
              <div key={plan.id} className={`card flex flex-col gap-4 p-6 ${current ? "border-2 border-primary" : ""}`}>
                <div>
                  <h2 className="text-xl">{plan.name}</h2>
                  <p className="mt-2 font-display text-3xl font-bold text-primary-dark">
                    {plan.priceVnd === 0 ? "0đ" : `${formatNumber(plan.priceVnd)}đ`}
                    <span className="text-base font-semibold text-navy/50"> / {plan.durationMonths === 12 ? "năm" : "tháng"}</span>
                  </p>
                </div>
                <ul className="flex-1 space-y-2 text-sm">
                  {features.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-secondary" /> {line}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => buy(plan)}
                  disabled={(current && !renewable) || checkout.isPending}
                  className="btn-primary justify-center disabled:opacity-60"
                >
                  {busy && <Loader2 size={18} className="animate-spin" />}
                  {renewable
                    ? `Gia hạn thêm ${plan.durationMonths === 12 ? "1 năm" : "1 tháng"}`
                    : current
                      ? "Đang dùng"
                      : plan.priceVnd === 0
                        ? "Chuyển về gói này"
                        : "Thanh toán qua payOS"}
                </button>
                {renewable && sub?.periodEnd && (
                  <p className="-mt-2 text-center text-xs text-navy/55">
                    Hết hạn mới: {formatDate(extendDate(sub.periodEnd, plan.durationMonths))} — không mất ngày còn lại
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
      <p className="text-xs text-navy/50">
        Thanh toán bằng chuyển khoản / quét mã VietQR qua payOS. Gói trả trước, gia hạn thủ công: gia hạn gói đang dùng thì cộng thêm thời hạn vào ngày hết hạn hiện tại. Đổi sang gói khác giữa kỳ: kỳ mới bắt đầu ngay, credit còn lại được giữ.
      </p>
      <PaymentHistory />
      <CreditHistory />
    </div>
  );
}

export default BillingPage;
