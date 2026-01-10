"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const courseId = searchParams.get('courseId');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!paymentKey || !orderId || !amount) {
            setStatus('error');
            setMessage('결제 정보가 올바르지 않습니다.');
            return;
        }

        // Call our API to confirm the payment
        async function confirmPayment() {
            try {
                const response = await fetch('/api/payments/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentKey, orderId, amount, courseId }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(data.error || '결제 승인 중 오류가 발생했습니다.');
                }
            } catch (error) {
                console.error(error);
                setStatus('error');
                setMessage('서버 통신 중 오류가 발생했습니다.');
            }
        }

        confirmPayment();
    }, [paymentKey, orderId, amount, courseId]);

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <Card style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center' }}>
                {status === 'loading' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>결제 승인 중...</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>잠시만 기다려주세요.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <CheckCircle size={64} color="#22c55e" />
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>결제 성공!</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>주문이 성공적으로 처리되었습니다.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px', marginTop: '12px' }}>
                            <Link href="/dashboard" style={{ width: '100%' }}>
                                <Button fullWidth size="lg">내 강의실로 이동</Button>
                            </Link>
                            <Link href="/courses" style={{ width: '100%' }}>
                                <Button variant="ghost" fullWidth>쇼핑 계속하기</Button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <XCircle size={64} color="#ef4444" />
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>결제 실패</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px', marginTop: '12px' }}>
                            <Button fullWidth onClick={() => router.push('/payment/checkout')}>다시 시도하기</Button>
                            <Link href="/" style={{ width: '100%' }}>
                                <Button variant="ghost" fullWidth>홈으로 돌아가기</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
