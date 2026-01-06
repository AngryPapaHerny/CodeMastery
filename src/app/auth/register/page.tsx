"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        setLoading(true);
        setError(null);

        console.log("Attempting signup with:", { email, name }); // Debug log

        const supabase = createClient();
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (signUpError) {
            console.error("Signup error:", signUpError);
            setError(signUpError.message);
            setLoading(false);
        } else {
            // Success
            alert('가입 확인 이메일을 보냈습니다. 이메일을 확인해주세요.');
            router.push('/auth/login');
        }
    };

    return (
        <div className="container flex-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
            <Card style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
                    회원가입
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    CodeMastery와 함께 성장을 시작하세요.
                </p>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input
                        label="이름"
                        type="text"
                        placeholder="홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                    <Input
                        label="비밀번호 확인"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <Button type="submit" fullWidth size="lg" style={{ marginTop: '12px' }} disabled={loading}>
                        {loading ? '가입 중...' : '가입하기'}
                    </Button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    이미 계정이 있으신가요? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>로그인</Link>
                </div>
            </Card>
        </div>
    );
}
