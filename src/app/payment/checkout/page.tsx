"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Checkout } from '@/components/payment/Checkout';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId') || undefined;
    const title = searchParams.get('title') || "2026 풀스택 마스터 클래스";

    // Parse price, default to 330,000 if not provided or invalid
    const priceParam = searchParams.get('price');
    const price = priceParam ? parseInt(priceParam, 10) : 330000;

    return (
        <div className="container" style={{ padding: '80px 20px', maxWidth: '800px' }}>
            <Checkout price={price} orderName={title} courseId={courseId} />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
