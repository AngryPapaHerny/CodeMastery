"use client";

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { Bell, Check } from 'lucide-react';
import Link from 'next/link';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_read).length);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Optional: Realtime subscription could be added here
        // ...

        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleNotificationClick = async (notification: any) => {
        if (!notification.is_read) {
            await handleMarkAsRead(notification.id);
        }
        setIsOpen(false);
        // Navigate based on type... handled by Link wrapper in render
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        border: '1px solid #000'
                    }} />
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '320px',
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    padding: '8px 0',
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid #27272a', fontWeight: 600, fontSize: '0.9rem' }}>
                        알림 ({unreadCount})
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                새로운 알림이 없습니다.
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <Link
                                    href={`/community/${notification.source_id}`} // Assuming source_id is post_id for now
                                    key={notification.id}
                                    style={{ textDecoration: 'none' }}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div style={{
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #27272a',
                                        backgroundColor: notification.is_read ? 'transparent' : 'rgba(34, 197, 94, 0.05)',
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'start',
                                        transition: 'background 0.2s'
                                    }}>
                                        <div style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            backgroundColor: notification.is_read ? 'transparent' : '#22c55e',
                                            marginTop: '6px'
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '4px', lineHeight: 1.4 }}>
                                                {notification.message}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
