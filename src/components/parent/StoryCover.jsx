import { useState } from "react";
import { CASEL_COVER, NEUTRAL_COVER } from "../../constants/casel";

const SIZES = {
  sm: { icon: 26, title: "text-xs", pad: "p-2", sparkles: false },
  md: { icon: 60, title: "text-lg", pad: "p-4", sparkles: true },
  lg: { icon: 88, title: "text-2xl", pad: "p-5", sparkles: true },
};

/**
 * Ảnh bìa truyện. `cover` = { imageUrl, competency } của BE: ảnh là tranh một cảnh của truyện (vuông, không chữ).
 * Chưa có ảnh / ảnh lỗi → nền + biểu tượng theo năng lực CASEL (không có năng lực → màu trung tính).
 * Tên truyện luôn do giao diện vẽ (bật `showTitle`), không bao giờ nằm trong ảnh.
 */
function StoryCover({ cover, title, subtitle, showTitle = false, size = "md", zoomOnHover = false, className = "", children }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const s = SIZES[size] ?? SIZES.md;
  const imageUrl = typeof cover === "string" ? cover : cover?.imageUrl;
  const competency = typeof cover === "string" ? null : cover?.competency;
  const showImage = !!imageUrl && failedUrl !== imageUrl;
  const palette = CASEL_COVER[competency] ?? NEUTRAL_COVER;
  const Icon = palette.icon;
  const zoom = zoomOnHover ? "transition-transform duration-500 group-hover:scale-105" : "";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showImage ? (
        <>
          <img
            src={imageUrl}
            alt={title ?? ""}
            loading="lazy"
            onError={() => setFailedUrl(imageUrl)}
            className={`h-full w-full object-cover ${zoom}`}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        </>
      ) : (
        <div
          role="img"
          aria-label={title ?? "Bìa truyện"}
          className={`grid h-full w-full place-items-center bg-gradient-to-br ${palette.gradient} ${zoom}`}
        >
          <Icon size={s.icon} strokeWidth={1.75} className={`${palette.tone} opacity-80 drop-shadow-sm`} aria-hidden="true" />
          {s.sparkles && (
            <>
              <span className="absolute top-4 left-6 text-lg text-white/90" aria-hidden="true">✦</span>
              <span className="absolute right-8 bottom-10 text-sm text-white/80" aria-hidden="true">✦</span>
              <span className="absolute top-10 right-12 text-xs text-white/70" aria-hidden="true">✦</span>
            </>
          )}
        </div>
      )}
      {showTitle && title && (
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 ${s.pad}`}>
          <p
            className={`line-clamp-2 font-display leading-tight font-bold ${s.title} ${
              showImage ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" : "text-navy"
            }`}
          >
            {title}
          </p>
          {subtitle && (
            <p className={`mt-0.5 line-clamp-1 text-xs font-semibold ${showImage ? "text-white/85" : "text-navy/65"}`}>{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default StoryCover;
