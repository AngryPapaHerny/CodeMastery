import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function MentoringPage() {
    return (
        <div className="container flex-center" style={{ minHeight: 'calc(100vh - 160px)', flexDirection: 'column', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>
                <span className="text-gradient">1:1 멘토링</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px' }}>
                현업 개발자와 직접 소통하며 고민을 해결하세요.<br />
                서비스 준비 중입니다. 조금만 기다려주세요!
            </p>
            <Link href="/">
                <Button variant="outline" size="lg">홈으로 돌아가기</Button>
            </Link>
        </div>
    );
}
