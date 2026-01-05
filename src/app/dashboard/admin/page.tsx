"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminDashboardPage() {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>강사 대시보드</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>학생들의 진행 상황을 모니터링하고 콘텐츠를 관리하세요.</p>
                </div>
                <Button>+ 새 강의 업로드</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <StatCard label="총 수강생" value="1,240" trend="+12%" />
                <StatCard label="이번 달 매출" value="₩12.5M" trend="+5%" />
                <StatCard label="제출된 과제" value="48" trend="New" highlight />
                <StatCard label="평균 완강률" value="68%" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                {/* Recent Submissions */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>최근 제출된 과제</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <SubmissionItem
                            student="김철수"
                            assignment="Next.js 라우팅 구현하기"
                            time="2시간 전"
                            status="pending"
                        />
                        <SubmissionItem
                            student="이영희"
                            assignment="React Hooks 활용"
                            time="5시간 전"
                            status="reviewed"
                        />
                        <SubmissionItem
                            student="박지성"
                            assignment="API 연동 기초"
                            time="1일 전"
                            status="pending"
                        />
                    </div>
                </section>

                {/* Quick Actions */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>빠른 작업</h2>
                    <Card style={{ padding: '20px' }}>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start' }}>🔔 공지사항 작성</Button></li>
                            <li><Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start' }}>📅 멘토링 일정 관리</Button></li>
                            <li><Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start' }}>🎫 쿠폰 발행</Button></li>
                            <li><Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start' }}>⚙️ 사이트 설정</Button></li>
                        </ul>
                    </Card>
                </section>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, highlight = false }: { label: string, value: string, trend?: string, highlight?: boolean }) {
    return (
        <Card style={{ borderColor: highlight ? 'var(--primary)' : 'var(--border)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                {label}
                {trend && <span style={{ color: '#22c55e', fontSize: '0.8rem' }}>{trend}</span>}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{value}</div>
        </Card>
    );
}

function SubmissionItem({ student, assignment, time, status }: { student: string, assignment: string, time: string, status: 'pending' | 'reviewed' }) {
    return (
        <Card hover style={{ display: 'flex', alignItems: 'center', padding: '16px 24px' }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{assignment}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {student} • {time}
                </div>
            </div>
            <div>
                {status === 'pending' ? (
                    <Button size="sm">리뷰하기</Button>
                ) : (
                    <span style={{ fontSize: '0.9rem', color: '#22c55e', fontWeight: 600 }}>완료됨</span>
                )}
            </div>
        </Card>
    );
}
