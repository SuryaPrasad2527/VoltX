import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: 'Classic' | 'Zero Sugar' | 'High-Volt' | 'Variety Pack';
  flavour: string;
  size: string;
  SKU: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  caffeineMg?: number;
  calories?: number;
  rating?: number;
  numReviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ['Classic', 'Zero Sugar', 'High-Volt', 'Variety Pack'],
      index: true,
    },
    flavour: { type: String, required: true },
    size: { type: String, required: true, default: '500ml Can' },
    SKU: { type: String, required: true, unique: true, index: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    caffeineMg: { type: Number, default: 160 },
    calories: { type: Number, default: 10 },
    rating: { type: Number, default: 5.0 },
    numReviews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
