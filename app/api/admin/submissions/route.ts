import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { UpdateSubmissionRequest } from '@/types';

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, payment_status, admin_notes }: UpdateSubmissionRequest = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' }, 
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['pending', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' }, 
        { status: 400 }
      );
    }

    // Validate payment_status if provided
    if (payment_status && !['free', 'paid_single', 'paid_bundle'].includes(payment_status)) {
      return NextResponse.json(
        { error: 'Invalid payment_status value' }, 
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };
    
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    
    const { data, error } = await supabase
      .from('submissions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update submission' }, 
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Submission not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      submission: data 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
