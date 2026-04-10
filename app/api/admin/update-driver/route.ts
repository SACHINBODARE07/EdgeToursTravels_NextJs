import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, driverDetails } = await request.json();
    if (!userId || !driverDetails) {
      return NextResponse.json({ error: 'Missing userId or driverDetails' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.role !== 'driver') {
      return NextResponse.json({ error: 'User is not a driver' }, { status: 400 });
    }

    // Merge updated fields
    user.driverDetails = { ...(user.driverDetails || {}), ...driverDetails };
    await user.save();

    return NextResponse.json({ success: true, driverDetails: user.driverDetails });
  } catch (error) {
    console.error('Update driver error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}