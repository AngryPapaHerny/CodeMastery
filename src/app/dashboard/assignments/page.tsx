"use client";

import { useEffect, useState } from 'react';
import { AssignmentSubmissionForm } from '@/components/dashboard/AssignmentSubmissionForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchAssignments = async () => {
            const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .order('due_date', { ascending: true });

            if (data) {
                setAssignments(data);
                // Auto-select first if available
                if (data.length > 0 && !selectedAssignmentId) {
                    // setSelectedAssignmentId(data[0].id); // Optional: auto select
                }
            }
            setLoading(false);
        };
        fetchAssignments();
    }, []);

    const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>과제 관리</h1>

                {loading ? (
                    <div>로딩 중...</div>
                ) : assignments.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        등록된 과제가 없습니다.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {assignments.map((assignment) => (
                            <AssignmentCard
                                key={assignment.id}
                                title={assignment.title}
                                dueDate={assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : '기한 없음'}
                                points={assignment.points}
                                status={'active'} // TODO: Determine status based on submission
                                onClick={() => setSelectedAssignmentId(assignment.id)}
                                isSelected={selectedAssignmentId === assignment.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div>
                {/* sticky form */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <AssignmentSubmissionForm
                        assignmentId={selectedAssignmentId}
                        assignmentTitle={selectedAssignment?.title}
                    />
                </div>
            </div>
        </div>
    );
}

function AssignmentCard({
    title,
    dueDate,
    points,
    status,
    onClick,
    isSelected
}: {
    title: string,
    dueDate: string,
    points: number,
    status: 'active' | 'completed' | 'locked',
    onClick: () => void,
    isSelected: boolean
}) {
    const isLocked = status === 'locked';

    return (
        <Card
            style={{
                opacity: isLocked ? 0.6 : 1,
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                borderWidth: isSelected ? '2px' : '1px',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
                {status === 'active' && <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>진행 중</span>}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                마감일: {dueDate}까지
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                배점: {points}점
            </p>
            <Button
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                disabled={isLocked}
                style={{ width: '100%' }}
            >
                {isSelected ? '선택됨' : '제출하러 가기'}
            </Button>
        </Card>
    );
}
