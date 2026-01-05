import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="container flex-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
            <Card style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
                    돌아오신 것을 환영합니다!
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    계정에 로그인하여 학습을 이어가세요.
                </p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input label="이메일" type="email" placeholder="example@email.com" />
                    <Input label="비밀번호" type="password" placeholder="••••••••" />

                    <Button type="submit" fullWidth size="lg" style={{ marginTop: '12px' }}>
                        로그인
                    </Button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    계정이 없으신가요? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>회원가입</Link>
                </div>
            </Card>
        </div>
    );
}
