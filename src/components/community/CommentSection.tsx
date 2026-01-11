"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { User, CheckCircle, MoreVertical, Trash2 } from 'lucide-react';

interface CommentSectionProps {
    postId: string;
    currentUser: any;
    postAuthorId: string;
    isQnA: boolean;
}

export default function CommentSection({ postId, currentUser, postAuthorId, isQnA }: CommentSectionProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        // 1. Fetch Comments
        const { data: commentsData, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('is_accepted_answer', { ascending: false })
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching comments:', error);
            return;
        }

        if (!commentsData || commentsData.length === 0) {
            setComments([]);
            return;
        }

        // 2. Fetch Profiles for these comments
        const userIds = Array.from(new Set(commentsData.map(c => c.user_id)));

        const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);

        // 3. Merge data
        const commentsWithProfiles = commentsData.map(comment => {
            const profile = profilesData?.find(p => p.id === comment.user_id);
            return {
                ...comment,
                profiles: profile || null
            };
        });

        setComments(commentsWithProfiles);
    };

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        if (!currentUser) return alert('로그인이 필요합니다.');

        setLoading(true);
        const { error } = await supabase.from('comments').insert({
            post_id: postId,
            user_id: currentUser.id,
            content: newComment
        });

        if (error) {
            alert(error.message);
        } else {
            setNewComment('');
            fetchComments();
        }
        setLoading(false);
    };

    const handleAcceptAnswer = async (commentId: string) => {
        if (!confirm('이 답변을 채택하시겠습니까? 채택 후에는 변경할 수 없습니다.')) return;

        // 1. Mark comment as accepted
        const { error: commentError } = await supabase
            .from('comments')
            .update({ is_accepted_answer: true })
            .eq('id', commentId);

        // 2. Mark post as verified
        const { error: postError } = await supabase
            .from('posts')
            .update({ is_verified_answer: true })
            .eq('id', postId);

        if (!commentError && !postError) {
            // Trigger fetch to refresh UI
            fetchComments();
            // In a real app, trigger a server-side point transaction here
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('댓글을 삭제하시겠습니까?')) return;

        const { error } = await supabase.from('comments').delete().eq('id', commentId);
        if (!error) fetchComments();
    };

    return (
        <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
                답변 & 댓글 <span style={{ color: 'var(--primary)', marginLeft: '8px' }}>{comments.length}</span>
            </h3>

            {/* Comment List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                {comments.map((comment) => (
                    <div key={comment.id} style={{
                        display: 'flex', gap: '16px',
                        backgroundColor: comment.is_accepted_answer ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                        padding: comment.is_accepted_answer ? '20px' : '0',
                        borderRadius: '8px',
                        border: comment.is_accepted_answer ? '1px solid #15803d' : 'none'
                    }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#27272a', flexShrink: 0, overflow: 'hidden' }}>
                            {comment.profiles?.avatar_url ? (
                                <img src={comment.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={18} /></div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 600 }}>{comment.profiles?.full_name}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                    {comment.is_accepted_answer && (
                                        <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                            <CheckCircle size={14} style={{ marginRight: '4px' }} /> 채택된 답변
                                        </span>
                                    )}
                                </div>
                                {currentUser?.id === comment.user_id && (
                                    <button onClick={() => handleDelete(comment.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div style={{ fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#e4e4e7' }}>
                                {comment.content}
                            </div>

                            {/* QnA Action: If Current User is Author AND this is QnA AND not yet resolved */}
                            {isQnA && currentUser?.id === postAuthorId && !comment.is_accepted_answer && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    style={{ marginTop: '12px', fontSize: '0.8rem', borderColor: '#22c55e', color: '#22c55e' }}
                                    onClick={() => handleAcceptAnswer(comment.id)}
                                >
                                    <CheckCircle size={14} style={{ marginRight: '6px' }} />
                                    이 답변 채택하기
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Write Comment */}
            <Card style={{ padding: '24px', backgroundColor: '#18181b', border: '1px solid #27272a' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
                    {isQnA ? '답변 작성하기' : '댓글 작성하기'}
                </h4>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: '#09090b',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                        color: 'white',
                        outline: 'none',
                        marginBottom: '16px',
                        fontFamily: 'inherit'
                    }}
                    placeholder={currentUser ? "내용을 입력하세요..." : "로그인 후 작성할 수 있습니다."}
                    disabled={!currentUser}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleSubmit} disabled={loading || !newComment.trim() || !currentUser}>
                        {loading ? '등록 중...' : '등록'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
