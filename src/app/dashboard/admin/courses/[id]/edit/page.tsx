"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { ArrowLeft, Save, Plus, GripVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Course Data
    const [course, setCourse] = useState({
        title: '',
        description: '',
        level: 'Beginner',
        price: 0,
        thumbnail_url: '',
        video_url: '' // Intro video
    });

    // Lessons Data
    const [lessons, setLessons] = useState<any[]>([]);
    const [newLesson, setNewLesson] = useState({
        title: '',
        video_url: '',
        material_url: '',
        description: ''
    });
    const [isAddingLesson, setIsAddingLesson] = useState(false);

    // Assignments Data
    const [assignments, setAssignments] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            // 1. Fetch Course
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            if (courseError) {
                alert('강의를 불러오는데 실패했습니다.');
                router.push('/dashboard/admin/courses');
                return;
            }

            setCourse(courseData);

            // 2. Fetch Lessons
            const { data: lessonsData } = await supabase
                .from('lessons')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true });

            setLessons(lessonsData || []);

            // 3. Fetch Assignments
            const { data: assignmentsData } = await supabase
                .from('assignments')
                .select('*')
                .eq('course_id', courseId)
                .order('created_at', { ascending: false });

            setAssignments(assignmentsData || []);
            setLoading(false);
        }
        fetchData();
    }, [courseId, router]);

    // --- Course Updates ---
    const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCourse(prev => ({ ...prev, [name]: value }));
    };

    const saveCourse = async () => {
        setSaving(true);
        const { error } = await supabase
            .from('courses')
            .update({
                title: course.title,
                description: course.description,
                level: course.level,
                price: course.price,
                thumbnail_url: course.thumbnail_url,
                video_url: course.video_url
            })
            .eq('id', courseId);

        setSaving(false);
        if (error) alert('저장 실패: ' + error.message);
        else alert('강의 정보가 수정되었습니다.');
    };

    // --- Lesson Management ---
    const handleAddLesson = async () => {
        if (!newLesson.title) return alert('차시 제목을 입력해주세요.');

        const { data, error } = await supabase.from('lessons').insert({
            course_id: courseId,
            title: newLesson.title,
            video_url: newLesson.video_url,
            material_url: newLesson.material_url,
            description: newLesson.description,
            order_index: lessons.length // Auto order
        }).select().single();

        if (error) {
            alert('차시 추가 실패: ' + error.message);
        } else {
            setLessons([...lessons, data]);
            setNewLesson({ title: '', video_url: '', material_url: '', description: '' });
            setIsAddingLesson(false);
        }
    };

    const handleDeleteLesson = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        await supabase.from('lessons').delete().eq('id', id);
        setLessons(lessons.filter(l => l.id !== id));
    };

    const handleDeleteAssignment = async (id: string) => {
        if (!confirm('과제를 삭제하시겠습니까? 제출된 답안도 모두 삭제됩니다.')) return;
        await supabase.from('assignments').delete().eq('id', id);
        setAssignments(assignments.filter(a => a.id !== id));
    };

    if (loading) return <div style={{ padding: '40px' }}>로딩 중...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <Link href="/dashboard/admin/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={16} /> 목록으로 돌아가기
                </Link>
                <Button onClick={saveCourse} disabled={saving}>
                    <Save size={16} style={{ marginRight: '8px' }} />
                    {saving ? '저장 중...' : '변경사항 저장'}
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
                {/* Left: Lessons */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>커리큘럼 (차시 관리)</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {lessons.map((lesson, idx) => (
                            <Card key={lesson.id} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ color: 'var(--text-secondary)' }}><GripVertical size={20} /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{idx + 1}. {lesson.title}</div>
                                    {lesson.video_url && <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>Video Attached</div>}
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(lesson.id)} style={{ color: '#ef4444' }}>
                                    <Trash2 size={16} />
                                </Button>
                            </Card>
                        ))}

                        {isAddingLesson ? (
                            <Card style={{ padding: '20px', border: '1px solid var(--primary)' }}>
                                <h3 style={{ marginBottom: '12px', fontWeight: 700 }}>새 차시 추가</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <Input label="제목" value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} />
                                    <Input label="강의 영상 URL" value={newLesson.video_url} onChange={e => setNewLesson({ ...newLesson, video_url: e.target.value })} placeholder="https://..." />
                                    <Input label="강의 자료 URL (선택)" value={newLesson.material_url} onChange={e => setNewLesson({ ...newLesson, material_url: e.target.value })} placeholder="https://..." />
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                        <Button variant="ghost" onClick={() => setIsAddingLesson(false)}>취소</Button>
                                        <Button onClick={handleAddLesson}>추가하기</Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Button variant="outline" fullWidth onClick={() => setIsAddingLesson(true)} style={{ borderStyle: 'dashed', padding: '24px' }}>
                                <Plus size={20} /> 차시 추가하기
                            </Button>
                        )}
                    </div>

                    {/* Assignments Section */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>과제 관리</h2>
                            <Link href={`/dashboard/admin/courses/${courseId}/assignments/new`}>
                                <Button size="sm" variant="outline">
                                    <Plus size={16} style={{ marginRight: '8px' }} /> 과제 만들기
                                </Button>
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {assignments.length === 0 ? (
                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                                    등록된 과제가 없습니다.
                                </div>
                            ) : (
                                assignments.map((assignment: any) => (
                                    <Card key={assignment.id} style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <Link href={`/dashboard/admin/courses/${courseId}/assignments/${assignment.id}`} style={{ fontWeight: 600, fontSize: '1.05rem', display: 'block', marginBottom: '4px' }} className="hover:underline">
                                                {assignment.title}
                                            </Link>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {assignment.points}점 | 마감: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : '없음'}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAssignment(assignment.id)} style={{ color: '#ef4444' }}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                </div>

                {/* Right: Course Settings */}
                <div>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>강의 설정</h2>
                        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Input label="강의 제목" name="title" value={course.title} onChange={handleCourseChange} />

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>설명</label>
                                <textarea
                                    name="description"
                                    value={course.description || ''}
                                    onChange={handleCourseChange}
                                    rows={4}
                                    style={{
                                        width: '100%', padding: '12px', backgroundColor: '#18181b', border: '1px solid #27272a',
                                        borderRadius: '8px', color: 'white', outline: 'none', fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            <Input label="가격" type="number" name="price" value={course.price.toString()} onChange={handleCourseChange} />

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>난이도</label>
                                <select name="level" value={course.level} onChange={handleCourseChange} style={{ width: '100%', padding: '12px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: 'white' }}>
                                    <option value="Beginner">입문</option>
                                    <option value="Intermediate">중급</option>
                                    <option value="Advanced">고급</option>
                                </select>
                            </div>

                            <Input label="썸네일 URL" name="thumbnail_url" value={course.thumbnail_url || ''} onChange={handleCourseChange} />
                            <Input label="인트로 영상 URL" name="video_url" value={course.video_url || ''} onChange={handleCourseChange} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
