import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import PostList from '@/components/community/PostList';

export default async function CommunityPage() {
    return (
        <div style={{ padding: '80px 0', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                            개발자 <span className="text-gradient">커뮤니티</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            지식을 공유하고 함께 성장하세요.
                        </p>
                    </div>
                    {/* Write Button - Link to new post page (to be created) */}
                    <Link href="/community/new">
                        <Button size="lg">글 작성하기</Button>
                    </Link>
                </div>

                {/* Tabs (Simple Link-based or Client Component for now, let's just list posts) */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                    <Link href="/community" style={{ fontWeight: 700, borderBottom: '2px solid var(--primary)', paddingBottom: '14px', color: 'white' }}>전체</Link>
                    <Link href="/community?cat=qna" style={{ color: 'var(--text-secondary)' }}>Q&A</Link>
                    <Link href="/community?cat=free" style={{ color: 'var(--text-secondary)' }}>자유게시판</Link>
                    <Link href="/community?cat=notice" style={{ color: 'var(--text-secondary)' }}>공지사항</Link>
                </div>

                <PostList />
            </div>
        </div>
    );
}
