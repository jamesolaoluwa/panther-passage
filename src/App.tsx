import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { LazyMotion, MotionConfig, domMax } from 'motion/react'
import { AppShell } from './components/layout/AppShell'
import { AchievementsScreen } from './screens/AchievementsScreen'
import { DestinationScreen } from './screens/DestinationScreen'
import { EventsScreen } from './screens/EventsScreen'
import { HomeScreen } from './screens/HomeScreen'
import { MilestoneScreen } from './screens/MilestoneScreen'
import { NextChapterScreen } from './screens/NextChapterScreen'
import { NotFoundScreen, ProfileScreen } from './screens/ProfileScreen'
import { ReadinessScreen } from './screens/ReadinessScreen'
import { ReflectionsScreen } from './screens/ReflectionsScreen'
import { ResourcesScreen } from './screens/ResourcesScreen'
import { OnboardingGuard } from './components/onboarding/OnboardingGuard'
import { OnboardingConfirmationScreen } from './screens/OnboardingConfirmationScreen'
import { OnboardingDirectionScreen } from './screens/OnboardingDirectionScreen'
import { OnboardingPrioritiesScreen } from './screens/OnboardingPrioritiesScreen'
import { ChapterScreen } from './screens/ChapterScreen'
import { DailyPrayerScreen, DailyReflectionScreen } from './screens/DailyScriptureScreens'
import { FaithReflectionScreen } from './screens/FaithReflectionScreen'
import { JourneyScreen } from './screens/JourneyScreen'
import { PathwayPreviewIndex, PathwayPreviewScreen } from './screens/PathwayPreviewScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { PassageProvider } from './state/PassageContext'
import type { KeyValueStore } from './domain/persistence'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route
          path="/onboarding/direction"
          element={
            <OnboardingGuard step={2}>
              <OnboardingDirectionScreen />
            </OnboardingGuard>
          }
        />
        <Route
          path="/onboarding/priorities"
          element={
            <OnboardingGuard step={3}>
              <OnboardingPrioritiesScreen />
            </OnboardingGuard>
          }
        />
        <Route
          path="/onboarding/confirmation"
          element={
            <OnboardingGuard step={4}>
              <OnboardingConfirmationScreen />
            </OnboardingGuard>
          }
        />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/journey" element={<JourneyScreen />} />
        <Route path="/journey/chapter/:chapterId" element={<ChapterScreen />} />
        <Route path="/journey/:milestoneId" element={<MilestoneScreen />} />
        <Route path="/resources" element={<ResourcesScreen />} />
        <Route path="/events" element={<EventsScreen />} />
        <Route path="/achievements" element={<AchievementsScreen />} />
        <Route path="/next-chapter" element={<NextChapterScreen />} />
        <Route path="/next-chapter/:section" element={<NextChapterScreen />} />
        <Route path="/reflections" element={<ReflectionsScreen />} />
        <Route path="/reflections/prayer" element={<DailyPrayerScreen />} />
        <Route path="/reflections/today" element={<DailyReflectionScreen />} />
        <Route path="/reflections/faith" element={<FaithReflectionScreen />} />
        <Route path="/readiness" element={<ReadinessScreen />} />
        <Route path="/destination" element={<DestinationScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/preview" element={<PathwayPreviewIndex />} />
        <Route path="/preview/:trackId" element={<PathwayPreviewScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Route>
    </Routes>
  )
}

export function App({
  store,
  router = 'browser',
  initialPath = '/',
  now,
}: {
  store?: KeyValueStore
  router?: 'browser' | 'memory'
  initialPath?: string
  now?: Date
}) {
  const routes = <AppRoutes />
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <PassageProvider store={store} now={now}>
          {router === 'memory' ? (
            <MemoryRouter initialEntries={[initialPath]}>{routes}</MemoryRouter>
          ) : (
            <BrowserRouter>{routes}</BrowserRouter>
          )}
        </PassageProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
