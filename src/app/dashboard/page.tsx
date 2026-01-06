"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        enrolledCount: 0,
        completedAssignments: 0, // Still mock or 0 until assignments linked
        studyTime: '0h' // Still mock
    });
    const [recentCourse, setRecentCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        async function fetchDashboardData() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Get Profile Name
                const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
                if (profile) setUserName(profile.full_name);

                // Get Enrollments Count & Recent
                const { data: enrollments, count } = await supabase
                    .from('enrollments')
                    .select('*, courses(*)', { count: 'exact' })
                    .eq('user_id', user.id)
                    .order('last_accessed_at', { ascending: false });

                if (enrollments) {
                    setStats(prev => ({ ...prev, enrolledCount: count || 0 }));
                    if (enrollments.length > 0) {
                        setRecentCourse(enrollments[0]);
                    }
                }

                // Get Assignments Count (if we had table)
                const { count: assignmentCount } = await supabase
                    .from('assignment_submissions')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);
                setStats(prev => ({ ...prev, completedAssignments: assignmentCount || 0 }));
            }
            setLoading(false);
        }
        fetchDashboardData();
    }, []);

    if (loading) return <div style={{ padding: '40px' }}>로딩 중...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>안녕하세요, {userName || '학습자'}님! 👋</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>오늘도 힘차게 코딩해볼까요?</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <StatCard label="수강 중인 강의" value={`${stats.enrolledCount}`} />
                <StatCard label="제출한 과제" value={`${stats.completedAssignments}`} />
                <StatCard label="이번 주 학습 시간" value={stats.studyTime} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>최근 학습 중인 강의</h2>

            {recentCourse ? (
                <Link href={`/courses/${recentCourse.courses.id}`}>
                    <Card hover style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{
                            width: '120px',
                            height: '80px',
                            backgroundColor: '#2a2a30',
                            borderRadius: 'var(--radius-sm)',
                            backgroundImage: `url(${recentCourse.courses.thumbnail_url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{recentCourse.courses.title}</h3>
                            <div style={{ width: '100%', height: '6px', backgroundColor: '#2a2a30', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${recentCourse.progress}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span>진도율 {recentCourse.progress}%</span>
                                <span>이어 하기 &rarr;</span>
                            </div>
                        </div>
                    </Card>
                </Link>
            ) : (
                <Card style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    아직 학습 중인 강의가 없습니다. 강의를 신청해보세요!
                </Card>
            )}
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
