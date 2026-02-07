'use client'

import dynamic from 'next/dynamic'

const F1DemoClient = dynamic(() => import('./F1DemoClient'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#2a0f1f,transparent_55%),radial-gradient(circle_at_bottom,#07202a,transparent_50%)]">
      <p className="text-sm uppercase tracking-[0.3em] text-rose-200/70">Loading F1 Demo…</p>
    </div>
  ),
})

export default function F1DemoPage() {
  return <F1DemoClient />
}
