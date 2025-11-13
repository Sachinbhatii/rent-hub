export interface Apartment {
  id?: number;
  title: string;
  location: string;
  price: number;
  amenities: string[];
  furnished: boolean;
  vegetarian: boolean;
  description: string;
  image?: string;
}
