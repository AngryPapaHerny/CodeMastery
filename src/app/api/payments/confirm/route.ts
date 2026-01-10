import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// TEST SECRET KEY (In production, use process.env.TOSS_PAYMENTS_SECRET_KEY)
// This is a common public test key. If it fails, we need the specific one matching the client key.
const TOSS_SECRET_KEY = "test_sk_zXLkKEypNArWmo50n37r3lmeAxEx";

export async function POST(req: NextRequest) {
    const { paymentKey, orderId, amount, courseId } = await req.json();

    // 1. Verify payment with Toss Payments Server
    const widgetSecretKey = TOSS_SECRET_KEY;
    const encryptedSecretKey = Buffer.from(`${widgetSecretKey}:`).toString('base64');

    try {
        const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${encryptedSecretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Payment Confirm Error:', data);
            return NextResponse.json({ error: data.message || 'Payment confirmation failed' }, { status: response.status });
        }

        // 2. Save to Database (Supabase)
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        const { error: dbError } = await supabase
            .from('payments')
            .insert({
                order_id: orderId,
                payment_key: paymentKey,
                amount: Number(amount),
                status: 'DONE',
                user_id: user?.id || null,
                receipt_url: data.receipt?.url || null
            });

        if (dbError) {
            console.error('DB Save Error:', dbError);
        }

        // 3. Enroll User (if courseId provided)
        if (courseId && user) {
            const { error: enrollError } = await supabase
                .from('enrollments')
                .insert({
                    user_id: user.id,
                    course_id: courseId
                });

            if (enrollError) {
                // Ignore unique constraint error if already enrolled
                if (enrollError.code !== '23505') {
                    console.error('Enrollment Error:', enrollError);
                }
            }
        }

        return NextResponse.json({ status: 'success', data });

    } catch (error: any) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
