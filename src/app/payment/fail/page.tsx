import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function FailPage() {
    return (
        <div className="container flex-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
            <Card style={{ textAlign: 'center', padding: '60px', maxWidth: '500px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px' }}>⚠️</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>결제에 실패했습니다</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
                    결제 진행 중 문제가 발생했습니다.<br />
                    잠시 후 다시 시도해주세요.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/payment/checkout">
                        <Button size="lg">다시 시도하기</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="lg">홈으로 돌아가기</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
