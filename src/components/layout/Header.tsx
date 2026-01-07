"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/common/NotificationBell';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
    router.refresh();
    router.push('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
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
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800 }} onClick={closeMenu}>
            Code<span className="text-gradient">Mastery</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-only" style={{ display: 'flex', gap: '32px' }}>
            <Link href="/courses" style={{ color: 'var(--text-secondary)' }}>강의 목록</Link>
            <Link href="/mentoring" style={{ color: 'var(--text-secondary)' }}>멘토링</Link>
            <Link href="/community" style={{ color: 'var(--text-secondary)' }}>커뮤니티</Link>
          </nav>

          {/* Desktop Auth */}
          <div className="desktop-only" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {user ? (
              <>
                <NotificationBell />
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

          {/* Mobile Toggle */}
          <button className="mobile-only" onClick={() => setIsMenuOpen(true)} style={{ color: 'white' }}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--background)',
          zIndex: 200,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800 }} onClick={closeMenu}>
              Code<span className="text-gradient">Mastery</span>
            </Link>
            <button onClick={closeMenu} style={{ color: 'white' }}>
              <X size={24} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.2rem', fontWeight: 600 }}>
            <Link href="/courses" onClick={closeMenu}>강의 목록</Link>
            <Link href="/mentoring" onClick={closeMenu}>멘토링</Link>
            <Link href="/community" onClick={closeMenu}>커뮤니티</Link>
          </nav>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>{user.email?.split('@')[0]}님</span>
                  <NotificationBell />
                </div>
                <Link href="/dashboard" onClick={closeMenu}>
                  <Button fullWidth variant="primary">대시보드</Button>
                </Link>
                <Button fullWidth variant="secondary" onClick={handleLogout}>로그아웃</Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={closeMenu}>
                  <Button fullWidth variant="outline">로그인</Button>
                </Link>
                <Link href="/auth/register" onClick={closeMenu}>
                  <Button fullWidth>회원가입</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
