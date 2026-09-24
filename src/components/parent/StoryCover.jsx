// Ảnh bìa truyện. Khi chưa có ảnh thật từ BE thì hiển thị gradient + emoji minh họa.
function StoryCover({ cover, emoji, gradient, alt, className = "", children }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {cover ? (
        <img src={cover} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className={`grid h-full w-full place-items-center bg-gradient-to-br ${gradient}`}>
          <span className="text-7xl drop-shadow-lg select-none" role="img" aria-label={alt}>
            {emoji}
          </span>
          <span className="absolute top-4 left-6 text-lg text-white/80">✦</span>
          <span className="absolute right-8 bottom-10 text-sm text-white/70">✦</span>
          <span className="absolute top-10 right-12 text-xs text-white/60">✦</span>
        </div>
      )}
      {children}
    </div>
  );
}

export default StoryCover;
