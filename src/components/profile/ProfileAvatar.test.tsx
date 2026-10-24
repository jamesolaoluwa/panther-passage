import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ProfileAvatar } from './ProfileAvatar'

afterEach(cleanup)

describe('ProfileAvatar', () => {
  it('shows each student photo', () => {
    const cases: Record<string, string> = {
      'S-A': 'jordan-ellis.png',
      'S-B': 'avery-brooks.png',
      'S-C': 'morgan-reed.png',
    }
    for (const [id, file] of Object.entries(cases)) {
      const { container, unmount } = render(<ProfileAvatar studentId={id} />)
      const img = container.querySelector('img')
      expect(img).not.toBeNull()
      expect(img?.getAttribute('src')).toContain(`/avatars/${file}`)
      unmount()
    }
  })

  it('falls back to the illustration when the photo fails to load', () => {
    const { container } = render(<ProfileAvatar studentId="S-A" />)
    const img = container.querySelector('img')!
    fireEvent.error(img)
    expect(container.querySelector('img')?.getAttribute('src')).toContain('/avatars/jordan-ellis.svg')
  })

  it('renders an icon placeholder for an unknown student', () => {
    const { container } = render(<ProfileAvatar studentId="S-ZZ" />)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('svg')).not.toBeNull()
  })
})
