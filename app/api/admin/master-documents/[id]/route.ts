import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MasterDocument from '@/models/MasterDocument';
import { verifyAdmin, unauthorizedResponse, forbiddenResponse } from '@/lib/admin-auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await verifyAdmin(req);
    if (!admin) return unauthorizedResponse();
    if (admin.role !== 'admin') return forbiddenResponse();

    await connectToDatabase();
    const body = await req.json();
    const document = await MasterDocument.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(document);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await verifyAdmin(req);
    if (!admin) return unauthorizedResponse();
    if (admin.role !== 'admin') return forbiddenResponse();

    await connectToDatabase();
    await MasterDocument.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
