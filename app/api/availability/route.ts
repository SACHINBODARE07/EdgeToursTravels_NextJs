import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Availability from '@/models/Availability';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  let query = {};
  if (start && end) {
    query = {
      $or: [
        { start: { $gte: new Date(start), $lte: new Date(end) } },
        { end: { $gte: new Date(start), $lte: new Date(end) } },
      ],
    };
  }

  const events = await Availability.find(query).sort({ start: 1 });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const event = await Availability.create(body);
  return NextResponse.json(event, { status: 201 });
}