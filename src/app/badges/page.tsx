import { BadgeGrid, allBadges } from '@/components/ui/Badges';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Badges & Achievements',
    description: 'Earn badges for your accomplishments on Cyberodyssey. Track your progress and unlock achievements.',
};

// Mock earned badges for demo
const earnedBadgeIds = ['first-project', 'first-failure', 'early-adopter', 'first-comment'];

export default function BadgesPage() {
    // Group badges by category
    const learningBadges = allBadges.filter(b => b.category === 'learning');
    const communityBadges = allBadges.filter(b => b.category === 'community');
    const achievementBadges = allBadges.filter(b => b.category === 'achievement');
    const specialBadges = allBadges.filter(b => b.category === 'special');

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Badges & Achievements</h1>
                    <p className="text-warm-gray max-w-2xl mx-auto">
                        Earn badges by completing activities on Cyberodyssey. The more you learn,
                        share, and contribute, the more achievements you unlock.
                    </p>
                </div>

                {/* Progress Overview */}
                <div className="card mb-12">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
                            <p className="text-muted-text">
                                You've earned {earnedBadgeIds.length} out of {allBadges.length} badges
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-cyan">{earnedBadgeIds.length}</div>
                                <div className="text-xs text-muted-text">Earned</div>
                            </div>
                            <div className="w-px h-10 bg-slate/30" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-muted-text">{allBadges.length - earnedBadgeIds.length}</div>
                                <div className="text-xs text-muted-text">Locked</div>
                            </div>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-6 h-3 bg-slate/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${(earnedBadgeIds.length / allBadges.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Badge Categories */}
                <div className="space-y-12">
                    {/* Learning Badges */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">🎓</span>
                            <div>
                                <h2 className="text-xl font-semibold">Learning Badges</h2>
                                <p className="text-sm text-muted-text">Earn by creating projects and documenting failures</p>
                            </div>
                        </div>
                        <BadgeGrid badges={learningBadges} earnedBadgeIds={earnedBadgeIds} />
                    </section>

                    <hr className="border-slate/30" />

                    {/* Community Badges */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">👥</span>
                            <div>
                                <h2 className="text-xl font-semibold">Community Badges</h2>
                                <p className="text-sm text-muted-text">Earn by helping others and engaging with the community</p>
                            </div>
                        </div>
                        <BadgeGrid badges={communityBadges} earnedBadgeIds={earnedBadgeIds} />
                    </section>

                    <hr className="border-slate/30" />

                    {/* Achievement Badges */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">🏆</span>
                            <div>
                                <h2 className="text-xl font-semibold">Achievement Badges</h2>
                                <p className="text-sm text-muted-text">Earn by reaching milestones and maintaining streaks</p>
                            </div>
                        </div>
                        <BadgeGrid badges={achievementBadges} earnedBadgeIds={earnedBadgeIds} />
                    </section>

                    <hr className="border-slate/30" />

                    {/* Special Badges */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">✨</span>
                            <div>
                                <h2 className="text-xl font-semibold">Special Badges</h2>
                                <p className="text-sm text-muted-text">Rare badges for exceptional contributions</p>
                            </div>
                        </div>
                        <BadgeGrid badges={specialBadges} earnedBadgeIds={earnedBadgeIds} />
                    </section>
                </div>

                {/* How to Earn Section */}
                <div className="mt-16 card bg-gradient-to-br from-cyan/10 to-transparent">
                    <h2 className="text-xl font-semibold mb-4">How to Earn Badges</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="text-cyan">1.</span>
                                <p className="text-warm-gray">Create your first project to earn the <strong className="text-off-white">First Steps</strong> badge</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-cyan">2.</span>
                                <p className="text-warm-gray">Document a failure log to unlock <strong className="text-off-white">Embracing Failure</strong></p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-cyan">3.</span>
                                <p className="text-warm-gray">Leave helpful comments to earn community badges</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="text-cyan">4.</span>
                                <p className="text-warm-gray">Maintain daily activity streaks for consistency badges</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-cyan">5.</span>
                                <p className="text-warm-gray">Get your projects viewed by others for popularity badges</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-cyan">6.</span>
                                <p className="text-warm-gray">Apply to become a mentor for the <strong className="text-off-white">Verified Mentor</strong> badge</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
