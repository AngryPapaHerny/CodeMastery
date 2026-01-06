"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NewCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Course State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'Beginner',
        price: '',
        thumbnail_url: '',
        video_url: ''
    });

    // Lessons State
    const [lessons, setLessons] = useState<any[]>([]);
    const [newLesson, setNewLesson] = useState({
        title: '',
        video_url: '',
        material_url: '',
        description: ''
    });
    const [isAddingLesson, setIsAddingLesson] = useState(false);

    const supabase = createClient();

    const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddLesson = () => {
        if (!newLesson.title) return alert('차시 제목을 입력해주세요.');

        const lesson = {
            id: `temp_${Date.now()}`, // Temporary ID for UI
            title: newLesson.title,
            video_url: newLesson.video_url,
            material_url: newLesson.material_url,
            description: newLesson.description,
            order_index: lessons.length
        };

        setLessons([...lessons, lesson]);
        setNewLesson({ title: '', video_url: '', material_url: '', description: '' });
        setIsAddingLesson(false);
    };

    const handleDeleteLesson = (tempId: string) => {
        setLessons(lessons.filter(l => l.id !== tempId));
    };

    const handleSubmit = async () => {
        if (!formData.title) return alert('강의 제목은 필수입니다.');

        setLoading(true);

        // 1. Create Course
        const { data: courseData, error: courseError } = await supabase.from('courses').insert({
            title: formData.title,
            description: formData.description,
            level: formData.level,
            price: parseInt(formData.price || '0'),
            thumbnail_url: formData.thumbnail_url,
            video_url: formData.video_url
        }).select().single();

        if (courseError) {
            alert(`강의 생성 실패: ${courseError.message}`);
            setLoading(false);
            return;
        }

        // 2. Create Lessons
        if (lessons.length > 0) {
            const lessonsToInsert = lessons.map((lesson, index) => ({
                course_id: courseData.id,
                title: lesson.title,
                video_url: lesson.video_url,
                material_url: lesson.material_url,
                description: lesson.description,
                order_index: index
            }));

            const { error: lessonError } = await supabase.from('lessons').insert(lessonsToInsert);

            if (lessonError) {
                alert(`강의는 생성되었으나 커리큘럼 저장 중 오류가 발생했습니다: ${lessonError.message}`);
                // Don't return, still redirect to edit page or list
            }
        }

        alert('강의가 성공적으로 등록되었습니다.');
        router.push('/dashboard/admin/courses');
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <Link href="/dashboard/admin/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={16} /> 목록으로 돌아가기
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>새 강의 등록</h1>
                </div>
                <Button onClick={handleSubmit} size="lg" disabled={loading}>
                    {loading ? '등록 중...' : '강의 전체 등록'}
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
                {/* Left Column: Curriculum */}
                <div>
                    <Card style={{ padding: '24px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>커리큘럼 구성</h2>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>총 {lessons.length}개 차시</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {lessons.length === 0 && !isAddingLesson && (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', border: '2px dashed #27272a', borderRadius: '8px' }}>
                                    <p style={{ marginBottom: '12px' }}>등록된 차시가 없습니다.</p>
                                    <Button variant="outline" onClick={() => setIsAddingLesson(true)}>첫 차시 추가하기</Button>
                                </div>
                            )}

                            {lessons.map((lesson, idx) => (
                                <div key={lesson.id} style={{
                                    padding: '16px',
                                    backgroundColor: '#18181b',
                                    borderRadius: '8px',
                                    border: '1px solid #27272a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        width: '24px', height: '24px',
                                        borderRadius: '50%', backgroundColor: '#27272a',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', fontWeight: 600
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{lesson.title}</div>
                                        {lesson.video_url && <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>동영상 포함됨</div>}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteLesson(lesson.id)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            {isAddingLesson ? (
                                <div style={{ padding: '20px', border: '1px solid var(--primary)', borderRadius: '8px', backgroundColor: '#18181b' }}>
                                    <h3 style={{ marginBottom: '12px', fontWeight: 700 }}>새 차시 정보</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <Input
                                            label="차시 제목"
                                            value={newLesson.title}
                                            onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                                            placeholder="예: 프로젝트 환경 설정"
                                        />
                                        <Input
                                            label="영상 URL"
                                            value={newLesson.video_url}
                                            onChange={e => setNewLesson({ ...newLesson, video_url: e.target.value })}
                                            placeholder="YouTube, Vimeo 링크 등"
                                        />
                                        <Input
                                            label="자료 URL (선택)"
                                            value={newLesson.material_url}
                                            onChange={e => setNewLesson({ ...newLesson, material_url: e.target.value })}
                                        />
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                            <Button variant="ghost" onClick={() => setIsAddingLesson(false)}>취소</Button>
                                            <Button onClick={handleAddLesson}>리스트에 추가</Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                lessons.length > 0 && (
                                    <Button variant="outline" fullWidth onClick={() => setIsAddingLesson(true)} style={{ borderStyle: 'dashed', padding: '16px' }}>
                                        <Plus size={16} style={{ marginRight: '8px' }} /> 차시 추가하기
                                    </Button>
                                )
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Course Info */}
                <div>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>강의 기본 정보</h2>

                            <Input
                                label="강의 제목"
                                name="title"
                                value={formData.title}
                                onChange={handleCourseChange}
                                placeholder="강의 제목을 입력하세요"
                                required
                            />

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    설명
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleCourseChange}
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: '#18181b',
                                        border: '1px solid #27272a',
                                        borderRadius: '8px',
                                        color: 'white',
                                        outline: 'none',
                                        fontFamily: 'inherit'
                                    }}
                                    placeholder="어떤 강의인가요?"
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        난이도
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleCourseChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            backgroundColor: '#18181b',
                                            border: '1px solid #27272a',
                                            borderRadius: '8px',
                                            color: 'white',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="Beginner">입문</option>
                                        <option value="Intermediate">중급</option>
                                        <option value="Advanced">고급</option>
                                    </select>
                                </div>
                                <Input
                                    label="가격"
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleCourseChange}
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <Input
                                label="썸네일 URL"
                                name="thumbnail_url"
                                value={formData.thumbnail_url}
                                onChange={handleCourseChange}
                                placeholder="https://..."
                            />

                            <Input
                                label="인트로 영상 URL"
                                name="video_url"
                                value={formData.video_url}
                                onChange={handleCourseChange}
                                placeholder="https://..."
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
