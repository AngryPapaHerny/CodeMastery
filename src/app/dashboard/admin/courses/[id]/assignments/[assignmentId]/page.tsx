"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import SubmissionList from '@/components/dashboard/SubmissionList';

export default function AdminAssignmentPage({ params }: { params: Promise<{ id: string; assignmentId: string }> }) {
    const { id: courseId, assignmentId } = use(params);
    const router = useRouter();
    const [assignment, setAssignment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchAssignment() {
            const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .eq('id', assignmentId)
                .single();

            if (error) {
                console.error(error);
                router.push(`/dashboard/admin/courses/${courseId}/edit`);
                return;
            }
            setAssignment(data);
            setLoading(false);
        }
        fetchAssignment();
    }, [assignmentId, courseId, router]);

    const handleDelete = async () => {
        if (!confirm('정말 이 과제를 삭제하시겠습니까? 모든 제출 내역이 사라집니다.')) return;

        const { error } = await supabase
            .from('assignments')
            .delete()
            .eq('id', assignmentId);

        if (error) {
            alert('삭제 실패: ' + error.message);
        } else {
            alert('삭제되었습니다.');
            router.push(`/dashboard/admin/courses/${courseId}/edit`);
        }
    };

    if (loading) return <div style={{ padding: '40px' }}>로딩 중...</div>;
    if (!assignment) return <div>과제를 찾을 수 없습니다.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <Link href={`/dashboard/admin/courses/${courseId}/edit`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={16} /> 코스 관리로 돌아가기
                </Link>
                <Button variant="ghost" onClick={handleDelete} style={{ color: '#ef4444' }}>
                    <Trash2 size={16} style={{ marginRight: '8px' }} /> 과제 삭제
                </Button>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>{assignment.title}</h1>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    <span>배점: {assignment.points}점</span>
                    <span>마감: {assignment.due_date ? new Date(assignment.due_date).toLocaleString() : '기한 없음'}</span>
                </div>
                <Card style={{ padding: '24px', backgroundColor: '#18181b', color: '#e4e4e7' }}>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{assignment.description}</div>
                </Card>
            </div>

            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>제출 현황 및 채점</h2>
                <SubmissionList assignmentId={assignmentId} points={assignment.points} />
            </div>
        </div>
    );
}
