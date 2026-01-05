"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function CourseDetailPage() {
    const params = useParams();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('curriculum');

    useEffect(() => {
        async function fetchCourse() {
            const supabase = createClient();
            const { data } = await supabase
                .from('courses')
                .select('*')
                .eq('id', params.slug) // Assuming slug is the ID for now. 
                .single();

            setCourse(data);
            setLoading(false);
        }
        fetchCourse();
    }, [params.slug]);

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>로딩 중...</div>;
    if (!course) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>강의를 찾을 수 없습니다.</div>;

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
                {course.video_url ? (
                    <video
                        src={course.video_url}
                        controls
                        style={{ width: '100%', height: '100%', maxHeight: '60vh' }}
                        poster={course.thumbnail_url}
                    />
                ) : (
                    <div style={{ color: 'var(--text-secondary)' }}>동영상이 없습니다.</div>
                )}
            </div>

            {/* Content Section */}
            <div className="container" style={{ flex: 1, padding: '40px 0', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>

                {/* Main Content */}
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
                        {course.title}
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '40px' }}>
                        {course.description}
                    </p>

                    {/* Tabs */}
                    <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <TabButton active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')}>커리큘럼</TabButton>
                            <TabButton active={activeTab === 'qna'} onClick={() => setActiveTab('qna')}>질문 & 답변</TabButton>
                            <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>수강평</TabButton>
                        </div>
                    </div>

                    {activeTab === 'curriculum' && (
                        <div style={{ color: 'var(--text-secondary)' }}>
                            <h3>강의 소개</h3>
                            <p>{course.description}</p>
                            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#18181b', borderRadius: '8px' }}>
                                <p>난이도: {course.level}</p>
                                <p>가격: {course.price.toLocaleString()}원</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'qna' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Input placeholder="질문을 입력하세요..." />
                                <Button>질문하기</Button>
                            </div>
                            <p style={{ color: 'var(--text-secondary)' }}>아직 등록된 질문이 없습니다.</p>
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
                        <Button fullWidth variant="outline">장바구니 담기</Button>

                        <ul style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <li>✓ 무제한 수강 가능</li>
                            <li>✓ 모바일/PC 지원</li>
                            <li>✓ 수료증 발급</li>
                            <li>✓ 멘토링 지원</li>
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
