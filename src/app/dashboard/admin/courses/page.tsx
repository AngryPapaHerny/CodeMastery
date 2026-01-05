"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminCourseListPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchCourses = async () => {
        const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        setCourses(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`정말로 강의 '${title}'을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;

        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (error) {
            alert('삭제 실패: ' + error.message);
        } else {
            alert('삭제되었습니다.');
            fetchCourses();
        }
    };

    if (loading) return <div style={{ padding: '40px' }}>로딩 중...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>강의 관리</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>등록된 강의를 수정하거나 관리합니다.</p>
                </div>
                <Link href="/dashboard/admin/courses/new">
                    <Button><Plus size={16} style={{ marginRight: '8px' }} /> 새 강의 등록</Button>
                </Link>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
                {courses.map((course) => (
                    <Card key={course.id} style={{ display: 'flex', alignItems: 'center', padding: '24px' }}>
                        <div style={{
                            width: '80px',
                            height: '50px',
                            borderRadius: '4px',
                            backgroundColor: '#333',
                            backgroundImage: `url(${course.thumbnail_url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            marginRight: '20px'
                        }} />

                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{course.title}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {course.level} • {course.price.toLocaleString()}원
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link href={`/dashboard/admin/courses/${course.id}/edit`}>
                                <Button variant="outline" size="sm">
                                    <Edit size={14} style={{ marginRight: '6px' }} /> 수정
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(course.id, course.title)} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </Card>
                ))}

                {courses.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                        등록된 강의가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
