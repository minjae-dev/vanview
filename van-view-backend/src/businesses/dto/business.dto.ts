export type Address = {
  unit?: string | null;
  house?: string | null;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  region?: string | null;
  postal_code?: string | null;
  country?: string | null;
  local_area?: string | null;
};

export type Geo = {
  lat: number;
  lng: number;
};

export type HeadcountRange = '1-5' | '6-20' | '21-50' | '50+';
export type Status = 'active' | 'inactive';

export type BusinessDto = {
  id: string;
  name: string;
  category: string;
  address: Address;
  geo: Geo;
  headcount_range: HeadcountRange;
  status: Status;
  created_at: string; // or Date
  updated_at: string; // or Date
};
