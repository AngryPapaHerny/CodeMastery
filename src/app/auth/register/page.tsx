import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="container flex-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
            <Card style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
                    회원가입
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    CodeMastery와 함께 성장을 시작하세요.
                </p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input label="이름" type="text" placeholder="홍길동" />
                    <Input label="이메일" type="email" placeholder="example@email.com" />
                    <Input label="비밀번호" type="password" placeholder="••••••••" />
                    <Input label="비밀번호 확인" type="password" placeholder="••••••••" />

                    <Button type="submit" fullWidth size="lg" style={{ marginTop: '12px' }}>
                        가입하기
                    </Button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    이미 계정이 있으신가요? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>로그인</Link>
                </div>
            </Card>
        </div>
    );
}
