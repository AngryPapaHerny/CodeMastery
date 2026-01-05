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
    // Default values to avoid null
    const [currentPrice] = useState(price);

    useEffect(() => {
        (async () => {
            // Load the payment widget
            const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

            // Render payment methods
            const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                "#payment-widget",
                { value: currentPrice }
            );

            // Render agreement
            paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

            paymentWidgetRef.current = paymentWidget;
            paymentMethodsWidgetRef.current = paymentMethodsWidget;
        })();
    }, [currentPrice]);

    const handlePayment = async () => {
        const paymentWidget = paymentWidgetRef.current;
        if (!paymentWidget) return;

        try {
            await paymentWidget.requestPayment({
                orderId: Math.random().toString(36).slice(2),
                orderName: "2026 풀스택 마스터 클래스",
                customerName: "김토스",
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
            <div id="payment-widget" />
            <div id="agreement" />
            <Button
                fullWidth
                size="lg"
                style={{ marginTop: '24px' }}
                onClick={handlePayment}
            >
                {price.toLocaleString()}원 결제하기
            </Button>
        </Card>
    );
}
