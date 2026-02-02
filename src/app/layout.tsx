import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/Providers';
import { createClient, isMockMode } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: {
        default: 'Cyberodyssey - Document Your Learning Journey',
        template: '%s | Cyberodyssey',
    },
    description:
        'A student-focused learning-in-public platform where students document project journeys and failure logs, get constructive mentor feedback, and build a verifiable learning identity.',
    keywords: [
        'learning',
        'education',
        'mentorship',
        'projects',
        'failure logs',
        'student',
        'portfolio',
        'growth',
    ],
    authors: [{ name: 'Cyberodyssey' }],
    creator: 'Cyberodyssey',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://cyberodyssey.org',
        siteName: 'Cyberodyssey',
        title: 'Cyberodyssey - Document Your Learning Journey',
        description:
            'A student-focused learning-in-public platform. Document your projects, log your failures, get feedback, and build your learning identity.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Cyberodyssey - Document Your Learning Journey',
            },
        ],
    },
    icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
        apple: '/logo.png',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cyberodyssey - Document Your Learning Journey',
        description:
            'A student-focused learning-in-public platform. Document your projects, log your failures, and build your learning identity.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
    metadataBase: new URL('https://cyberodyssey.org'),
};

async function getUser() {
    if (isMockMode) {
        return null;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('users')
        .select('id, full_name, username, avatar_url, role')
        .eq('id', user.id)
        .single();

    return profile;
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    return (
        <html lang="en" className="scroll-smooth">
            <body className="min-h-screen bg-charcoal text-off-white antialiased">
                {/* Noise overlay for texture */}
                <div className="noise-overlay" />

                {/* Floating orbs background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="floating-orb w-96 h-96 bg-cyan/10" style={{ top: '10%', left: '5%' }} />
                    <div className="floating-orb w-[500px] h-[500px] bg-magenta/8" style={{ top: '60%', right: '10%', animationDelay: '-5s' }} />
                    <div className="floating-orb w-72 h-72 bg-purple/10" style={{ top: '30%', right: '30%', animationDelay: '-10s' }} />
                </div>

                <Providers>
                    <div className="relative z-10 flex min-h-screen flex-col">
                        <Header user={user} />
                        <main className="flex-1 pt-16">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}

