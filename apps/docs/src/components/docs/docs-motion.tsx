'use client'

import clsx from 'clsx'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

type AnimatedSectionProps = PropsWithChildren<{
  className?: string
  delay?: number
  id?: string
}>

type StaggeredGridProps = PropsWithChildren<{
  className?: string
}>

export function DocsMotionProvider({ children }: PropsWithChildren) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export function AnimatedSection({ children, className, delay = 0, id }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      id={id}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.18, once: true }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
    >
      {children}
    </motion.section>
  )
}

export function StaggeredGrid({ children, className }: StaggeredGridProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={clsx(className)}
      initial={reduceMotion ? false : 'hidden'}
      viewport={{ amount: 0.15, once: true }}
      whileInView={reduceMotion ? undefined : 'visible'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: 0.08,
            staggerChildren: 0.08,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredGridItem({ children, className }: PropsWithChildren<{ className?: string }>) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={
        reduceMotion
          ? undefined
          : {
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }
      }
    >
      {children}
    </motion.div>
  )
}
