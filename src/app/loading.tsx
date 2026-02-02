export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-charcoal">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-4 border-slate/30 rounded-full"></div>
                    {/* Spinning ring */}
                    <div className="absolute inset-0 border-4 border-cyan border-t-transparent rounded-full animate-spin"></div>
                    {/* Inner pulse */}
                    <div className="absolute inset-4 bg-cyan/20 rounded-full animate-pulse"></div>
                </div>
                <div className="font-mono text-cyan text-sm animate-pulse tracking-widest">
                    INITIALIZING SYSTEM...
                </div>
            </div>
        </div>
    );
}
