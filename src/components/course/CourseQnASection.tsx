"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { MessageSquare, CheckCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CourseQnASection({ courseId }: { courseId: string }) {
    const [posts, setPosts] = useState<any[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchQnAPosts() {
            const { data } = await supabase
                .from('posts')
                .select(`
                    id, title, is_verified_answer, created_at,
                    profiles:user_id (full_name)
                `)
                .eq('course_id', courseId)
                .eq('category', 'qna')
                .order('created_at', { ascending: false });

            setPosts(data || []);
        }
        if (courseId) fetchQnAPosts();
    }, [courseId]);

    return (
        <div style={{ padding: '0 16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px', borderBottom: '1px solid #27272a' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                    강의를 듣다가 궁금한 점이 생기셨나요?
                </p>
                <Link href={`/community/new?cat=qna&course=${courseId}`}>
                    <Button fullWidth variant="outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                        <Plus size={16} style={{ marginRight: '8px' }} />
                        질문하기
                    </Button>
                </Link>
            </div>

            {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <p>아직 등록된 질문이 없습니다.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {posts.map(post => (
                        <div key={post.id}
                            onClick={() => window.open(`/community/${post.id}`, '_blank')}
                            style={{
                                padding: '12px',
                                backgroundColor: '#27272a',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px', lineHeight: 1.4 }}>
                                {post.title}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span>{post.profiles?.full_name}</span>
                                {post.is_verified_answer ? (
                                    <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center' }}>
                                        <CheckCircle size={12} style={{ marginRight: '4px' }} />
                                        해결됨
                                    </span>
                                ) : (
                                    <span>미해결</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
