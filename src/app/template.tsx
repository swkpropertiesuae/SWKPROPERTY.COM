import { ViewTransition } from "react"

/** Templates remount on every navigation, so each route change plays the cinematic crossfade. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="cine-in" exit="cine-out" default="none">
      {children}
    </ViewTransition>
  )
}
