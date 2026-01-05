import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Header() {
    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '80px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'rgba(10, 10, 12, 0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Code<span className="text-gradient">Mastery</span>
                </Link>

                <nav style={{ display: 'flex', gap: '32px' }}>
                    <Link href="/courses" style={{ color: 'var(--text-secondary)' }}>강의 목록</Link>
                    <Link href="/mentoring" style={{ color: 'var(--text-secondary)' }}>멘토링</Link>
                    <Link href="/community" style={{ color: 'var(--text-secondary)' }}>커뮤니티</Link>
                </nav>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href="/auth/login">
                        <Button variant="ghost" size="sm">로그인</Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button size="sm">회원가입</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
