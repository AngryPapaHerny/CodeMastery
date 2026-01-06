"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { PlayCircle, FileText, Lock } from 'lucide-react';
import ClassroomLayout from '@/components/course/ClassroomLayout';

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('curriculum');

    // Enrollment State
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();

            // 0. Get User
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);

            // 1. Fetch Course
            const { data: courseData } = await supabase
                .from('courses')
                .select('*')
                .eq('id', params.slug)
                .single();

            setCourse(courseData);

            // 2. Fetch Lessons
            if (courseData) {
                const { data: lessonsData } = await supabase
                    .from('lessons')
                    .select('*')
                    .eq('course_id', courseData.id)
                    .order('order_index', { ascending: true });

                setLessons(lessonsData || []);

                if (lessonsData && lessonsData.length > 0) {
                    // Only set first lesson if we are sure? No, wait for enrollment check.
                    // Actually, safer to NOT set it by default, ensuring Intro video plays.
                    // Users can click if enrolled.
                    // setCurrentLesson(lessonsData[0]); 
                }

                // 3. Check Enrollment (if logged in)
                if (currentUser) {
                    const { data: enrollment } = await supabase
                        .from('enrollments')
                        .select('id')
                        .eq('user_id', currentUser.id)
                        .eq('course_id', courseData.id)
                        .single();

                    if (enrollment) {
                        setIsEnrolled(true);
                        // If enrolled, we CAN auto-play first lesson if desired, or let user choose.
                        // Let's auto-play first lesson for enrolled users for convenience
                        if (lessonsData && lessonsData.length > 0) {
                            setCurrentLesson(lessonsData[0]);
                        }
                    }
                }
            }

            setLoading(false);
        }
        fetchData();
    }, [params.slug]);

    const handleEnroll = async () => {
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            router.push('/auth/login');
            return;
        }

        if (isEnrolled) {
            // Continue Learning -> Go to first lesson or dashboard
            // For now, stay here (already watching) or go to dashboard
            router.push('/dashboard/courses');
            return;
        }

        if (!confirm('수강 신청하시겠습니까? (현재 무료 혜택 중)')) return;

        setEnrolling(true);
        const supabase = createClient();
        const { error } = await supabase.from('enrollments').insert({
            user_id: user.id,
            course_id: course.id
        });

        if (error) {
            alert('수강 신청 실패: ' + error.message);
            setEnrolling(false);
        } else {
            alert('수강 신청이 완료되었습니다! 내 강의실로 이동합니다.');
            router.push('/dashboard/courses');
        }
    };

    const renderVideoPlayer = (url: string) => {
        if (!url) return <div style={{ color: 'var(--text-secondary)' }}>동영상이 없습니다.</div>;

        const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/.*v=)([^&]+)/);
        if (youtubeMatch) {
            return (
                <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen style={{ maxHeight: '60vh' }}
                ></iframe>
            );
        }

        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return (
                <iframe
                    src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                    width="100%" height="100%" frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
                    style={{ maxHeight: '60vh' }}
                ></iframe>
            );
        }

        return (
            <video
                key={url} src={url} controls
                style={{ width: '100%', height: '100%', maxHeight: '60vh' }}
                poster={course.thumbnail_url}
            />
        );
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>로딩 중...</div>;
    if (!course) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>강의를 찾을 수 없습니다.</div>;

    const activeVideoUrl = currentLesson?.video_url || course.video_url;

    if (isEnrolled && currentLesson) { // Ensure currentLesson is set before showing classroom? Or show generic if null.
        // Actually, if enrolled, we prefer the ClassroomLayout.
        // But what if currentLesson is null (e.g. course has no lessons)? layout handles it comfortably.
        return (
            <ClassroomLayout
                course={course}
                lessons={lessons}
                currentLesson={currentLesson}
                setCurrentLesson={setCurrentLesson}
                renderVideoPlayer={renderVideoPlayer}
            />
        );
    }

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '60vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {renderVideoPlayer(activeVideoUrl)}
            </div>

            <div className="container" style={{ flex: 1, padding: '40px 0', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
                        {course.title}
                    </h1>
                    {/* Note: currentLesson title logic removed from here because if not enrolled, usually viewing Course Info, not specific lesson. 
                        But we still show "Intro" if currentLesson is null. 
                        And if user clicks locked lesson, we don't change video.
                     */}
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                        {course.description}
                    </p>

                    <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <button onClick={() => setActiveTab('curriculum')} style={activeTab === 'curriculum' ? activeTabStyle : tabStyle}>커리큘럼</button>
                            <button onClick={() => setActiveTab('info')} style={activeTab === 'info' ? activeTabStyle : tabStyle}>강의 소개</button>
                            <button onClick={() => setActiveTab('qna')} style={activeTab === 'qna' ? activeTabStyle : tabStyle}>질문 & 답변</button>
                        </div>
                    </div>

                    {activeTab === 'curriculum' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {lessons.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>등록된 차시가 없습니다.</p> :
                                lessons.map((lesson, idx) => (
                                    <div key={lesson.id}
                                        onClick={() => {
                                            if (!isEnrolled) {
                                                alert('수강 신청 후 학습할 수 있습니다.');
                                                return;
                                            }
                                            // Should not be reachable if enrolled logic works, but double check
                                            setCurrentLesson(lesson);
                                        }}
                                        style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'transparent' }}>
                                        <Lock size={20} color="var(--text-secondary)" />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{idx + 1}. {lesson.title}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {activeTab === 'info' && (
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            <h3>강의 상세</h3>
                            <p>{course.description}</p>
                        </div>
                    )}

                    {activeTab === 'qna' && (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            수강생 전용 공간입니다.
                        </div>
                    )}
                </div>

                <div>
                    <Card style={{ position: 'sticky', top: '100px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800 }}>{course.price === 0 ? '무료' : `${course.price.toLocaleString()}원`}</span>
                        </div>

                        <Button fullWidth size="lg" style={{ marginBottom: '12px' }} onClick={handleEnroll} disabled={enrolling}>
                            {enrolling ? '처리 중...' : (isEnrolled ? '이어 학습하기' : '수강 신청하기')}
                        </Button>

                        <ul style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <li>✓ 총 {lessons.length}개 강의</li>
                            <li>✓ 무제한 수강 가능</li>
                            <li>✓ 수료증 발급</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const tabStyle = { padding: '16px 0', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem' };
const activeTabStyle = { ...tabStyle, borderBottom: '2px solid var(--primary)', color: 'var(--text-primary)', fontWeight: 600 };
