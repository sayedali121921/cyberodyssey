import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About the Founders | Cyberodyssey',
    description: 'Meet Sayed Awais Ali and Mujtaba Najam, the visionaries behind Cyberodyssey.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-16">

                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Meet the <span className="gradient-text">Visionaries</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto relative">
                        <span className="text-4xl absolute -top-4 -left-2 text-cyan/20">"</span>
                        We want people to share their imperfections and failures to grow.
                        <span className="text-4xl absolute -bottom-8 -right-2 text-cyan/20">"</span>
                    </p>
                </section>

                {/* The Founders Grid */}
                <section className="grid md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Sayed Awais Ali */}
                    <div className="card group hover:border-cyan/50 transition-colors duration-300">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan/20 to-blue-500/20 p-1">
                                <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center overflow-hidden">
                                    {/* Placeholder until real image */}
                                    <span className="text-4xl">👨‍💻</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Sayed Awais Ali</h2>
                                <p className="text-cyan font-medium">Cybersecurity Student & Co-Founder</p>
                            </div>
                            <p className="text-warm-gray leading-relaxed">
                                Passionate about solving real-world problems and helping everyone grow.
                                Dedicated to building platforms that bridge the gap between complex security concepts and accessible learning.
                            </p>
                        </div>
                    </div>

                    {/* Mujtaba Najam */}
                    <div className="card group hover:border-cyan/50 transition-colors duration-300">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan/20 to-blue-500/20 p-1">
                                <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center overflow-hidden">
                                    {/* Placeholder until real image */}
                                    <span className="text-4xl">🛡️</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Mujtaba Najam</h2>
                                <p className="text-cyan font-medium">Cybersecurity Student & Co-Founder</p>
                            </div>
                            <p className="text-warm-gray leading-relaxed">
                                Contributing to the vision of a collective learning community.
                                Believes in documenting failures as the stepping stones to mastery, fostering an environment where growth comes from understanding errors.
                            </p>
                        </div>
                    </div>

                </section>

                {/* Our Vision / Story */}
                <section className="card bg-gradient-to-br from-charcoal to-slate/10 border-slate/50">
                    <div className="max-w-3xl mx-auto text-center space-y-6 py-8">
                        <h2 className="text-3xl font-bold">Why We Created Cyberodyssey</h2>
                        <div className="space-y-4 text-lg text-warm-gray leading-relaxed">
                            <p>
                                In an era where AI creates perfection in seconds, we felt something was missing:
                                <span className="text-white font-semibold"> The struggle. The learning curve. The humanity.</span>
                            </p>
                            <p>
                                Every other platform focuses on showcasing the "perfect" final result. But true learning doesn't happen
                                at the finish line—it happens in the messy middle. It happens when things break.
                            </p>
                            <p>
                                Our motive is to encourage true learners to document their <b className="text-cyan">failures</b> and how they handled them.
                                We built Cyberodyssey to be a safe harbor for imperfection, where documenting a bug is celebrated just as much as shipping a feature.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
