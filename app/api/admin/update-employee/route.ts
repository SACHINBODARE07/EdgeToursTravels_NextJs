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
    userId,
    email,
    mobileNumber,
    name,
    role,
    driverDetails,
    fullName,
    gender,
    presentAddress,
    permanentAddress,
    alternateMobile,
    aadhar,
    dob,
    pan,
    yearsOfExperience,
    highestQualification,
    previousExperience
  } = body;
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Check for email/mobile conflicts with other users
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }
  
  if (mobileNumber && mobileNumber !== user.mobileNumber) {
    const existingMobile = await User.findOne({ mobileNumber, _id: { $ne: userId } });
    if (existingMobile) return NextResponse.json({ error: 'Mobile number already exists' }, { status: 400 });
  }
  
  // Update basic fields
  if (email) user.email = email;
  if (mobileNumber) user.mobileNumber = mobileNumber;
  if (name) user.name = name;
  if (role && ['employee', 'driver'].includes(role)) user.role = role;
  
  // Update role-specific details
  if (role === 'driver' && driverDetails) {
    user.driverDetails = { ...user.driverDetails, ...driverDetails };
  } else if (role === 'employee') {
    const employeeDetails = {
      fullName: fullName || user.employeeDetails?.fullName,
      mobile: mobileNumber || user.employeeDetails?.mobile,
      gender: gender || user.employeeDetails?.gender,
      presentAddress: presentAddress || user.employeeDetails?.presentAddress,
      permanentAddress: permanentAddress || user.employeeDetails?.permanentAddress,
      alternateMobile: alternateMobile !== undefined ? alternateMobile : user.employeeDetails?.alternateMobile,
      aadhar: aadhar || user.employeeDetails?.aadhar,
      dob: dob ? new Date(dob) : user.employeeDetails?.dob,
      pan: pan || user.employeeDetails?.pan,
      email: email || user.employeeDetails?.email,
      yearsOfExperience: yearsOfExperience !== undefined ? Number(yearsOfExperience) : user.employeeDetails?.yearsOfExperience,
      highestQualification: highestQualification || user.employeeDetails?.highestQualification,
      previousExperience: previousExperience !== undefined ? previousExperience : user.employeeDetails?.previousExperience
    };
    user.employeeDetails = employeeDetails;
    user.profileCompleted = true;
  }
  
  await user.save();
  
  return NextResponse.json({ 
    message: 'User updated successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      driverDetails: user.driverDetails,
      employeeDetails: user.employeeDetails,
      profileCompleted: user.profileCompleted
    }
  });
}