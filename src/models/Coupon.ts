import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend?: number;
  isActive: boolean;
  expiresAt?: Date;
  usageCount: number;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountPercent: { type: Number, min: 1, max: 100 },
    discountAmount: { type: Number, min: 0 },
    minSpend: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    expiresAt: { type: Date },
    usageCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const CouponModel = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export interface IReview extends Document {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ReviewModel = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
