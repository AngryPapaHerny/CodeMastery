"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { PlayCircle, FileText, Lock } from 'lucide-react';

export default function CourseDetailPage() {
    const params = useParams();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [currentLesson, setCurrentLesson] = useState<any>(null); // Currently playing lesson
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('curriculum');

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();

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

                // Default to first lesson if available, or course intro
                if (lessonsData && lessonsData.length > 0) {
                    setCurrentLesson(lessonsData[0]);
                }
            }

            setLoading(false);
        }
        fetchData();
    }, [params.slug]);

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>로딩 중...</div>;
    if (!course) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>강의를 찾을 수 없습니다.</div>;

    // Determine what video to show: Current Lesson Video -> Course Intro Video -> Placeholder
    const activeVideoUrl = currentLesson?.video_url || course.video_url;

    // Helper function to render video player
    const renderVideoPlayer = (url: string) => {
        if (!url) return <div style={{ color: 'var(--text-secondary)' }}>동영상이 없습니다.</div>;

        // 1. YouTube
        const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/.*v=)([^&]+)/);
        if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            return (
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ maxHeight: '60vh' }}
                ></iframe>
            );
        }

        // 2. Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            const videoId = vimeoMatch[1];
            return (
                <iframe
                    src={`https://player.vimeo.com/video/${videoId}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{ maxHeight: '60vh' }}
                ></iframe>
            );
        }

        // 3. Native Video (mp4, webm, etc.)
        return (
            <video
                key={url} // Force reload on source change
                src={url}
                controls
                style={{ width: '100%', height: '100%', maxHeight: '60vh' }}
                poster={course.thumbnail_url}
            />
        );
    };

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Video Player Section */}
            <div style={{
                width: '100%',
                height: '60vh',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {renderVideoPlayer(activeVideoUrl)}
            </div>
            {/* Content Section */}
            <div className="container" style={{ flex: 1, padding: '40px 0', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>

                {/* Main Content */}
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
                        {currentLesson ? `[${currentLesson.order_index + 1}강] ${currentLesson.title}` : course.title}
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                        {currentLesson?.description || course.description}
                    </p>

                    {currentLesson?.material_url && (
                        <Card style={{ marginBottom: '40px', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#1e293b', border: 'none' }}>
                            <FileText color="#38bdf8" />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '4px' }}>강의 자료</div>
                                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>이 차시에는 학습 자료가 포함되어 있습니다.</div>
                            </div>
                            <a href={currentLesson.material_url} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline">다운로드</Button>
                            </a>
                        </Card>
                    )}

                    {/* Tabs */}
                    <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <TabButton active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')}>커리큘럼</TabButton>
                            <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')}>강의 소개</TabButton>
                            <TabButton active={activeTab === 'qna'} onClick={() => setActiveTab('qna')}>질문 & 답변</TabButton>
                        </div>
                    </div>

                    {activeTab === 'curriculum' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {lessons.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>등록된 차시가 없습니다.</p>
                            ) : (
                                lessons.map((lesson, idx) => (
                                    <div
                                        key={lesson.id}
                                        onClick={() => setCurrentLesson(lesson)}
                                        style={{
                                            padding: '16px',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            backgroundColor: currentLesson?.id === lesson.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <PlayCircle size={20} color={currentLesson?.id === lesson.id ? '#22c55e' : 'var(--text-secondary)'} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: currentLesson?.id === lesson.id ? 'white' : 'var(--text-secondary)' }}>
                                                {idx + 1}. {lesson.title}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>12:40</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'info' && (
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            <h3>강의 상세</h3>
                            <p>{course.description}</p>
                            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#18181b', borderRadius: '8px' }}>
                                <p>난이도: {course.level}</p>
                                <p>가격: {course.price.toLocaleString()}원</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div>
                    <Card style={{ position: 'sticky', top: '100px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800 }}>{course.price === 0 ? '무료' : `${course.price.toLocaleString()}원`}</span>
                        </div>
                        <Button fullWidth size="lg" style={{ marginBottom: '12px' }}>수강 신청하기</Button>

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

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '16px 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s'
            }}
        >
            {children}
        </button>
    );
}
