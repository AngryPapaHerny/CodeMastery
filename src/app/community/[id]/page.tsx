"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ArrowLeft, User, Clock, Eye, MessageSquare, Tag, CheckCircle, Paperclip } from 'lucide-react';
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
    const router = useRouter(); // Added router
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null); // To check admin role

    const supabase = createClient();

    useEffect(() => {
        async function fetchPost() {
            setLoading(true);

            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            if (user) {
                const { data: userProfile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                setProfile(userProfile);
            }

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

    const handleDelete = async () => {
        if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

        const { data, error } = await supabase.from('posts').delete().eq('id', id).select();

        if (error) {
            alert('삭제 실패: ' + error.message);
        } else if (!data || data.length === 0) {
            alert('삭제 실패: 게시글을 찾을 수 없거나 권한이 없습니다.');
        } else {
            alert('게시글이 삭제되었습니다.');
            router.push('/community');
            router.refresh();
        }
    };

    if (loading) return <div style={{ padding: '100px 0', textAlign: 'center' }}>글을 불러오는 중...</div>;

    if (!post) return <div style={{ padding: '100px 0', textAlign: 'center' }}>게시글을 찾을 수 없습니다.</div>;

    const isAuthor = currentUser?.id === post.user_id;
    const isAdmin = profile?.role === 'admin';
    const canManage = isAuthor || isAdmin;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 0' }}>
            {/* Header / Nav */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={16} /> 목록으로 돌아가기
                </Link>

                {canManage && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/community/${id}/edit`}>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#27272a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}>
                                수정
                            </button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}>
                            삭제
                        </button>
                    </div>
                )}
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
                                {post.updated_at && post.updated_at !== post.created_at && (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginLeft: '8px' }}>
                                        (수정됨: {new Date(post.updated_at).toLocaleDateString()})
                                    </span>
                                )}
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

                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                    <div style={{ marginBottom: '60px', padding: '20px', backgroundColor: '#27272a', borderRadius: '8px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Paperclip size={18} /> 첨부파일 <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{post.attachments.length}개</span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {post.attachments.map((file: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px 16px', backgroundColor: '#3f3f46', borderRadius: '6px',
                                        color: 'white', textDecoration: 'none', transition: 'background 0.2s'
                                    }}
                                    className="hover:bg-zinc-600"
                                >
                                    <div style={{ padding: '8px', backgroundColor: '#52525b', borderRadius: '4px' }}>
                                        <Paperclip size={16} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{file.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{(file.size / 1024).toFixed(1)} KB</div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#3b82f6' }}>다운로드</div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <CommentSection postId={post.id} currentUser={currentUser} postAuthorId={post.user_id} isQnA={post.category === 'qna'} />

            </div>
        </div>
    );
}
