"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check active session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getUser();

    // Listen for changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh(); // Refresh server components if any
    router.push('/'); // Go to home
  };

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

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              {/* Optional: Show user greeting or Avatar */}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginRight: '8px' }}>
                {user.email?.split('@')[0]}님
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <Link href="/dashboard">
                   <Button variant="ghost" size="sm">대시보드</Button>
                 </Link>
                 <Button variant="secondary" size="sm" onClick={handleLogout}>로그아웃</Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">로그인</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">회원가입</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
