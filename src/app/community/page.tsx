import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function CommunityPage() {
    return (
        <div className="container flex-center" style={{ minHeight: 'calc(100vh - 160px)', flexDirection: 'column', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>
                개발자 <span className="text-gradient">커뮤니티</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px' }}>
                함께 성장하는 동료들을 만나보세요.<br />
                서비스 준비 중입니다. 조금만 기다려주세요!
            </p>
            <Link href="/">
                <Button variant="outline" size="lg">홈으로 돌아가기</Button>
            </Link>
        </div>
    );
}
