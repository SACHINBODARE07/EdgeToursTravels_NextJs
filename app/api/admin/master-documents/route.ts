import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MasterDocument from '@/models/MasterDocument';
import { verifyAdmin, unauthorizedResponse, forbiddenResponse } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return unauthorizedResponse();
    if (admin.role !== 'admin') return forbiddenResponse();

    await connectToDatabase();
    const category = req.nextUrl.searchParams.get('category');
    const filter = category ? { category } : {};
    const documents = await MasterDocument.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(documents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return unauthorizedResponse();
    if (admin.role !== 'admin') return forbiddenResponse();

    await connectToDatabase();
    const body = await req.json();
    const document = await MasterDocument.create(body);
    return NextResponse.json(document);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
