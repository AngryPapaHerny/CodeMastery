"use client";

import { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq"; // Test Key
const customerKey = "YbX2HuSlsC9uVJW6NMRMj";

export function Checkout({ price }: { price: number }) {
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
    const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance['renderPaymentMethods']> | null>(null);
    const [currentPrice] = useState(price);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            // Prevent double initialization
            if (paymentWidgetRef.current) return;

            try {
                const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

                const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                    "#payment-widget",
                    { value: currentPrice },
                    { variantKey: "DEFAULT" } // Apply default styling if needed
                );

                paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

                paymentWidgetRef.current = paymentWidget;
                paymentMethodsWidgetRef.current = paymentMethodsWidget;

                // Allow some time for the iframe to initialize
                setReady(true);
            } catch (error) {
                console.error("Error loading payment widget:", error);
            }
        })();
    }, [currentPrice]);

    const handlePayment = async () => {
        const paymentWidget = paymentWidgetRef.current;
        if (!paymentWidget || !ready) return;

        try {
            await paymentWidget.requestPayment({
                orderId: Math.random().toString(36).slice(2),
                orderName: "2026 풀스택 마스터 클래스",
                customerName: "김토스", // In real app, use user info
                customerEmail: "customer123@gmail.com",
                customerMobilePhone: "01012345678",
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>결제하기</h2>
            <div id="payment-widget" style={{ width: '100%' }} />
            <div id="agreement" style={{ width: '100%' }} />
            <Button
                fullWidth
                size="lg"
                style={{ marginTop: '24px' }}
                onClick={handlePayment}
                disabled={!ready}
            >
                {ready ? `${price.toLocaleString()}원 결제하기` : '결제 모듈 로딩 중...'}
            </Button>
        </Card>
    );
}
