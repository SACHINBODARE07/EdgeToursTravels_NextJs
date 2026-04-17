import mongoose, { Schema, Document } from 'mongoose';

export interface IMasterDocument extends Document {
  key: string;         // e.g., 'aadhar_front'
  label: string;       // e.g., 'Aadhar Card (Front)'
  description: string; // e.g., 'Please upload a clear photo of the front of your Aadhar card'
  isRequired: boolean;
  isActive: boolean;
  category: 'driver' | 'employee' | 'vehicle';
  createdAt: Date;
  updatedAt: Date;
}

const MasterDocumentSchema = new Schema<IMasterDocument>({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  isRequired: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  category: { type: String, enum: ['driver', 'employee', 'vehicle'], default: 'driver' },
}, { timestamps: true });

export default mongoose.models.MasterDocument || mongoose.model<IMasterDocument>('MasterDocument', MasterDocumentSchema);
