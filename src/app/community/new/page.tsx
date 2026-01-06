"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

import { Image as ImageIcon, Paperclip, X } from 'lucide-react';

function NewPostForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: searchParams.get('cat') || 'free',
        content: '',
        course_id: searchParams.get('course') || null
    });
    const [attachments, setAttachments] = useState<any[]>([]); // { name, url, type, size }
    const [isAdmin, setIsAdmin] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const checkRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (data?.role === 'admin') setIsAdmin(true);
            }
        };
        checkRole();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('community-uploads')
            .upload(filePath, file);

        if (uploadError) {
            alert('이미지 업로드 실패: ' + uploadError.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('community-uploads')
                .getPublicUrl(filePath);

            // Insert Markdown
            const markdown = `\n![${file.name}](${publicUrl})\n`;
            setFormData(prev => ({ ...prev, content: prev.content + markdown }));
        }
        setUploading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `files/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('community-uploads')
            .upload(filePath, file);

        if (uploadError) {
            alert('파일 업로드 실패: ' + uploadError.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('community-uploads')
                .getPublicUrl(filePath);

            setAttachments(prev => [...prev, {
                name: file.name,
                url: publicUrl,
                type: file.type,
                size: file.size
            }]);
        }
        setUploading(false);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/auth/login');
            return;
        }

        const payload: any = {
            user_id: user.id,
            title: formData.title,
            category: formData.category,
            content: formData.content,
            attachments: attachments
        };

        if (formData.course_id && formData.course_id !== '') {
            payload.course_id = formData.course_id;
        }

        const { error } = await supabase.from('posts').insert(payload);

        if (error) {
            console.error('Post insert error:', error);
            alert(`작성 실패: ${error.message} (${error.code})`);
            setLoading(false);
        } else {
            alert('게시글이 등록되었습니다.');
            router.push('/community');
            router.refresh();
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
                            {isAdmin && <option value="notice">📢 공지사항</option>}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            내용
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--primary)' }}>
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
                                <ImageIcon size={16} /> 이미지 삽입
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
                                <Paperclip size={16} /> 파일 첨부
                            </label>
                        </div>
                    </div>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={20}
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            color: 'white',
                            outline: 'none',
                            fontFamily: 'monospace',
                            lineHeight: 1.6,
                            resize: 'vertical'
                        }}
                        placeholder={`내용을 입력하세요.\n\n코드 블록은 아래와 같이 작성할 수 있습니다:\n\n\`\`\`python\nprint("Hello World")\n\`\`\``}
                        required
                    />
                </div>

                {/* Attachments List */}
                {attachments.length > 0 && (
                    <div style={{ padding: '16px', backgroundColor: '#27272a', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>첨부파일</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {attachments.map((file, idx) => (
                                <div key={idx} style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 12px', backgroundColor: '#3f3f46', borderRadius: '4px', fontSize: '0.85rem'
                                }}>
                                    <Paperclip size={14} />
                                    <span>{file.name}</span>
                                    <button type="button" onClick={() => removeAttachment(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <Button type="submit" size="lg" disabled={loading || uploading}>
                        {uploading ? '업로드 중...' : loading ? '등록 중...' : '게시글 등록'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default function NewPostPage() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 0' }}>
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
