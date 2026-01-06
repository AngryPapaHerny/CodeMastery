"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle, Clock, ExternalLink } from 'lucide-react';

interface SubmissionListProps {
    assignmentId: string;
    points: number;
}

export default function SubmissionList({ assignmentId, points }: SubmissionListProps) {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [gradingId, setGradingId] = useState<string | null>(null);
    const [gradeData, setGradeData] = useState({ grade: 0, feedback: '' });

    const supabase = createClient();

    useEffect(() => {
        fetchSubmissions();
    }, [assignmentId]);

    const fetchSubmissions = async () => {
        setLoading(true);
        // Fetch submissions with student profile
        // Note: We need to handle joining with profiles. 
        // Assuming submissions has student_id, and we can fetch profiles separately or via join if setup.
        // For simplicity, let's fetch submissions first.

        const { data, error } = await supabase
            .from('submissions')
            .select(`
                *,
                profiles:student_id (full_name, email)
            `)
            .eq('assignment_id', assignmentId)
            .order('created_at', { ascending: false });

        if (error) console.error(error);
        setSubmissions(data || []);
        setLoading(false);
    };

    const handleGradeClick = (submission: any) => {
        setGradingId(submission.id);
        setGradeData({
            grade: submission.grade || 0,
            feedback: submission.feedback || ''
        });
    };

    const handleSaveGrade = async (id: string) => {
        const { error } = await supabase
            .from('submissions')
            .update({
                grade: gradeData.grade,
                feedback: gradeData.feedback,
                status: 'graded'
            })
            .eq('id', id);

        if (error) {
            alert('초점 저장 실패: ' + error.message);
        } else {
            alert('채점이 완료되었습니다.');
            setGradingId(null);
            fetchSubmissions();
        }
    };

    if (loading) return <div>제출 내역을 불러오는 중...</div>;

    if (submissions.length === 0) {
        return <div style={{ color: 'var(--text-secondary)' }}>아직 제출된 과제가 없습니다.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {submissions.map((sub) => (
                <Card key={sub.id} style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>
                                {sub.profiles?.full_name || '알 수 없는 사용자'}
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '8px' }}>
                                    ({new Date(sub.created_at).toLocaleString()})
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {sub.status === 'graded' ? (
                                    <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
                                        <CheckCircle size={14} /> 채점 완료 ({sub.grade}/{points}점)
                                    </span>
                                ) : (
                                    <span style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                                        <Clock size={14} /> 채점 대기중
                                    </span>
                                )}
                            </div>
                        </div>
                        {gradingId !== sub.id && (
                            <Button size="sm" onClick={() => handleGradeClick(sub)}>
                                {sub.status === 'graded' ? '수정하기' : '채점하기'}
                            </Button>
                        )}
                    </div>

                    <div style={{ backgroundColor: '#18181b', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.95rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.8rem' }}>제출 내용:</div>
                        {sub.content.startsWith('http') ? (
                            <a href={sub.content} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ExternalLink size={14} /> {sub.content}
                            </a>
                        ) : (
                            <div style={{ whiteSpace: 'pre-wrap' }}>{sub.content}</div>
                        )}
                    </div>

                    {gradingId === sub.id && (
                        <div style={{ backgroundColor: '#27272a', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>채점 및 피드백</h4>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                                <div style={{ width: '120px' }}>
                                    <Input
                                        type="number"
                                        label={`점수 (만점: ${points})`}
                                        value={gradeData.grade}
                                        onChange={(e) => setGradeData({ ...gradeData, grade: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>피드백</label>
                                    <input
                                        type="text"
                                        value={gradeData.feedback}
                                        onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                                        placeholder="학생에게 남길 코멘트..."
                                        style={{
                                            width: '100%', padding: '10px', borderRadius: '6px',
                                            border: '1px solid var(--border)', backgroundColor: '#09090b', color: 'white'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <Button variant="ghost" size="sm" onClick={() => setGradingId(null)}>취소</Button>
                                <Button size="sm" onClick={() => handleSaveGrade(sub.id)}>저장하기</Button>
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
