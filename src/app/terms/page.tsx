import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Cyberodyssey Terms of Service - Rules and guidelines for using our platform.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-muted-text">Last updated: January 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-warm-gray">
                            By accessing or using Cyberodyssey, you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our platform.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">2. Description of Service</h2>
                        <p className="text-warm-gray">
                            Cyberodyssey is a learning-in-public platform that allows users to document their
                            learning journeys, share projects and failure logs, receive mentor feedback, and
                            connect with a community of learners and industry professionals.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">3. User Accounts</h2>
                        <ul className="list-disc list-inside space-y-2 text-warm-gray text-sm">
                            <li>You must be at least 13 years old to create an account</li>
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>You must provide accurate and complete information</li>
                            <li>You are responsible for all activity under your account</li>
                            <li>You may not share your account credentials with others</li>
                        </ul>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">4. User Content</h2>
                        <div className="space-y-4 text-warm-gray">
                            <p>You retain ownership of content you create. By posting content, you grant us a license to:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Display your public content on the platform</li>
                                <li>Share your content in promotional materials (with attribution)</li>
                                <li>Store and backup your content</li>
                            </ul>
                            <p className="text-sm">
                                You represent that you have the right to share any content you post and that
                                it does not violate any third party's rights.
                            </p>
                        </div>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">5. Prohibited Conduct</h2>
                        <p className="text-warm-gray mb-4">You agree not to:</p>
                        <ul className="list-disc list-inside space-y-2 text-warm-gray text-sm">
                            <li>Post content that is illegal, harmful, or violates others' rights</li>
                            <li>Harass, bully, or discriminate against other users</li>
                            <li>Impersonate others or create fake accounts</li>
                            <li>Spam, advertise, or promote unrelated products</li>
                            <li>Attempt to hack, disrupt, or abuse the platform</li>
                            <li>Scrape or collect user data without permission</li>
                            <li>Violate any applicable laws or regulations</li>
                        </ul>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">6. Mentor Guidelines</h2>
                        <div className="space-y-2 text-warm-gray text-sm">
                            <p>Mentors agree to:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Provide constructive and helpful feedback</li>
                                <li>Maintain professional conduct at all times</li>
                                <li>Respect student privacy and confidentiality</li>
                                <li>Follow our Community Guidelines</li>
                            </ul>
                        </div>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">7. Intellectual Property</h2>
                        <p className="text-warm-gray">
                            The Cyberodyssey platform, including its design, features, and content
                            (excluding user-generated content), is owned by Cyberodyssey and protected
                            by intellectual property laws. You may not copy, modify, or distribute our
                            platform without permission.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">8. Termination</h2>
                        <p className="text-warm-gray">
                            We reserve the right to suspend or terminate your account for violations of
                            these terms. You may also delete your account at any time. Upon termination,
                            your public content may remain visible unless you explicitly delete it.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">9. Disclaimers</h2>
                        <div className="space-y-2 text-warm-gray text-sm">
                            <p>
                                Cyberodyssey is provided "as is" without warranties of any kind. We do not guarantee:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Uninterrupted or error-free service</li>
                                <li>Accuracy of user-generated content</li>
                                <li>That the platform will meet your specific needs</li>
                            </ul>
                        </div>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">10. Limitation of Liability</h2>
                        <p className="text-warm-gray text-sm">
                            To the maximum extent permitted by law, Cyberodyssey shall not be liable for
                            any indirect, incidental, special, consequential, or punitive damages arising
                            from your use of the platform.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">11. Changes to Terms</h2>
                        <p className="text-warm-gray">
                            We may modify these terms at any time. We will notify you of significant
                            changes. Continued use of the platform after changes constitutes acceptance.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">12. Governing Law</h2>
                        <p className="text-warm-gray">
                            These terms shall be governed by the laws of India. Any disputes shall be
                            resolved in the courts of India.
                        </p>
                    </section>

                    <section className="card">
                        <h2 className="text-xl font-bold mb-4">13. Contact</h2>
                        <p className="text-warm-gray mb-4">
                            For questions about these Terms of Service:
                        </p>
                        <p className="text-cyan">legal@cyberodyssey.org</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
