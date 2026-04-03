import {
  CubeTransparentIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SwatchIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { ServerStackIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

import type { PackageCategory } from '@/lib/docs-catalog'

const CATEGORY_ICONS = {
  Authentication: ShieldCheckIcon,
  Components: PaintBrushIcon,
  Config: WrenchScrewdriverIcon,
  Scaffolding: SwatchIcon,
  Server: ServerStackIcon,
  Types: CubeTransparentIcon,
  Utilities: SparklesIcon,
} satisfies Record<PackageCategory, typeof ShieldCheckIcon>

type CategoryIconProps = {
  category: PackageCategory
  className?: string
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[category]

  return <Icon aria-hidden className={clsx('size-5', className)} />
}
