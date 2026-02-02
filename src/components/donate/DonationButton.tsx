'use client';

interface DonationButtonProps {
    message: string;
    children: React.ReactNode;
}

export default function DonationButton({ message, children }: DonationButtonProps) {
    return (
        <button
            className="btn-secondary text-sm px-4 py-2"
            onClick={() => alert(message)}
        >
            {children}
        </button>
    );
}
