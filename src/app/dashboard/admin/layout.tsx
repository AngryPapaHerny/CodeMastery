"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkPermission() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/auth/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role === 'admin') {
                setIsAuthorized(true);
            } else {
                alert('관리자 권한이 필요합니다.');
                router.push('/dashboard');
            }
            setLoading(false);
        }

        checkPermission();
    }, [router]);

    if (loading) {
        return <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>권한 확인 중...</div>;
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <>
            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(236, 72, 153, 0.1)', border: '1px solid var(--secondary)', borderRadius: '8px', color: 'var(--secondary)' }}>
                🔒 관리자 모드로 접속했습니다.
            </div>
            {children}
        </>
    );
}
