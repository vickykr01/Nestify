function RatingStars({ rating = 0, size = "text-base", muted = false }) {
  const roundedRating = Math.round(Number(rating) || 0);

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${size} ${
        muted ? "text-slate-300" : "text-amber-500"
      }`}
      aria-label={`${roundedRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>{index < roundedRating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export default RatingStars;
