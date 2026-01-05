import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export function Card({ children, hover = false, style, className = '', ...props }: CardProps) {
    const baseStyles: React.CSSProperties = {
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        ...style,
    };

    return (
        <div
            style={baseStyles}
            className={`${hover ? 'card-hover' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
