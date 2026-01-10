"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { Suspense } from 'react';

function FailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const message = searchParams.get('message') || '결제가 취소되었거나 승인되지 않았습니다.';
    const code = searchParams.get('code');

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <Card style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <AlertTriangle size={64} color="#f59e0b" />
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>결제 실패</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{message}</p>
                        {code && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Code: {code}</p>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px', marginTop: '12px' }}>
                        <Button fullWidth size="lg" onClick={() => router.back()}>다시 결제하기</Button>
                        <Button variant="ghost" fullWidth onClick={() => router.push('/')}>홈으로 돌아가기</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default function PaymentFailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FailContent />
        </Suspense>
    );
}
