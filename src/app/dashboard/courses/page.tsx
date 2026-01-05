"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function MyCoursesPage() {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>내 강의실</h1>

            <Card style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                }}>
                    <BookOpen size={32} color="var(--text-secondary)" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
                    수강 중인 강의가 없습니다.
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    새로운 지식을 탐험하고 성장을 시작해보세요.
                </p>
                <Link href="/courses">
                    <Button size="lg">강의 목록 보러가기</Button>
                </Link>
            </Card>
        </div>
    );
}
