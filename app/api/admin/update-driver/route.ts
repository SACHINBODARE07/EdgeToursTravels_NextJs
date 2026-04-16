import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAdmin, unauthorizedResponse, forbiddenResponse } from '@/lib/admin-auth';

export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return unauthorizedResponse();
  if (admin.role !== 'admin') return forbiddenResponse();

  await connectToDatabase();
  const body = await req.json();
  const {
    driverId,
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
    ifscCode
  } = body;

  if (!driverId) {
    return NextResponse.json({ error: 'Driver ID is required' }, { status: 400 });
  }

  const driver = await User.findById(driverId);
  if (!driver || driver.role !== 'driver') {
    return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
  }

  // Check for email/mobile conflicts with other users
  if (email && email !== driver.email) {
    const existingEmail = await User.findOne({ email, _id: { $ne: driverId } });
    if (existingEmail) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }

  if (mobileNumber && mobileNumber !== driver.mobileNumber) {
    const existingMobile = await User.findOne({ mobileNumber, _id: { $ne: driverId } });
    if (existingMobile) return NextResponse.json({ error: 'Mobile number already exists' }, { status: 400 });
  }

  // Update basic fields
  if (email) driver.email = email;
  if (mobileNumber) driver.mobileNumber = mobileNumber;
  if (name) driver.name = name;

  // Update driver details
  const driverDetails = {
    fullName: fullName || driver.driverDetails?.fullName,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : driver.driverDetails?.dateOfBirth,
    drivingLicenseNumber: drivingLicenseNumber || driver.driverDetails?.drivingLicenseNumber,
    dlExpiryDate: dlExpiryDate ? new Date(dlExpiryDate) : driver.driverDetails?.dlExpiryDate,
    vehicleRegNumber: vehicleRegNumber || driver.driverDetails?.vehicleRegNumber,
    vehicleType: vehicleType || driver.driverDetails?.vehicleType || 'car',
    vehicleMake: vehicleMake !== undefined ? vehicleMake : driver.driverDetails?.vehicleMake,
    vehicleModel: vehicleModel !== undefined ? vehicleModel : driver.driverDetails?.vehicleModel,
    vehicleYear: vehicleYear !== undefined ? parseInt(vehicleYear.toString()) : driver.driverDetails?.vehicleYear,
    accountHolderName: accountHolderName || driver.driverDetails?.accountHolderName,
    bankName: bankName || driver.driverDetails?.bankName,
    accountNumber: accountNumber || driver.driverDetails?.accountNumber,
    ifscCode: ifscCode || driver.driverDetails?.ifscCode,
    kycStatus: driver.driverDetails?.kycStatus || 'pending'
  };

  driver.driverDetails = driverDetails;
  await driver.save();

  return NextResponse.json({
    message: 'Driver updated successfully',
    driver: {
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      mobileNumber: driver.mobileNumber,
      role: driver.role,
      driverDetails: driver.driverDetails
    }
  });
}