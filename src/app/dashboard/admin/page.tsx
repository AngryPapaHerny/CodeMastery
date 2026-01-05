"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalSubmissions: 0,
        recentSubmissions: [] as any[]
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            // 1. Total Students
            const { count: studentCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'student');

            // 2. Total Submissions
            const { count: submissionCount } = await supabase
                .from('assignment_submissions')
                .select('*', { count: 'exact', head: true });

            // 3. Recent Submissions (with profiles joined)
            const { data: submissions } = await supabase
                .from('assignment_submissions')
                .select(`
          *,
          assignments (title),
          profiles (full_name)
        `)
                .order('submitted_at', { ascending: false })
                .limit(5);

            setStats({
                totalStudents: studentCount || 0,
                totalSubmissions: submissionCount || 0,
                recentSubmissions: submissions || []
            });
            setLoading(false);
        }

        fetchData();
    }, []);

    const handleQuickAction = async (action: string) => {
        const title = prompt(`${action} 제목을 입력하세요:`);
        if (!title) return;

        if (action === '공지사항') {
            const content = prompt('공지사항 내용을 입력하세요:');
            if (!content) return;

            await supabase.from('notices').insert({ title, content });
            alert('공지사항이 등록되었습니다.');
        } else if (action === '쿠폰') {
            const discount = prompt('할인 금액을 입력하세요 (원):');
            if (!discount) return;

            await supabase.from('coupons').insert({ code: title, discount_amount: parseInt(discount) });
            alert(`쿠폰 [${title}]이 발행되었습니다.`);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>강사 대시보드</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>학생들의 진행 상황을 모니터링하고 콘텐츠를 관리하세요.</p>
                </div>
                <Link href="/dashboard/admin/courses/new">
                    <Button>+ 새 강의 업로드</Button>
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <StatCard label="총 수강생" value={`${stats.totalStudents}명`} trend="Active" />
                <StatCard label="이번 달 매출" value="₩0" trend="-" />
                <StatCard label="제출된 과제" value={`${stats.totalSubmissions}건`} trend="Realtime" highlight />
                <StatCard label="시스템 상태" value="Normal" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                {/* Recent Submissions */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>최근 제출된 과제</h2>
                        <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>🔄 새로고침</Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>데이터를 불러오는 중...</div>
                        ) : stats.recentSubmissions.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>제출된 과제가 없습니다.</div>
                        ) : (
                            stats.recentSubmissions.map((sub: any) => (
                                <SubmissionItem
                                    key={sub.id}
                                    student={sub.profiles?.full_name || '알 수 없음'}
                                    assignment={sub.assignments?.title || '삭제된 과제'}
                                    time={formatDistanceToNow(new Date(sub.submitted_at), { addSuffix: true, locale: ko })}
                                    status={sub.status}
                                />
                            ))
                        )}
                    </div>
                </section>

                {/* Quick Actions */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>빠른 작업</h2>
                    <Card style={{ padding: '20px' }}>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li>
                                <Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start' }} onClick={() => handleQuickAction('공지사항')}>
                                    🔔 공지사항 작성
                                </Button>
                            </li>
                            <li>
                                <Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start' }} onClick={() => handleQuickAction('쿠폰')}>
                                    🎫 쿠폰 발행
                                </Button>
                            </li>
                            <li>
                                <Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start' }}>
                                    📅 멘토링 일정 관리
                                </Button>
                            </li>
                            <li>
                                <Button variant="ghost" fullWidth style={{ justifyContent: 'flex-start' }}>
                                    ⚙️ 사이트 설정
                                </Button>
                            </li>
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
