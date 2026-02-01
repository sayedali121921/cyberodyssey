export function ProjectCardSkeleton() {
    return (
        <div className="card animate-pulse">
            {/* Image placeholder */}
            <div className="mb-4 -mx-6 -mt-6 h-40 bg-slate/50 rounded-t-lg" />

            {/* Title */}
            <div className="h-6 bg-slate/50 rounded w-3/4 mb-2" />

            {/* Description */}
            <div className="space-y-2 mb-3">
                <div className="h-4 bg-slate/30 rounded w-full" />
                <div className="h-4 bg-slate/30 rounded w-5/6" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-slate/30 rounded" />
                <div className="h-6 w-20 bg-slate/30 rounded" />
                <div className="h-6 w-14 bg-slate/30 rounded" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate/30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate/50" />
                    <div className="h-4 w-24 bg-slate/30 rounded" />
                </div>
                <div className="h-5 w-20 bg-slate/30 rounded" />
            </div>
        </div>
    );
}

export function FailureLogCardSkeleton() {
    return (
        <div className="card animate-pulse">
            {/* Title */}
            <div className="h-6 bg-slate/50 rounded w-4/5 mb-3" />

            {/* Meta info */}
            <div className="flex gap-4 mb-4">
                <div className="h-4 w-32 bg-slate/30 rounded" />
                <div className="h-4 w-24 bg-slate/30 rounded" />
            </div>

            {/* Content lines */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-slate/30 rounded w-full" />
                <div className="h-4 bg-slate/30 rounded w-11/12" />
                <div className="h-4 bg-slate/30 rounded w-4/5" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate/30">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate/50" />
                    <div className="h-4 w-20 bg-slate/30 rounded" />
                </div>
                <div className="h-4 w-16 bg-slate/30 rounded" />
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="card animate-pulse">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-slate/50 flex-shrink-0" />

                <div className="flex-1">
                    {/* Name and badges */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-7 w-40 bg-slate/50 rounded" />
                        <div className="h-5 w-16 bg-slate/30 rounded" />
                    </div>

                    {/* Username */}
                    <div className="h-4 w-24 bg-slate/30 rounded mb-4" />

                    {/* Bio */}
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-slate/30 rounded w-full" />
                        <div className="h-4 bg-slate/30 rounded w-3/4" />
                    </div>

                    {/* Links */}
                    <div className="flex gap-4">
                        <div className="h-4 w-24 bg-slate/30 rounded" />
                        <div className="h-4 w-28 bg-slate/30 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="card text-center animate-pulse">
            <div className="h-8 w-12 bg-slate/50 rounded mx-auto mb-2" />
            <div className="h-4 w-20 bg-slate/30 rounded mx-auto" />
        </div>
    );
}

export function TableRowSkeleton() {
    return (
        <tr className="animate-pulse">
            <td className="py-4 px-4"><div className="h-4 bg-slate/30 rounded w-8" /></td>
            <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate/50" />
                    <div className="h-4 bg-slate/30 rounded w-32" />
                </div>
            </td>
            <td className="py-4 px-4"><div className="h-4 bg-slate/30 rounded w-16" /></td>
            <td className="py-4 px-4"><div className="h-4 bg-slate/30 rounded w-12" /></td>
        </tr>
    );
}

export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate/50" />
            <div className="flex-1">
                <div className="h-5 bg-slate/50 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate/30 rounded w-1/2" />
            </div>
        </div>
    );
}
