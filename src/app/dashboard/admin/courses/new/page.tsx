"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'Beginner',
        price: '',
        thumbnail_url: '',
        video_url: ''
    });

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('courses').insert({
            title: formData.title,
            description: formData.description,
            level: formData.level,
            price: parseInt(formData.price || '0'),
            thumbnail_url: formData.thumbnail_url,
            video_url: formData.video_url
        });

        if (error) {
            alert(`Error: ${error.message}`);
            setLoading(false);
        } else {
            alert('강의가 성공적으로 등록되었습다.');
            router.push('/dashboard/admin');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/dashboard/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                <ArrowLeft size={16} /> 돌아가기
            </Link>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>새 강의 업로드</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                새로운 강의 콘텐츠를 생성합니다. 동영상 URL을 입력하면 강의 상세 페이지에서 재생할 수 있습니다.
            </p>

            <Card style={{ padding: '40px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Input
                        label="강의 제목"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="예: Next.js 완벽 가이드"
                        required
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            강의 설명
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#18181b', // Input bg
                                border: '1px solid #27272a', // Input border
                                borderRadius: '8px',
                                color: 'white',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                            placeholder="강의에 대한 상세한 설명을 입력하세요."
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                난이도
                            </label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#18181b',
                                    border: '1px solid #27272a',
                                    borderRadius: '8px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            >
                                <option value="Beginner">입문 (Beginner)</option>
                                <option value="Intermediate">중급 (Intermediate)</option>
                                <option value="Advanced">고급 (Advanced)</option>
                            </select>
                        </div>
                        <Input
                            label="가격 (원)"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0"
                            required
                        />
                    </div>

                    <Input
                        label="썸네일 이미지 URL"
                        name="thumbnail_url"
                        value={formData.thumbnail_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />

                    <Input
                        label="강의 동영상 URL (mp4, webm 등)"
                        name="video_url"
                        value={formData.video_url}
                        onChange={handleChange}
                        placeholder="https://example.com/video.mp4"
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <Button type="submit" size="lg" disabled={loading}>
                            {loading ? '업로드 중...' : '강의 생성하기'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
