import { useEffect, useState } from 'react'
import { User } from '@phosphor-icons/react'

const base = '/assets/panther-passage/avatars'

/** User-supplied fictional demo portraits, with the earlier illustrated SVGs kept as a fallback. */
const portraits: Record<string, { photo: string; illustration: string }> = {
  'S-A': { photo: `${base}/jordan-ellis.png`, illustration: `${base}/jordan-ellis.svg` },
  'S-B': { photo: `${base}/avery-brooks.png`, illustration: `${base}/avery-brooks.svg` },
  'S-C': { photo: `${base}/morgan-reed.png`, illustration: `${base}/morgan-reed.svg` },
}

export function ProfileAvatar({ studentId }: { studentId: string }) {
  const entry = portraits[studentId]
  const [src, setSrc] = useState<string | undefined>(entry?.photo)

  useEffect(() => {
    setSrc(entry?.photo)
  }, [entry?.photo])

  if (!entry || !src) {
    return (
      <span className="inline-flex size-full items-center justify-center bg-evergreen text-ivory">
        <User size={22} weight="bold" aria-hidden="true" />
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      onError={() => setSrc((current) => (current === entry.illustration ? undefined : entry.illustration))}
      className="size-full object-cover"
    />
  )
}
