# Intelligent Course Registration Assistant

## Goal
Build a polished Vietnamese course-registration workspace where students can explore courses, preview sections on a weekly timetable, catch conflicts instantly, manage a registration cart, and confirm a valid schedule.

## What will be built
- Sticky application header with semester, credit progress, workload, conflict count, cart, and student profile.
- Responsive desktop split workspace with catalog and recommendations on the left, timetable and conflict tools on the right.
- Search, faculty/day/credit/workload/seat filters, and catalog/AI recommendation tabs.
- Rich expandable course cards with prerequisites, reasons, section details, seat capacity, preview, and add/remove actions.
- Interactive Monday–Saturday timetable with colored enrolled blocks, hover “ghost” previews, and red conflict states.
- Real-time checks for schedule overlap, missing theory/lab pairing, and credit limits, including quick-fix actions.
- Registration summary drawer with linked-class removal warnings.
- Confirmation flow with pre-flight checks, success animation, and downloadable Google Calendar `.ics` export.
- Realistic preloaded student and course data matching the brief.

## Technical details
- Keep all behavior client-side with React state and derived validation.
- Use semantic Tailwind v4 design tokens, reusable UI controls, Lucide icons, and Motion animations.
- Add route-specific metadata and responsive styling for desktop and mobile.
- Validate the main interactions and visual layout in the live preview after implementation.
