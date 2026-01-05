"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AssignmentSubmissionForm() {
    const [githubUrl, setGithubUrl] = useState('');
    const [deployedUrl, setDeployedUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <Card style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>제출 완료!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    과제가 성공적으로 제출되었습니다. <br />
                    강사님의 리뷰가 완료되면 알림을 보내드립니다.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">다른 과제 제출하기</Button>
            </Card>
        );
    }

    return (
        <Card>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>과제 제출</h3>
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
