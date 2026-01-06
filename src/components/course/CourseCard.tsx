import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface CourseCardProps {
    id: string;
    title: string;
    description: string;
    level: string;
    thumbnail: string;
    price: number;
    isEnrolled?: boolean;
}

export function CourseCard({ id, title, description, level, thumbnail, price, isEnrolled }: CourseCardProps) {
    return (
        <Card hover style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: isEnrolled ? '1px solid var(--primary)' : 'none' }}>
            <div style={{
                height: '200px',
                backgroundColor: '#2a2a30',
                backgroundImage: `url(${thumbnail})`, // In real app, use next/image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 12px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'white',
                    backdropFilter: 'blur(4px)'
                }}>
                    {level}
                </div>

                {isEnrolled && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '4px 12px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        학습 중
                    </div>
                )}
            </div>
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', flex: 1, lineHeight: 1.5 }}>
                    {description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: isEnrolled ? 'var(--primary)' : 'white' }}>
                        {isEnrolled ? '수강 중' : `${price.toLocaleString()}원`}
                    </span>
                    <Link href={`/courses/${id}`}>
                        <Button size="sm" variant={isEnrolled ? "outline" : "primary"} style={isEnrolled ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {}}>
                            {isEnrolled ? '이어 학습하기' : '수강하기'}
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
