export type Category = 'Adventure' | 'Nature' | 'Wildlife' | 'Culture' | 'Waterfall' | 'Viewpoint';

export type Spot = {
  name: string;
  category: Category;
  placeId: string;
  timings: string;
  price: string;
  priceNote: string;
  mapsUrl: string;
  website: string;
  tip: string;
  isNew: boolean;
  googleRating?: number;
  reviewCount?: number;
};

export type DistrictData = {
  district: string;
  state: string;
  tagline: string;
  bestTime: string;
  idealDays: string;
  heroColor: string;
  productSlug: string;
  spots: Spot[];
};
