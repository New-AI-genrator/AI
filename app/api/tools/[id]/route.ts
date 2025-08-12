import { NextResponse } from 'next/server';
import { getToolById } from '@/lib/tools';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tool = await getToolById(params.id);
    
    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: tool });
    
  } catch (error) {
    console.error(`Error fetching tool ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
}
