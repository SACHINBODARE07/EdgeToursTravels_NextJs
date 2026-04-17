import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAdmin, unauthorizedResponse, forbiddenResponse } from '@/lib/admin-auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return unauthorizedResponse();
  if (admin.role !== 'admin') return forbiddenResponse();

  await connectToDatabase();
  const drivers = await User.find({ role: 'driver' })
    .select('-password')
    .sort({ createdAt: -1 });

  return NextResponse.json(drivers);
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return unauthorizedResponse();
  if (admin.role !== 'admin') return forbiddenResponse();

  await connectToDatabase();
  const body = await req.json();
  const {
    email,
    mobileNumber,
    name,
    fullName,
    dateOfBirth,
    drivingLicenseNumber,
    dlExpiryDate,
    vehicleRegNumber,
    vehicleType,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    accountHolderName,
    bankName,
    accountNumber,
    ifscCode,
    kycDocuments
  } = body;

  if (!email || !mobileNumber || !name) {
    return NextResponse.json({ error: 'Email, mobile number, and name are required' }, { status: 400 });
  }

  const existing = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (existing) return NextResponse.json({ error: 'Email or mobile number already exists' }, { status: 400 });

  const temporaryPassword = Math.random().toString(36).slice(-8) + 'D1!';
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

  const driverData: any = {
    email,
    mobileNumber,
    name,
    password: hashedPassword,
    role: 'driver',
    driverDetails: {
      fullName: fullName || name,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      drivingLicenseNumber,
      dlExpiryDate: dlExpiryDate ? new Date(dlExpiryDate) : undefined,
      vehicleRegNumber,
      vehicleType: vehicleType || 'car',
      vehicleMake,
      vehicleModel,
      vehicleYear: vehicleYear ? parseInt(vehicleYear.toString()) : undefined,
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      kycStatus: 'pending',
      kycDocuments: kycDocuments || {}
    }
  };

  const driver = await User.create(driverData);

  return NextResponse.json({
    message: 'Driver created successfully',
    driverId: driver._id,
    temporaryPassword
  }, { status: 201 });
}