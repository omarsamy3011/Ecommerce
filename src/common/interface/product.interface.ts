import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  brand?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
