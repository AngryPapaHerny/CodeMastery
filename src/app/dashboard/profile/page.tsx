"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profile, setProfile] = useState<{ email: string, full_name: string, role: string } | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (data) setProfile(data);
            }
        }
        getProfile();
    }, []);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('❌ 비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setMessage(`❌ ${error.message}`);
        } else {
            setMessage('✅ 비밀번호가 성공적으로 변경되었습니다.');
            setPassword('');
            setConfirmPassword('');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>프로필 설정</h1>

            <Card style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>내 정보</h2>
                {profile ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px', alignItems: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>이름</div>
                        <div style={{ fontWeight: 600 }}>{profile.full_name}</div>

                        <div style={{ color: 'var(--text-secondary)' }}>이메일</div>
                        <div>{profile.email}</div>

                        <div style={{ color: 'var(--text-secondary)' }}>권한</div>
                        <div>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                backgroundColor: profile.role === 'admin' ? 'var(--secondary)' : '#2a2a30',
                                color: 'white',
                                fontSize: '0.85rem'
                            }}>
                                {profile.role === 'admin' ? '관리자' : '학생'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div>로딩 중...</div>
                )}
            </Card>

            <Card>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>비밀번호 변경</h2>
                <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input
                        label="새 비밀번호"
                        type="password"
                        placeholder="변경할 비밀번호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        label="새 비밀번호 확인"
                        type="password"
                        placeholder="비밀번호 다시 입력"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {message && (
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: message.startsWith('✅') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.startsWith('✅') ? '#22c55e' : '#ef4444' }}>
                            {message}
                        </div>
                    )}

                    <Button type="submit" disabled={loading || !password}>
                        {loading ? '변경 중...' : '비밀번호 변경하기'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
