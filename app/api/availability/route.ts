import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Availability from '@/models/Availability';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const vehicleId = searchParams.get('vehicleId');
  const exportMode = searchParams.get('export');

  let filter: any = {};
  if (start && end) {
    filter.start = { $gte: new Date(start), $lte: new Date(end) };
  }
  if (vehicleId && vehicleId !== 'all') {
    filter.vehicleId = vehicleId;
  }

  // Admin can see all; drivers & customers see only available or their own assigned? For simplicity, we show all events.
  // If you want role-based filtering, add logic here.

  const events = await Availability.find(filter).sort({ start: 1 });

  // Export to CSV
  if (exportMode === 'true') {
    const csvRows = [['Title', 'Start', 'End', 'VehicleId', 'DriverId', 'Status', 'Notes']];
    for (const e of events) {
      csvRows.push([
        e.title,
        e.start.toISOString(),
        e.end.toISOString(),
        e.vehicleId,
        e.driverId || '',
        e.status,
        e.notes || '',
      ]);
    }
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=availability_${new Date().toISOString().slice(0,10)}.csv`,
      },
    });
  }

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  // Only admin can create events
  if (payload.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, start, end, status, vehicleId, driverId, notes } = body;
    if (!title || !start || !end || !vehicleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await connectToDatabase();
    const newEvent = await Availability.create({
      title,
      start,
      end,
      status,
      vehicleId,
      driverId: driverId || null,
      notes: notes || '',
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err: any) {
    console.error('POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}