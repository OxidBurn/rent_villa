import Image from 'next/image'

interface IconTextProps {
  icon: string
  text: string
  highlighted?: string
  className?: string
}

export default function IconText({ icon, text, highlighted, className = '' }: IconTextProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src={icon} alt="" width={24} height={24} className="flex-shrink-0" />
      <p className="text-base md:text-lg text-[#2b6c70] whitespace-nowrap">
        {highlighted && <span className="font-semibold">{highlighted}</span>}
        {text}
      </p>
    </div>
  )
}
