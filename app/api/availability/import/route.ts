import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Availability from '@/models/Availability';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  if (payload.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const events = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',');
    const event: any = {};
    headers.forEach((header, idx) => {
      event[header] = values[idx]?.trim() || '';
    });
    if (!event.title || !event.start || !event.end || !event.vehicleid) continue;
    events.push({
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      vehicleId: event.vehicleid,
      driverId: event.driverid || null,
      status: event.status || 'available',
      notes: event.notes || '',
    });
  }

  if (events.length === 0) {
    return NextResponse.json({ error: 'No valid events to import' }, { status: 400 });
  }

  await connectToDatabase();
  await Availability.insertMany(events);
  return NextResponse.json({ message: `${events.length} events imported successfully` });
}