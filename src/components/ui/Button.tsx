import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    style,
    ...props
}: ButtonProps) {
    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        border: '1px solid transparent',
        ...style,
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary)',
            color: 'white',
            boxShadow: '0 0 15px var(--primary-glow)',
        },
        secondary: {
            backgroundColor: 'var(--secondary)',
            color: 'white',
        },
        outline: {
            backgroundColor: 'transparent',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
        },
    };

    const sizes = {
        sm: { padding: '8px 16px', fontSize: '0.875rem' },
        md: { padding: '12px 24px', fontSize: '1rem' },
        lg: { padding: '16px 32px', fontSize: '1.125rem' },
    };

    const widthStyle = fullWidth ? { width: '100%' } : {};

    return (
        <button
            style={{
                ...baseStyles,
                ...variants[variant],
                ...sizes[size],
                ...widthStyle,
            }}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
}
