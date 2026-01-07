"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="dashboard-container" style={{ position: 'relative' }}>
            {/* Mobile Sidebar Toggle */}
            <button
                className="mobile-only"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 60,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar with mobile class */}
            <div className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Sidebar />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="mobile-only"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 40,
                        top: '80px' // Below header
                    }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="dashboard-main">
                {children}
            </div>
        </div>
    );
}
