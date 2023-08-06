import { ProperType } from '@prisma/client';

export interface CreateHomeParams {
  address: string;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  city: string;
  price: number;
  land_size: number;
  propertyType: ProperType;
  images: { url: string }[];
}

export interface UpdateHomeParams {
  address?: string;
  number_of_bedrooms?: number;
  number_of_bathrooms?: number;
  city?: string;
  price?: number;
  land_size?: number;
  propertyType?: ProperType;
}
