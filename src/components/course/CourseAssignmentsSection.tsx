"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface CourseAssignmentsSectionProps {
    courseId: string;
}

export default function CourseAssignmentsSection({ courseId }: CourseAssignmentsSectionProps) {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, [courseId]);

    async function fetchData() {
        setLoading(true);

        // 1. Fetch Assignments
        const { data: assignmentsData } = await supabase
            .from('assignments')
            .select('*')
            .eq('course_id', courseId)
            .order('created_at', { ascending: false });

        setAssignments(assignmentsData || []);

        // 2. Fetch User's Submissions
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: submissionsData } = await supabase
                .from('submissions')
                .select('*')
                .eq('student_id', user.id)
                .in('assignment_id', (assignmentsData || []).map(a => a.id));

            setSubmissions(submissionsData || []);
        }

        setLoading(false);
    }

    const handleSubmit = async () => {
        if (!submissionContent.trim()) return alert('내용을 입력해주세요.');
        setSubmitting(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('submissions').insert({
            assignment_id: selectedAssignment.id,
            student_id: user.id,
            content: submissionContent,
            status: 'submitted'
        });

        if (error) {
            alert('제출 실패: ' + error.message);
        } else {
            alert('과제가 제출되었습니다.');
            setSubmissionContent('');
            setSelectedAssignment(null);
            fetchData(); // Refresh list to show status
        }
        setSubmitting(false);
    };

    if (loading) return <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>로딩 중...</div>;

    // View: List
    if (!selectedAssignment) {
        if (assignments.length === 0) {
            return (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    등록된 과제가 없습니다.
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                {assignments.map((assignment) => {
                    const submission = submissions.find(s => s.assignment_id === assignment.id);
                    const isSubmitted = !!submission;
                    const isGraded = submission?.status === 'graded';

                    return (
                        <Card
                            key={assignment.id}
                            hover
                            onClick={() => setSelectedAssignment(assignment)}
                            style={{ padding: '20px', cursor: 'pointer', border: isSubmitted ? '1px solid #22c55e' : '1px solid var(--border)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '1.1rem' }}>{assignment.title}</h3>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        마감: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : '기한 없음'} | {assignment.points}점
                                    </div>
                                    {isSubmitted ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <CheckCircle size={16} />
                                            {isGraded ? `채점 완료 (${submission.grade}점)` : '제출됨'}
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308', fontSize: '0.9rem' }}>
                                            <Clock size={16} /> 미제출
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        );
    }

    // View: Detail & Submit
    const mySubmission = submissions.find(s => s.assignment_id === selectedAssignment.id);

    return (
        <div style={{ padding: '24px' }}>
            <Button variant="ghost" onClick={() => setSelectedAssignment(null)} style={{ marginBottom: '16px', paddingLeft: 0, color: 'var(--text-secondary)' }}>
                ← 목록으로 돌아가기
            </Button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>{selectedAssignment.title}</h2>

            <div style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '24px',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                color: '#e4e4e7'
            }}>
                {selectedAssignment.description}
            </div>

            {mySubmission ? (
                <Card style={{ padding: '24px', border: '1px solid #22c55e' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '16px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={20} /> 제출 완료
                    </h3>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>제출 내용</div>
                        <div style={{ padding: '12px', backgroundColor: '#000', borderRadius: '6px' }}>{mySubmission.content}</div>
                    </div>
                    {mySubmission.grade !== null && (
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>점수</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{mySubmission.grade} / {selectedAssignment.points}</div>
                        </div>
                    )}
                    {mySubmission.feedback && (
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>피드백</div>
                            <div style={{ padding: '12px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px', color: '#86efac' }}>
                                {mySubmission.feedback}
                            </div>
                        </div>
                    )}
                </Card>
            ) : (
                <Card style={{ padding: '24px' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>과제 제출</h3>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            답안 내용 (또는 링크)
                        </label>
                        <textarea
                            value={submissionContent}
                            onChange={(e) => setSubmissionContent(e.target.value)}
                            rows={6}
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
                            placeholder="답안을 작성하거나 GitHub/Google Drive 링크를 입력하세요."
                        />
                    </div>
                    <Button fullWidth size="lg" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? '제출 중...' : '제출하기'}
                    </Button>
                </Card>
            )}
        </div>
    );
}
