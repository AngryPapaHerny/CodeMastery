"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Trash2, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminCommunityPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles:user_id (full_name, email)
            `)
            .order('created_at', { ascending: false });

        if (data) setPosts(data);
        setLoading(false);
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) {
            alert('삭제 실패: ' + error.message);
        } else {
            alert('게시글이 삭제되었습니다.');
            fetchPosts();
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>커뮤니티 관리</h1>

            <Card style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>전체 게시글 ({posts.length})</h2>
                    {/* Filter buttons could go here */}
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                    {loading ? (
                        <div>로딩 중...</div>
                    ) : posts.map(post => (
                        <div key={post.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            backgroundColor: '#27272a',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: post.category === 'qna' ? '#ef4444' : '#3b82f6',
                                        color: 'white'
                                    }}>
                                        {post.category.toUpperCase()}
                                    </span>
                                    <Link href={`/community/${post.id}`} target="_blank" style={{ fontWeight: 600, color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {post.title} <ExternalLink size={12} color="#71717a" />
                                    </Link>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    작성자: {post.profiles?.full_name} ({post.profiles?.email}) · {new Date(post.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                                <Trash2 size={16} /> 삭제
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
