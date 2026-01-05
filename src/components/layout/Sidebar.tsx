import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Sidebar() {
    return (
        <aside style={{
            width: '260px',
            borderRight: '1px solid var(--border)',
            height: 'calc(100vh - 80px)', // Minus header height
            position: 'fixed',
            top: '80px',
            left: 0,
            backgroundColor: 'var(--background)',
            padding: '24px'
        }}>
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '16px' }}>
                    My Learning
                </h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <SidebarLink href="/dashboard" active>대시보드 홈</SidebarLink>
                    <SidebarLink href="/dashboard/courses">내 강의실</SidebarLink>
                    <SidebarLink href="/dashboard/assignments">과제 관리</SidebarLink>
                    <SidebarLink href="/dashboard/certificates">수료증</SidebarLink>
                </nav>
            </div>

            <div>
                <h2 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '16px' }}>
                    Account
                </h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <SidebarLink href="/dashboard/profile">프로필 설정</SidebarLink>
                    <SidebarLink href="/dashboard/billing">결제 내역</SidebarLink>
                    <div style={{ margin: '12px 0', borderTop: '1px solid var(--border)' }} />
                    <SidebarLink href="/dashboard/admin" >👑 강사 모드 (Demo)</SidebarLink>
                </nav>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                <Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start', color: '#ef4444' }}>
                    로그아웃
                </Button>
            </div>
        </aside>
    );
}

function SidebarLink({ href, children, active = false }: { href: string, children: React.ReactNode, active?: boolean }) {
    return (
        <Link href={href} style={{
            display: 'block',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: active ? 600 : 400,
            transition: 'all 0.2s'
        }}>
            {children}
        </Link>
    );
}
