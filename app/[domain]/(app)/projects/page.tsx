export default async function ProjectsPage() {
    return (
        <div className="space-y-6">
            {/* Page Title & Subtitle */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-black">
                    Welcome back, Ibrahim.
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                    Here is what needs your attention today.
                </p>
            </div>

            {/* A blank visual placeholder so you can test how the main content area feels */}
            <div className="h-96 rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-400">
                ALL PROJECTS ARE HERE
            </div>
        </div>
    )
}