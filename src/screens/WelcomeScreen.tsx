import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { welcomeScreenImage } from '../assets/registry'
import { normalizeRect, toPercentBox } from '../utils/imageCoordinates'

export const WELCOME_DESCRIPTION =
  'Panther Passage. Your last 100 days start here. Plan your next steps, discover resources, and move confidently toward graduation and beyond.'

const { width: imageWidth, height: imageHeight } = welcomeScreenImage
const getStartedBox = toPercentBox(normalizeRect(welcomeScreenImage.getStartedPixels, imageWidth, imageHeight))

/**
 * The frame is the largest box with the image's aspect ratio that fits the viewport (object-fit: contain),
 * so percentages inside it are image coordinates at any size, with no crop and centered letterboxing.
 */
const frameStyle: CSSProperties = {
  aspectRatio: `${imageWidth} / ${imageHeight}`,
  width: `min(100vw, calc(100dvh * ${imageWidth} / ${imageHeight}))`,
}

const targetStyle: CSSProperties = {
  left: getStartedBox.left,
  width: getStartedBox.width,
  top: getStartedBox.centerY,
  height: `max(${getStartedBox.height}, 44px)`,
  transform: 'translateY(-50%)',
}

export function WelcomeScreen() {
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)
  const start = () => navigate('/onboarding')

  if (failed) {
    return (
      <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-ivory px-6 text-center">
        <h1 className="font-display text-3xl font-bold text-evergreen">Panther Passage</h1>
        <p className="max-w-xs text-slate">
          Your last 100 days start here. Plan your next steps, discover resources, and move confidently toward
          graduation and beyond.
        </p>
        <button
          type="button"
          onClick={start}
          className="min-h-12 w-full max-w-xs rounded-full bg-evergreen px-5 font-bold text-ivory"
        >
          Get Started
        </button>
      </main>
    )
  }

  return (
    <main id="main" className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[#F7F4EB]">
      <div className="passage-rise relative shrink-0" style={frameStyle}>
        <img
          src={welcomeScreenImage.path}
          alt={WELCOME_DESCRIPTION}
          width={imageWidth}
          height={imageHeight}
          onError={() => setFailed(true)}
          draggable={false}
          className="block h-full w-full select-none"
        />
        <button
          type="button"
          aria-label="Get Started"
          onClick={start}
          data-testid="welcome-get-started"
          className="absolute cursor-pointer rounded-full bg-transparent p-0"
          style={targetStyle}
        />
      </div>
    </main>
  )
}
