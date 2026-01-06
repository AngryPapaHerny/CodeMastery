"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlayCircle, FileText, Menu, MessageSquare, StickyNote, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface ClassroomLayoutProps {
    course: any;
    lessons: any[];
    currentLesson: any;
    setCurrentLesson: (lesson: any) => void;
    renderVideoPlayer: (url: string) => React.ReactNode;
}

export default function ClassroomLayout({ course, lessons, currentLesson, setCurrentLesson, renderVideoPlayer }: ClassroomLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'curriculum' | 'qna' | 'notes'>('curriculum');

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const activeVideoUrl = currentLesson?.video_url || course.video_url;

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', paddingTop: '65px' }}>
            {/* Main Content Area (Video) */}
            <div style={{
                flex: 1,
                backgroundColor: '#000',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {renderVideoPlayer(activeVideoUrl)}
                </div>

                {/* Lesson Title Overlay or Bottom Bar */}
                <div style={{ padding: '20px', backgroundColor: '#18181b', borderTop: '1px solid #27272a' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                        {currentLesson ? `[${currentLesson.order_index + 1}강] ${currentLesson.title}` : course.title}
                    </h1>
                    {currentLesson?.material_url && (
                        <a href={currentLesson.material_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.9rem' }}>
                            <FileText size={16} /> 강의 자료 다운로드
                        </a>
                    )}
                </div>
            </div>

            {/* Right Sidebar */}
            <div style={{
                width: isSidebarOpen ? '400px' : '60px',
                backgroundColor: '#18181b',
                borderLeft: '1px solid #27272a',
                display: 'flex',
                transition: 'width 0.3s ease'
            }}>
                {/* Collapsible Content Panel */}
                {isSidebarOpen && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Panel Header */}
                        <div style={{
                            padding: '16px',
                            borderBottom: '1px solid #27272a',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontWeight: 600 }}>
                                {activeTab === 'curriculum' && '커리큘럼'}
                                {activeTab === 'qna' && '질문 & 답변'}
                                {activeTab === 'notes' && '노트'}
                            </span>
                            <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {activeTab === 'curriculum' && (
                                <div>
                                    {lessons.map((lesson, idx) => (
                                        <div
                                            key={lesson.id}
                                            onClick={() => setCurrentLesson(lesson)}
                                            style={{
                                                padding: '16px',
                                                borderBottom: '1px solid #27272a',
                                                cursor: 'pointer',
                                                backgroundColor: currentLesson?.id === lesson.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                                display: 'flex',
                                                gap: '12px'
                                            }}
                                        >
                                            <div style={{ marginTop: '2px' }}>
                                                <PlayCircle size={16} color={currentLesson?.id === lesson.id ? '#22c55e' : 'var(--text-secondary)'} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', color: currentLesson?.id === lesson.id ? '#fff' : 'var(--text-secondary)', marginBottom: '4px' }}>
                                                    {idx + 1}. {lesson.title}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#71717a' }}>10:00</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'qna' && (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <MessageSquare size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                    <p>질문 기능이 준비 중입니다.</p>
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <StickyNote size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                    <p>노트 기능이 준비 중입니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Sidebar Navigation Strip */}
                <div style={{
                    width: '60px',
                    borderLeft: isSidebarOpen ? '1px solid #27272a' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '16px',
                    gap: '24px',
                    backgroundColor: '#09090b',
                    zIndex: 10
                }}>
                    <SidebarTab
                        icon={<Menu size={24} />}
                        label="목차"
                        isActive={activeTab === 'curriculum' && isSidebarOpen}
                        onClick={() => {
                            if (activeTab === 'curriculum' && isSidebarOpen) {
                                setIsSidebarOpen(false);
                            } else {
                                setActiveTab('curriculum');
                                setIsSidebarOpen(true);
                            }
                        }}
                    />
                    <SidebarTab
                        icon={<MessageSquare size={24} />}
                        label="질문"
                        isActive={activeTab === 'qna' && isSidebarOpen}
                        onClick={() => {
                            if (activeTab === 'qna' && isSidebarOpen) {
                                setIsSidebarOpen(false);
                            } else {
                                setActiveTab('qna');
                                setIsSidebarOpen(true);
                            }
                        }}
                    />
                    <SidebarTab
                        icon={<StickyNote size={24} />}
                        label="노트"
                        isActive={activeTab === 'notes' && isSidebarOpen}
                        onClick={() => {
                            if (activeTab === 'notes' && isSidebarOpen) {
                                setIsSidebarOpen(false);
                            } else {
                                setActiveTab('notes');
                                setIsSidebarOpen(true);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function SidebarTab({ icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '8px 0',
                width: '100%',
                position: 'relative'
            }}
        >
            {icon}
            <span style={{ fontSize: '0.75rem' }}>{label}</span>
            {isActive && (
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '32px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '0 4px 4px 0'
                }} />
            )}
        </button>
    );
}
