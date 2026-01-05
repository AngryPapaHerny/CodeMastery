import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
            <Sidebar />
            <div style={{
                flex: 1,
                marginLeft: '260px', // Width of sidebar
                padding: '40px',
                backgroundColor: 'var(--background)'
            }}>
                {children}
            </div>
        </div>
    );
}
