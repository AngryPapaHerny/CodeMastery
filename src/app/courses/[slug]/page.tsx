"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
    const [activeTab, setActiveTab] = useState<'content' | 'qna'>('content');

    // Helper to safely unwrap params
    const { slug } = React.use(params as any) as { slug: string };

    return (
        <div className="container" style={{ padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
            {/* Main Content Area */}
            <div>
                <div style={{
                    aspectRatio: '16/9',
                    backgroundColor: 'black',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)'
                }}>
                    {/* Mock Video Player */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>▶️</div>
                        <p>Video Player Placeholder for {slug}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>
                        제 1강: Next.js 14 환경 설정과 아키텍처 이해
                    </h1>
                    <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                        <button
                            onClick={() => setActiveTab('content')}
                            style={{
                                padding: '12px 0',
                                borderBottom: activeTab === 'content' ? '2px solid var(--primary)' : '2px solid transparent',
                                fontWeight: activeTab === 'content' ? 700 : 400,
                                color: activeTab === 'content' ? 'var(--text-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            강의 자료
                        </button>
                        <button
                            onClick={() => setActiveTab('qna')}
                            style={{
                                padding: '12px 0',
                                borderBottom: activeTab === 'qna' ? '2px solid var(--primary)' : '2px solid transparent',
                                fontWeight: activeTab === 'qna' ? 700 : 400,
                                color: activeTab === 'qna' ? 'var(--text-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            질문 & 답변
                        </button>
                    </div>

                    <div style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                        <p>
                            이번 강의에서는 Next.js 14의 새로운 App Router 아키텍처에 대해 알아봅니다.
                            파일 시스템 기반 라우팅과 서버 컴포넌트의 개념을 확실하게 잡아봅시다.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar: Curriculum */}
            <div>
                <Card style={{ position: 'sticky', top: '100px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>커리큘럼</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <CurriculumItem active title="01. 환경 설정과 아키텍처" duration="12:40" />
                        <CurriculumItem title="02. Routing Fundamentals" duration="15:30" />
                        <CurriculumItem title="03. Server vs Client Components" duration="20:10" />
                        <CurriculumItem title="04. Data Fetching Patterns" duration="18:45" />
                        <CurriculumItem title="05. Styling Modern Apps" duration="14:20" />
                    </div>

                    <Button fullWidth style={{ marginTop: '24px' }}>과제 제출하기</Button>
                </Card>
            </div>
        </div>
    );
}

function CurriculumItem({ title, duration, active = false }: { title: string, duration: string, active?: boolean }) {
    return (
        <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: active ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <span style={{ fontSize: '0.95rem', fontWeight: active ? 600 : 400 }}>{title}</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{duration}</span>
        </div>
    );
}
