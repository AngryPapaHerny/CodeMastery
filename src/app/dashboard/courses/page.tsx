"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { BookOpen, PlayCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function MyCoursesPage() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEnrollments() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Join enrollments with courses
                const { data, error } = await supabase
                    .from('enrollments')
                    .select(`
                    *,
                    courses (
                        id,
                        title,
                        thumbnail_url,
                        level
                    )
                `)
                    .eq('user_id', user.id)
                    .order('last_accessed_at', { ascending: false });

                if (data) setEnrollments(data);
            }
            setLoading(false);
        }
        fetchEnrollments();
    }, []);

    if (loading) return <div style={{ padding: '40px' }}>로딩 중...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>내 강의실</h1>

            {enrollments.length === 0 ? (
                <Card style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <BookOpen size={32} color="var(--text-secondary)" />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>수강 중인 강의가 없습니다.</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>새로운 지식을 탐험하고 성장을 시작해보세요.</p>
                    <Link href="/courses">
                        <Button size="lg">강의 목록 보러가기</Button>
                    </Link>
                </Card>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {enrollments.map((item) => (
                        <Link href={`/courses/${item.courses.id}`} key={item.id}>
                            <Card hover style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    backgroundColor: '#333',
                                    backgroundImage: `url(${item.courses.thumbnail_url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                                    marginBottom: '16px'
                                }} />
                                <div style={{ padding: '0 8px 8px 8px', flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>
                                        {item.courses.level}
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', lineHeight: 1.4 }}>
                                        {item.courses.title}
                                    </h3>
                                    {/* Progress Bar (Mock for now, could use item.progress) */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                            <div style={{ width: `${item.progress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '2px' }} />
                                        </div>
                                        <span>{item.progress}%</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
