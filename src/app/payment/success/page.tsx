import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="container flex-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
            <Card style={{ textAlign: 'center', padding: '60px', maxWidth: '500px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🎉</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>결제가 완료되었습니다!</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
                    수강 신청이 정상적으로 처리되었습니다.<br />
                    지금 바로 강의를 시작해보세요.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/dashboard">
                        <Button size="lg">내 강의실로 이동</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="lg">홈으로 돌아가기</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
