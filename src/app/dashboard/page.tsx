import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>안녕하세요, 학습자님! 👋</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>오늘도 힘차게 코딩해볼까요?</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <StatCard label="수강 중인 강의" value="3" />
                <StatCard label="완료한 과제" value="12" />
                <StatCard label="이번 주 학습 시간" value="8.5h" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>최근 학습 중인 강의</h2>
            <Card hover style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{
                    width: '120px',
                    height: '80px',
                    backgroundColor: '#2a2a30',
                    borderRadius: 'var(--radius-sm)',
                    backgroundImage: 'url(https://placehold.co/120x80/101010/6366f1)',
                    backgroundSize: 'cover'
                }} />
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>2026 풀스택 마스터 클래스</h3>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#2a2a30', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '65%', height: '100%', backgroundColor: 'var(--primary)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span>진도율 65%</span>
                        <span>다음: Server Components Deep Dive</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <Card>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{value}</div>
        </Card>
    );
}
