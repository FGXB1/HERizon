import Link from 'next/link'
import { Space_Grotesk, Sora } from 'next/font/google'
import { cn } from '@/lib/utils'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export default function Page() {
  return (
    <main
      className={cn(
        'min-h-screen bg-[radial-gradient(circle_at_top,#2a0f1f,transparent_55%),radial-gradient(circle_at_bottom,#07202a,transparent_50%),linear-gradient(135deg,#0b0a12,#140b1a_45%,#071a22)] text-white',
        spaceGrotesk.variable,
        sora.variable
      )}
    >
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-rose-200/70">Automotive Industry Lab</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl" style={{ fontFamily: 'var(--font-space)' }}>
          Explore racing strategy with creative confidence
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-white/70" style={{ fontFamily: 'var(--font-sora)' }}>
          Step into a guided pit stop challenge that blends curiosity, decision making, and engineering insight.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/f1-demo"
            className="rounded-full border border-rose-200/40 bg-rose-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-rose-500/35"
          >
            Launch F1 Demo
          </Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
            No simulator needed
          </span>
        </div>
      </div>
    </main>
  )
}
