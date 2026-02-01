import Link from 'next/link';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    category: 'learning' | 'community' | 'achievement' | 'special';
    earnedAt?: string;
}

// All available badges in the system
export const allBadges: Badge[] = [
    // Learning badges
    { id: 'first-project', name: 'First Steps', description: 'Created your first project', icon: '🚀', tier: 'bronze', category: 'learning' },
    { id: 'first-failure', name: 'Embracing Failure', description: 'Documented your first failure log', icon: '📝', tier: 'bronze', category: 'learning' },
    { id: 'five-projects', name: 'Portfolio Builder', description: 'Created 5 projects', icon: '📁', tier: 'silver', category: 'learning' },
    { id: 'ten-failures', name: 'Learning Machine', description: 'Documented 10 failure logs', icon: '🎓', tier: 'silver', category: 'learning' },
    { id: 'twenty-projects', name: 'Prolific Creator', description: 'Created 20 projects', icon: '⭐', tier: 'gold', category: 'learning' },
    { id: 'fifty-failures', name: 'Failure Expert', description: 'Documented 50 failure logs', icon: '🏅', tier: 'gold', category: 'learning' },

    // Community badges
    { id: 'first-comment', name: 'Community Voice', description: 'Left your first helpful comment', icon: '💬', tier: 'bronze', category: 'community' },
    { id: 'helpful-10', name: 'Helping Hand', description: 'Your comments helped 10 people', icon: '🤝', tier: 'silver', category: 'community' },
    { id: 'mentor-badge', name: 'Verified Mentor', description: 'Became a verified mentor', icon: '👨‍🏫', tier: 'gold', category: 'community' },
    { id: 'top-contributor', name: 'Top Contributor', description: 'Ranked in top 10 contributors', icon: '🏆', tier: 'platinum', category: 'community' },

    // Achievement badges
    { id: 'week-streak', name: 'Week Warrior', description: '7-day activity streak', icon: '🔥', tier: 'bronze', category: 'achievement' },
    { id: 'month-streak', name: 'Month Master', description: '30-day activity streak', icon: '💪', tier: 'silver', category: 'achievement' },
    { id: 'year-streak', name: 'Year Legend', description: '365-day activity streak', icon: '🌟', tier: 'platinum', category: 'achievement' },
    { id: 'popular-project', name: 'Popular Project', description: 'Project reached 100+ views', icon: '👀', tier: 'silver', category: 'achievement' },
    { id: 'viral-project', name: 'Viral Project', description: 'Project reached 1000+ views', icon: '🌐', tier: 'gold', category: 'achievement' },

    // Special badges
    { id: 'early-adopter', name: 'Early Adopter', description: 'Joined during beta', icon: '🌱', tier: 'gold', category: 'special' },
    { id: 'bug-hunter', name: 'Bug Hunter', description: 'Found and reported a bug', icon: '🐛', tier: 'silver', category: 'special' },
    { id: 'contributor', name: 'Open Source Hero', description: 'Contributed to Cyberodyssey', icon: '💻', tier: 'platinum', category: 'special' },
];

const tierColors: Record<Badge['tier'], { bg: string; border: string; text: string }> = {
    bronze: { bg: 'bg-amber-900/20', border: 'border-amber-700/50', text: 'text-amber-500' },
    silver: { bg: 'bg-gray-400/20', border: 'border-gray-400/50', text: 'text-gray-300' },
    gold: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
    platinum: { bg: 'bg-cyan/20', border: 'border-cyan/50', text: 'text-cyan' },
};

export function BadgeIcon({ badge, size = 'md' }: { badge: Badge; size?: 'sm' | 'md' | 'lg' }) {
    const colors = tierColors[badge.tier];
    const sizes = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-xl',
        lg: 'w-16 h-16 text-3xl',
    };

    return (
        <div
            className={`${sizes[size]} ${colors.bg} ${colors.border} border-2 rounded-xl flex items-center justify-center`}
            title={`${badge.name}: ${badge.description}`}
        >
            {badge.icon}
        </div>
    );
}

export function BadgeCard({ badge, earned = false }: { badge: Badge; earned?: boolean }) {
    const colors = tierColors[badge.tier];

    return (
        <div className={`p-4 rounded-xl border ${earned ? colors.border : 'border-slate/30'} ${earned ? colors.bg : 'bg-slate/10'} transition-all hover:scale-105`}>
            <div className="flex items-start gap-3">
                <div className={`text-3xl ${!earned && 'opacity-40 grayscale'}`}>
                    {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm ${earned ? 'text-off-white' : 'text-muted-text'}`}>
                        {badge.name}
                    </h3>
                    <p className="text-xs text-muted-text line-clamp-2">{badge.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text} capitalize`}>
                            {badge.tier}
                        </span>
                        {earned && badge.earnedAt && (
                            <span className="text-xs text-muted-text">
                                Earned {new Date(badge.earnedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BadgeGrid({ badges, earnedBadgeIds = [] }: { badges: Badge[]; earnedBadgeIds?: string[] }) {
    const earned = badges.filter(b => earnedBadgeIds.includes(b.id));
    const unearned = badges.filter(b => !earnedBadgeIds.includes(b.id));

    return (
        <div className="space-y-6">
            {earned.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-3">Earned Badges ({earned.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {earned.map(badge => (
                            <BadgeCard key={badge.id} badge={badge} earned />
                        ))}
                    </div>
                </div>
            )}

            {unearned.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-muted-text">Locked Badges ({unearned.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unearned.map(badge => (
                            <BadgeCard key={badge.id} badge={badge} earned={false} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function BadgeShowcase({ earnedBadgeIds }: { earnedBadgeIds: string[] }) {
    const earnedBadges = allBadges.filter(b => earnedBadgeIds.includes(b.id)).slice(0, 5);

    if (earnedBadges.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            {earnedBadges.map(badge => (
                <BadgeIcon key={badge.id} badge={badge} size="sm" />
            ))}
            {earnedBadgeIds.length > 5 && (
                <span className="text-xs text-muted-text">+{earnedBadgeIds.length - 5} more</span>
            )}
        </div>
    );
}
