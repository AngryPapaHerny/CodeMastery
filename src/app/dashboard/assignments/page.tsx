"use client";

import { AssignmentSubmissionForm } from '@/components/dashboard/AssignmentSubmissionForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AssignmentsPage() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>과제 관리</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <AssignmentCard
                        title="미션 1: 나만의 포트폴리오 만들기"
                        dueDate="2026. 01. 10"
                        status="active"
                    />
                    <AssignmentCard
                        title="미션 2: 게시판 CRUD 구현 (API 연동)"
                        dueDate="2026. 01. 17"
                        status="locked"
                    />
                    <AssignmentCard
                        title="미션 3: 상태 관리 라이브러리 활용"
                        dueDate="2026. 01. 24"
                        status="locked"
                    />
                </div>
            </div>

            <div>
                {/* sticky form */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <AssignmentSubmissionForm />
                </div>
            </div>
        </div>
    );
}

function AssignmentCard({ title, dueDate, status }: { title: string, dueDate: string, status: 'active' | 'completed' | 'locked' }) {
    const isLocked = status === 'locked';

    return (
        <Card
            style={{
                opacity: isLocked ? 0.6 : 1,
                borderColor: status === 'active' ? 'var(--primary)' : 'var(--border)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
                {status === 'active' && <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>진행 중</span>}
                {status === 'locked' && <span style={{ fontSize: '1.2rem' }}>🔒</span>}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                마감일: {dueDate}까지
            </p>
            <Button
                variant={status === 'active' ? 'primary' : 'outline'}
                size="sm"
                disabled={isLocked}
                style={{ width: '100%' }}
            >
                {status === 'active' ? '제출하러 가기' : isLocked ? '오픈 예정' : '다시 보기'}
            </Button>
        </Card>
    );
}
