"use client";

import { Card } from '@/components/ui/Card';
import { Award } from 'lucide-react';

export default function CertificatesPage() {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>수료증</h1>

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
                    <Award size={32} color="var(--text-secondary)" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
                    발급된 수료증이 없습니다.
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    강의를 100% 완강하면 수료증이 발급됩니다.
                </p>
            </Card>
        </div>
    );
}
