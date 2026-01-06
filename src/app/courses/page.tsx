"use client";

import { useEffect, useState } from 'react';
import { CourseCard } from '@/components/course/CourseCard';
import { createClient } from '@/lib/supabase';

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();

            // 1. Fetch Courses
            const { data: coursesData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
            setCourses(coursesData || []);

            // 2. Fetch User & Enrollments
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: userEnrollments } = await supabase
                    .from('enrollments')
                    .select('course_id')
                    .eq('user_id', user.id);

                if (userEnrollments) {
                    const ids = new Set(userEnrollments.map(e => e.course_id));
                    setEnrolledCourseIds(ids);
                }
            }

            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>로딩 중...</div>;

    return (
        <div style={{ minHeight: '100vh', paddingTop: '80px' }}>
            {/* Header Section */}
            <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>
                            전체 강의 목록
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
                            초급부터 고급까지, 당신의 실력을 향상시킬 수 있는 최고의 커리큘럼을 만나보세요.
                        </p>
                    </div>
                </div>
            </section>

            {/* Course Grid */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    {courses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            등록된 강의가 없습니다.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '40px' }}>
                            {courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    id={course.id}
                                    title={course.title}
                                    description={course.description || ''}
                                    level={course.level}
                                    price={course.price}
                                    isEnrolled={enrolledCourseIds.has(course.id)}
                                    thumbnail={course.thumbnail_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
