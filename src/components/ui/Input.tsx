"use client";

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {label && (
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {label}
                </label>
            )}
            <input
                style={{
                    padding: '12px 16px',
                    backgroundColor: 'var(--background)',
                    border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    ...style,
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border)';
                }}
                {...props}
            />
            {error && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{error}</span>}
        </div>
    );
}
