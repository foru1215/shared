interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    size?: 'sm' | 'md';
    className?: string;
}

const variants = {
    default: 'bg-white/10 text-text-secondary',
    success: 'bg-[var(--success)]/20 text-[var(--success)]',
    error: 'bg-[var(--error)]/20 text-[var(--error)]',
    warning: 'bg-[var(--warning)]/20 text-[var(--warning)]',
    info: 'bg-[var(--primary-500)]/20 text-[var(--primary-400)]',
};

const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
};

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
    return (
        <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
}
