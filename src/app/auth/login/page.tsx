"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            setError(signInError.message);
            setLoading(false);
        } else {
            // Success
            router.push('/dashboard');
            router.refresh(); // Refresh to update server components/middleware checks
        }
    };

    return (
        <div className="container flex-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
            <Card style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
                    돌아오신 것을 환영합니다!
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    계정에 로그인하여 학습을 이어가세요.
                </p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input
                        label="이메일"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="비밀번호"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <Button type="submit" fullWidth size="lg" style={{ marginTop: '12px' }} disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </Button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    계정이 없으신가요? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>회원가입</Link>
                </div>
            </Card>
        </div>
    );
}
