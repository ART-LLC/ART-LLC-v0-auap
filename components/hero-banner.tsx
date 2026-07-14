import Image from 'next/image'

interface HeroBannerProps {
  imageSrc: string
  title: string
  subtitle?: string
  height?: 'small' | 'medium' | 'large'
}

export function HeroBanner({ imageSrc, title, subtitle, height = 'medium' }: HeroBannerProps) {
  const heightClass = {
    small: 'h-64',
    medium: 'h-96',
    large: 'h-[500px]',
  }[height]

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-lg shadow-xl`}>
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg sm:text-xl text-gray-100 max-w-2xl drop-shadow-md font-semibold">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
