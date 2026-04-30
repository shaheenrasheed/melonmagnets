import { formatReviewCount } from '../../lib/places';

interface Props {
  rating?: number;
  reviewCount?: number;
}

export function RatingBadge({ rating, reviewCount }: Props) {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5C518" aria-hidden="true">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
      <span className="text-sm font-semibold text-gray-800">{rating}</span>
      {reviewCount ? (
        <span className="text-xs text-gray-400">({formatReviewCount(reviewCount)})</span>
      ) : null}
    </div>
  );
}
