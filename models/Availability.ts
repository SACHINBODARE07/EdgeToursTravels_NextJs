import mongoose, { Schema, model, models } from 'mongoose';

const AvailabilitySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    vehicleId: {
      type: String,
      default: null,
    },
    driverId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'maintenance'],
      default: 'available',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default models.Availability || model('Availability', AvailabilitySchema);