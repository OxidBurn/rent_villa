'use client'

import type { ReactNode } from 'react'

import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down'
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal()

  const hiddenClass = direction === 'up' ? 'translate-y-8' : '-translate-y-8'

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : `opacity-0 ${hiddenClass}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
