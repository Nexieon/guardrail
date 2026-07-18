import { Loader2 } from 'lucide-react'

export default function AppLoading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
      <p className="mt-4 text-sm text-zinc-500 font-medium animate-pulse">
        Loading...
      </p>
    </div>
  )
}