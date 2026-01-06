"use client";

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: courseId } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        points: 100
    });

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('assignments').insert({
            course_id: courseId,
            title: formData.title,
            description: formData.description,
            due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
            points: formData.points
        });

        if (error) {
            alert(`Error: ${error.message}`);
            setLoading(false);
        } else {
            alert('과제가 생성되었습니다.');
            router.push(`/dashboard/admin/courses/${courseId}/edit`); // Redirect to course edit page
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 0' }}>
            <Link href={`/dashboard/admin/courses/${courseId}/edit`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                <ArrowLeft size={16} /> 코스 관리로 돌아가기
            </Link>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>새 과제 만들기</h1>

            <Card style={{ padding: '40px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Input
                        label="과제 제목"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="예: 중간고사 프로젝트 제출"
                        required
                    />

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                            설명
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={10}
                            style={{
                                width: '100%',
                                padding: '16px',
                                backgroundColor: '#18181b',
                                border: '1px solid #27272a',
                                borderRadius: '8px',
                                color: 'white',
                                outline: 'none',
                                lineHeight: 1.6
                            }}
                            placeholder="과제에 대한 설명을 입력하세요."
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                                마감 기한
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#18181b',
                                    border: '1px solid #27272a',
                                    borderRadius: '8px',
                                    color: 'white',
                                    outline: 'none',
                                    colorScheme: 'dark'
                                }}
                                required
                            />
                        </div>
                        <Input
                            label="배점"
                            type="number"
                            value={formData.points}
                            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <Button type="submit" size="lg" disabled={loading}>
                            {loading ? '생성 중...' : '과제 생성하기'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
