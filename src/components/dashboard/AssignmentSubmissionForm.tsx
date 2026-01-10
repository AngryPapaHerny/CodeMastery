"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase';

export function AssignmentSubmissionForm({ assignmentId, assignmentTitle }: { assignmentId: string | null, assignmentTitle?: string }) {
    const [githubUrl, setGithubUrl] = useState('');
    const [deployedUrl, setDeployedUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [user, setUser] = useState<any>(null);

    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignmentId || !user) return;

        setIsSubmitting(true);

        const content = `GitHub: ${githubUrl}\nDeployed: ${deployedUrl}\nNotes: ${notes}`;

        const { error } = await supabase.from('submissions').insert({
            assignment_id: assignmentId,
            student_id: user.id,
            content: content,
            status: 'submitted'
        });

        if (error) {
            alert('제출 실패: ' + error.message);
            setIsSubmitting(false);
        } else {
            setIsSubmitting(false);
            setIsSuccess(true);
            // Reset form
            setGithubUrl('');
            setDeployedUrl('');
            setNotes('');
        }
    };

    if (!assignmentId) {
        return (
            <Card style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>좌측 목록에서 과제를 선택해주세요.</p>
            </Card>
        );
    }

    if (isSuccess) {
        return (
            <Card style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>제출 완료!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    과제가 성공적으로 제출되었습니다. <br />
                    강사님의 리뷰가 완료되면 알림을 보내드립니다.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">수정하기 / 다시 제출</Button>
            </Card>
        );
    }

    return (
        <Card>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>과제 제출</h3>
            <div style={{ marginBottom: '24px', color: 'var(--primary)', fontWeight: 600 }}>{assignmentTitle}</div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Input
                    label="GitHub 저장소 URL"
                    placeholder="https://github.com/username/project"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    required
                />

                <Input
                    label="배포된 사이트 URL (Optional)"
                    placeholder="https://my-project.vercel.app"
                    value={deployedUrl}
                    onChange={(e) => setDeployedUrl(e.target.value)}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        질문이나 남기고 싶은 말
                    </label>
                    <textarea
                        style={{
                            padding: '12px 16px',
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            minHeight: '120px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none'
                        }}
                        placeholder="어려웠던 점이나 궁금한 점이 있다면 적어주세요."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} fullWidth size="lg">
                    {isSubmitting ? '제출 중...' : '과제 제출하기'}
                </Button>
            </form>
        </Card>
    );
}
