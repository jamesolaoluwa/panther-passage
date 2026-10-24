/**
 * Scripture of the Day uses the public-domain King James Version.
 * The prayers and secular prompts are original demonstration copy.
 * They are not a campus ministry, a chapel requirement, or a milestone.
 */

export interface DailyScripture {
  id: string
  reference: string
  text: string
  prayer: string
  secularPrompt: string
}

export const DAILY_SCRIPTURES: DailyScripture[] = [
  {
    id: 'psalm-90',
    reference: 'Psalm 90:12, King James Version',
    text: 'So teach us to number our days, that we may apply our hearts unto wisdom.',
    prayer:
      'Teach me to treat the days I have left as enough for a wise next step. Quiet the urge to prove my whole future today, and help me choose what is faithful in this season.',
    secularPrompt: 'Which of the days ahead deserves your attention, and what would a wise use of it look like?',
  },
  {
    id: 'proverbs-16',
    reference: 'Proverbs 16:3, King James Version',
    text: 'Commit thy works unto the Lord, and thy thoughts shall be established.',
    prayer:
      'I place today’s work in your care. Settle my thoughts where they are scattered, and let the plan I make be steady enough to follow without needing to impress anyone.',
    secularPrompt: 'What piece of work would feel more settled if you named it clearly and gave it one next action?',
  },
  {
    id: 'philippians-4',
    reference: 'Philippians 4:13, King James Version',
    text: 'I can do all things through Christ which strengtheneth me.',
    prayer:
      'Give me strength for the thing in front of me, not a fantasy of doing everything at once. Let perseverance be quiet, and let me ask for help before I pretend I have none.',
    secularPrompt: 'Where do you need stamina rather than a bigger promise, and who could help you keep going?',
  },
  {
    id: 'proverbs-3',
    reference: 'Proverbs 3:5, King James Version',
    text: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.',
    prayer:
      'I do not have the whole map. Keep me from treating uncertainty as failure. Guide the next honest decision, especially where I am tempted to rush.',
    secularPrompt: 'What decision are you trying to force before you have listened to someone who knows that road?',
  },
  {
    id: 'ecclesiastes-3',
    reference: 'Ecclesiastes 3:1, King James Version',
    text: 'To every thing there is a season, and a time to every purpose under the heaven.',
    prayer:
      'Remind me that leaving is a season, not a verdict. Give me patience for what is ending and courage for what is just beginning.',
    secularPrompt: 'What is ending for you, and what beginning are you allowed to take slowly?',
  },
  {
    id: 'psalm-37',
    reference: 'Psalm 37:5, King James Version',
    text: 'Commit thy way unto the Lord; trust also in him; and he shall bring it to pass.',
    prayer:
      'I commit the path I can see, and I trust you with the part I cannot. Keep me faithful to the next right work instead of anxious about every later one.',
    secularPrompt: 'Which part of your path can you commit to this week, without pretending the rest is already solved?',
  },
  {
    id: 'timothy-1',
    reference: '2 Timothy 1:7, King James Version',
    text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
    prayer:
      'Replace the fear that makes me small with a sound mind and a love that can still act. Let power here mean steadiness, not performance.',
    secularPrompt: 'What fear is asking you to shrink, and what would a calm, sound response be instead?',
  },
  {
    id: 'jeremiah-29',
    reference: 'Jeremiah 29:11, King James Version',
    text: 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.',
    prayer:
      'Hold the future I cannot see. Let my hope be peaceful rather than frantic, and let the ending I am walking toward be one I can meet with a clear heart.',
    secularPrompt: 'What kind of ending would feel like peace to you, even if the details are still unknown?',
  },
]

export function scriptureForDate(now: Date): DailyScripture {
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000)
  const index = ((day % DAILY_SCRIPTURES.length) + DAILY_SCRIPTURES.length) % DAILY_SCRIPTURES.length
  return DAILY_SCRIPTURES[index]
}

export function verseReflectionKey(id: string): string {
  return `verse-${id}`
}

export function secularReflectionKey(id: string): string {
  return `aside-${id}`
}
