import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAdmin, unauthorizedResponse, forbiddenResponse } from '@/lib/admin-auth';

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return unauthorizedResponse();
  if (admin.role !== 'admin') return forbiddenResponse();

  await connectToDatabase();
  const { driverId } = await req.json();

  if (!driverId) {
    return NextResponse.json({ error: 'Driver ID is required' }, { status: 400 });
  }

  const driver = await User.findById(driverId);
  if (!driver || driver.role !== 'driver') {
    return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
  }

  await driver.deleteOne();

  return NextResponse.json({ message: 'Driver deleted successfully' });
}