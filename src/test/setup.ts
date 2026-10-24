import '@testing-library/jest-dom/vitest'

// jsdom does not implement IntersectionObserver, which motion's whileInView relies on.
// A minimal stub keeps viewport-triggered animations from throwing during tests.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverStub {
    readonly root: Element | null = null
    readonly rootMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver
}

// jsdom elements have no scrollIntoView; make it a no-op so path auto-scroll is safe.
if (typeof Element !== 'undefined' && typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = () => {}
}
