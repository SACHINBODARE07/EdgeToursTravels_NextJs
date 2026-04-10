import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Availability from '@/models/Availability';

// GET a single availability event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const event = await Availability.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error('GET availability error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// UPDATE an availability event by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const { id } = await params;
  const body = await request.json();

  try {
    const updatedEvent = await Availability.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('PUT availability error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE an availability event by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const deletedEvent = await Availability.findByIdAndDelete(id);
    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE availability error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}