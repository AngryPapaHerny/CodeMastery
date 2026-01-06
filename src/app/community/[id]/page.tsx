"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ArrowLeft, User, Clock, Eye, MessageSquare, Tag, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import CommentSection from '@/components/community/CommentSection';

// Category badge
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

export default function PostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchPost() {
            setLoading(true);

            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // 2. Get Post
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    profiles:user_id (id, full_name, avatar_url, level)
                `)
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching post:", error);
                // Handle 404
            } else {
                setPost(data);
                // Increment view count (optimistic)
                await supabase.rpc('increment_view_count', { row_id: id });
            }
            setLoading(false);
        }

        if (id) fetchPost();
    }, [id]);

    if (loading) return <div style={{ padding: '100px 0', textAlign: 'center' }}>글을 불러오는 중...</div>;

    if (!post) return <div style={{ padding: '100px 0', textAlign: 'center' }}>게시글을 찾을 수 없습니다.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 0' }}>
            {/* Header / Nav */}
            <div style={{ marginBottom: '24px' }}>
                <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={16} /> 목록으로 돌아가기
                </Link>
            </div>

            {/* Post Content */}
            <div style={{ padding: '0 20px' }}>
                {/* Meta */}
                <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{
                        fontSize: '0.9rem',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: categoryColors[post.category] || '#333',
                        color: 'white',
                        fontWeight: 600
                    }}>
                        {categoryNames[post.category] || post.category}
                    </span>
                    {post.is_verified_answer && (
                        <div style={{ display: 'flex', alignItems: 'center', color: '#22c55e', fontSize: '0.9rem', fontWeight: 600 }}>
                            <CheckCircle size={14} style={{ marginRight: '4px' }} />
                            해결 완료
                        </div>
                    )}
                </div>

                {/* Title */}
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.3 }}>
                    {post.title}
                </h1>

                {/* Author Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', overflow: 'hidden' }}>
                            {post.profiles?.avatar_url ? (
                                <img src={post.profiles.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}><User size={20} /></div>
                            )}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700 }}>{post.profiles?.full_name || '알 수 없음'}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {new Date(post.created_at).toLocaleDateString()} · {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={16} /> {post.view_count || 0}</span>
                    </div>
                </div>

                {/* Body */}
                <div style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '60px', whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </div>

                {/* Comments Section */}
                <CommentSection postId={post.id} currentUser={currentUser} postAuthorId={post.user_id} isQnA={post.category === 'qna'} />

            </div>
        </div>
    );
}
