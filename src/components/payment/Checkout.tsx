"use client";

import { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { loadTossPayments } from '@tosspayments/payment-sdk';

const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq"; // Test Key
const customerKey = "YbX2HuSlsC9uVJW6NMRMj";

export function Checkout({ price }: { price: number }) {
    const [tossPayments, setTossPayments] = useState<any>(null);

    useEffect(() => {
        (async () => {
            try {
                const loadedTossPayments = await loadTossPayments(clientKey);
                setTossPayments(loadedTossPayments);
            } catch (error) {
                console.error("Error loading Toss Payments:", error);
            }
        })();
    }, []);

    const handlePayment = async () => {
        if (!tossPayments) return;

        try {
            await tossPayments.requestPayment('카드', {
                amount: price,
                orderId: Math.random().toString(36).slice(2),
                orderName: "2026 풀스택 마스터 클래스",
                customerName: "김토스", // In real app, use user info
                customerEmail: "customer123@gmail.com",
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });
        } catch (error) {
            console.error('Payment Error:', error);
        }
    };

    return (
        <Card style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>결제하기</h2>

            <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>상품명</span>
                    <span style={{ fontWeight: 600 }}>2026 풀스택 마스터 클래스</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>결제 금액</span>
                    <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>{price.toLocaleString()}원</span>
                </div>
            </div>

            <Button
                fullWidth
                size="lg"
                onClick={handlePayment}
                disabled={!tossPayments}
            >
                {tossPayments ? '결제하기' : '결제 모듈 로딩 중...'}
            </Button>
            <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                * 테스트 결제로 실제 비용이 청구되지 않습니다.
            </p>
        </Card>
    );
}
