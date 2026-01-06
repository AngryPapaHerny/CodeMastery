"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { MessageSquare, ThumbsUp, Eye, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PostList() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const category = searchParams.get('cat');

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            const supabase = createClient();

            let query = supabase
                .from('posts')
                .select(`
                    *,
                    profiles:user_id (full_name, avatar_url)
                `)
                .order('created_at', { ascending: false });

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) {
                console.error(error);
            } else {
                setPosts(data || []);
            }

            setLoading(false);
        }
        fetchPosts();
    }, [category]);

    if (loading) return <div>게시글을 불러오는 중...</div>;

    if (posts.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                등록된 게시글이 없습니다. 첫 번째 글을 작성해보세요!
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {posts.map((post) => (
                <Link key={post.id} href={`/community/${post.id}`}>
                    <Card hover style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: categoryColors[post.category] || '#333',
                                        color: 'white',
                                        fontWeight: 600
                                    }}>
                                        {categoryNames[post.category] || post.category}
                                    </span>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                                        {post.title}
                                    </h3>
                                    {post.is_verified_answer && (
                                        <div style={{ display: 'flex', alignItems: 'center', color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>
                                            <CheckCircle size={14} style={{ marginRight: '4px' }} />
                                            해결됨
                                        </div>
                                    )}
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {post.content.replace(/[#*`]/g, '')}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{post.profiles?.full_name || '익명'}</span>
                                <span>•</span>
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Eye size={16} /> {post.view_count || 0}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MessageSquare size={16} /> 0
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ThumbsUp size={16} /> 0
                                </div>
                            </div>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

const categoryNames: any = {
    'qna': '질문 & 답변',
    'free': '자유게시판',
    'notice': '공지사항'
};

const categoryColors: any = {
    'qna': '#ef4444',
    'free': '#3b82f6',
    'notice': '#eab308'
};
