import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="container">
            {/* Hero Section */}
            <section style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '60px 0'
            }}>
                <div style={{
                    marginBottom: '20px',
                    padding: '8px 16px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '20px',
                    color: 'var(--primary)',
                    fontSize: '0.9rem',
                    fontWeight: 600
                }}>
                    🚀 2026년형 최신 커리큘럼 업데이트
                </div>
                <h1 style={{
                    fontSize: '4.5rem',
                    fontWeight: '800',
                    marginBottom: '24px',
                    lineHeight: '1.1',
                    letterSpacing: '-2px'
                }}>
                    코딩 교육의 <br />
                    <span className="text-gradient">새로운 기준</span>을 만나다
                </h1>
                <p style={{
                    fontSize: '1.35rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '48px',
                    maxWidth: '700px',
                    lineHeight: '1.6'
                }}>
                    단순한 지식 전달을 넘어, 실전 문제 해결 능력을 기르는 프리미엄 교육 플랫폼.
                    현직 개발자의 1:1 코드 리뷰와 디스코드 멘토링으로 확실하게 성장하세요.
                </p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link href="/courses">
                        <Button size="lg" style={{ minWidth: '180px' }}>무료로 시작하기</Button>
                    </Link>
                    <Link href="/courses">
                        <Button variant="outline" size="lg" style={{ minWidth: '180px' }}>커리큘럼 살펴보기</Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '80px 0' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '60px' }}>
                    왜 <span className="text-gradient">CodeMastery</span> 인가요?
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    <Card hover>
                        <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>⚡️</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>실시간 인터랙티브 강의</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            일방적인 동영상 강의가 아닙니다. 실시간으로 코드를 실행하고 피드백을 받아보세요.
                        </p>
                    </Card>
                    <Card hover>
                        <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>💬</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>디스코드 멘토링</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            모르는 부분이 생기면 언제든 질문하세요. 현직 멘토가 실시간으로 답변해 드립니다.
                        </p>
                    </Card>
                    <Card hover>
                        <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🏆</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>체계적인 코드 리뷰</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            현업 수준의 클린 코드 작성법을 1:1 과제 리뷰를 통해 꼼꼼하게 지도합니다.
                        </p>
                    </Card>
                </div>
            </section>
        </div>
    );
}
