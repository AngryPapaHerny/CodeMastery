"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

function NewPostForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: searchParams.get('cat') || 'free',
        content: '',
        course_id: searchParams.get('course') || null
    });

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/auth/login');
            return;
        }

        const { error } = await supabase.from('posts').insert({
            user_id: user.id,
            title: formData.title,
            category: formData.category,
            content: formData.content,
            course_id: formData.course_id
        });

        if (error) {
            alert(`Error: ${error.message}`);
            setLoading(false);
        } else {
            router.push('/community');
        }
    };

    return (
        <Card style={{ padding: '40px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                            카테고리
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                            <option value="free">자유게시판</option>
                            <option value="qna">질문 & 답변</option>
                            {/* Notice is admin only, hidden for now or handled via policy */}
                        </select>
                    </div>
                    <Input
                        label="제목"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="제목을 입력하세요"
                        required
                    />
                </div>

                <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                        내용
                    </label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={15}
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#18181b', // Input bg
                            border: '1px solid #27272a', // Input border
                            borderRadius: '8px',
                            color: 'white',
                            outline: 'none',
                            fontFamily: 'monospace',
                            lineHeight: 1.6
                        }}
                        placeholder={`내용을 입력하세요.\n\n코드 블록은 아래와 같이 작성할 수 있습니다:\n\n\`\`\`python\nprint("Hello World")\n\`\`\``}
                        required
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <Button type="submit" size="lg" disabled={loading}>
                        {loading ? '등록 중...' : '게시글 등록'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default function NewPostPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 0' }}>
            <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                <ArrowLeft size={16} /> 목록으로 돌아가기
            </Link>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>글 작성하기</h1>

            <Suspense fallback={<div>Loading...</div>}>
                <NewPostForm />
            </Suspense>
        </div>
    );
}
