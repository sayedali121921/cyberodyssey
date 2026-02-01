import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Cyberodyssey Privacy Policy - How we collect, use, and protect your data.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-muted-text">Last updated: January 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
                        <p className="text-warm-gray">
                            Welcome to Cyberodyssey ("we," "our," or "us"). We are committed to protecting
                            your personal information and your right to privacy. This Privacy Policy explains
                            how we collect, use, disclose, and safeguard your information when you use our platform.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">2. Information We Collect</h2>
                        <div className="space-y-4 text-warm-gray">
                            <div>
                                <h3 className="font-semibold text-off-white mb-2">Personal Information</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Email address (required for account creation)</li>
                                    <li>Full name and username (optional)</li>
                                    <li>Profile picture (optional)</li>
                                    <li>Bio and social links (optional)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-off-white mb-2">Usage Data</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Pages visited and features used</li>
                                    <li>Time spent on the platform</li>
                                    <li>Device and browser information</li>
                                    <li>IP address and location (country level)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-off-white mb-2">Content You Create</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Projects and project documentation</li>
                                    <li>Failure logs and learning reflections</li>
                                    <li>Comments and discussions</li>
                                    <li>Mentor reviews and feedback</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2 text-warm-gray text-sm">
                            <li>To create and manage your account</li>
                            <li>To provide and improve our services</li>
                            <li>To enable community features and interactions</li>
                            <li>To send important updates about your account</li>
                            <li>To analyze usage patterns and improve user experience</li>
                            <li>To prevent fraud and ensure platform security</li>
                        </ul>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">4. Information Sharing</h2>
                        <p className="text-warm-gray mb-4">
                            We do not sell your personal information. We may share your information in these situations:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-warm-gray text-sm">
                            <li><span className="font-medium text-off-white">Public Content:</span> Projects and failure logs you mark as public</li>
                            <li><span className="font-medium text-off-white">Service Providers:</span> Third-party services that help us operate (e.g., hosting, analytics)</li>
                            <li><span className="font-medium text-off-white">Legal Requirements:</span> When required by law or to protect our rights</li>
                        </ul>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">5. Data Security</h2>
                        <p className="text-warm-gray">
                            We implement appropriate security measures to protect your data, including
                            encryption in transit and at rest, secure authentication protocols, and
                            regular security audits. However, no method of transmission is 100% secure.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">6. Your Rights</h2>
                        <ul className="list-disc list-inside space-y-2 text-warm-gray text-sm">
                            <li>Access and download your data</li>
                            <li>Correct inaccurate information</li>
                            <li>Delete your account and associated data</li>
                            <li>Object to certain data processing</li>
                            <li>Data portability</li>
                        </ul>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">7. Cookies</h2>
                        <p className="text-warm-gray">
                            We use essential cookies for authentication and session management.
                            We also use analytics cookies to understand how you use our platform.
                            You can control cookie preferences in your browser settings.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">8. Children's Privacy</h2>
                        <p className="text-warm-gray">
                            Cyberodyssey is intended for users aged 13 and older. We do not knowingly
                            collect information from children under 13. If you believe a child has
                            provided us with personal information, please contact us.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">9. Changes to This Policy</h2>
                        <p className="text-warm-gray">
                            We may update this Privacy Policy from time to time. We will notify you
                            of significant changes by email or through a notice on our platform.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">10. Contact Us</h2>
                        <p className="text-warm-gray mb-4">
                            If you have questions about this Privacy Policy or your data, contact us at:
                        </p>
                        <p className="text-cyan">privacy@cyberodyssey.org</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
