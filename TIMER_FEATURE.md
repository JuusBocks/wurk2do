# ⏱️ Timer Feature

## Overview

The app now includes a beautiful, adjustable Pomodoro-style timer that you can assign tasks to. The timer has two views:
1. **Compact View** - Shows at the top of the app
2. **Focus Mode** - Full-screen view like the Windows Clock app

## Features

### Timer Functionality
- ⏱️ **Adjustable Duration**: Choose from preset durations (5, 15, 25, 45, 60 minutes)
- ▶️ **Play/Pause/Reset**: Full timer controls
- 🎯 **Task Assignment**: Assign any task to the timer
- 🔔 **Sound Alert**: Plays a beep when timer completes
- 📊 **Visual Progress**: Circular progress indicator

### Compact View (Top Bar)
Located just below the header, the compact view shows:
- Circular progress ring (color changes when running)
- Large time display in MM:SS format
- Task name (if assigned)
- Play/Pause/Reset buttons
- Focus Mode button (expand to full screen)

### Focus Mode (Full Screen)
Click the expand button to enter focus mode, which displays:
- Large, easy-to-read timer (shows minutes and seconds separately)
- Task name and priority indicator at the top
- Circular progress ring with smooth animations
- Duration preset buttons (5m, 15m, 25m, 45m, 60m)
- Large Play/Pause/Reset buttons
- Completion message when timer finishes
- Close button to exit focus mode

## How to Use

### 1. Start Timer Without a Task
1. Click the **Play** button in the compact timer bar
2. The timer will start counting down from the default duration (25 minutes)
3. Click **Focus Mode** button (expand icon) for full-screen view

### 2. Assign a Task to Timer
**From Week View:**
1. Find the task you want to work on
2. Click the **timer icon** (clock) on the task card
3. The task will be assigned to the timer
4. Click Play to start

**From Calendar View:**
1. Find the task in the calendar
2. Click the **⏱** emoji on the task
3. The task will be assigned to the timer
4. Click Play to start

### 3. Change Timer Duration
1. Click on any duration preset button (5m, 15m, 25m, 45m, 60m)
2. The timer will reset to that duration
3. Start the timer when ready

### 4. Using Focus Mode
1. Click the **expand icon** in the compact view
2. You'll enter a distraction-free full-screen timer
3. See your task name and priority prominently displayed
4. The large time display makes it easy to see from a distance
5. Click the **X** button in the top-right to exit

## Visual Design

### Colors & Animations
- **Idle State**: Gray progress ring
- **Running State**: Blue progress ring
- **Completed**: Green progress ring with success message
- **Smooth Transitions**: 1-second animation on progress updates

### Priority Integration
In Focus Mode, the assigned task shows its priority level:
- 🔴 **High Priority**: Red star
- 🟠 **Medium Priority**: Orange star
- 🟡 **Low Priority**: Yellow star

### Mobile Friendly
- Touch-optimized buttons
- Large tap targets for easy interaction
- Responsive text sizing
- Works great on iPhone

## Tips

1. **Pomodoro Technique**: Use 25-minute intervals for focused work sessions
2. **Break Timer**: Use 5-minute timer for short breaks
3. **Deep Work**: Use 45 or 60 minutes for deep focus sessions
4. **Visual Motivation**: Watch the progress ring fill up as you work
5. **Task Completion**: When timer finishes, mark your task as complete!

## Technical Details

### Component: `Timer.jsx`
- Uses React hooks for state management
- Implements interval-based countdown
- Web Audio API for completion sound
- SVG-based circular progress indicator
- Smooth CSS transitions and animations

### Integration
- Accessible from both Week View and Calendar View
- Task selection propagates across all views
- Persists timer state during view switches
- Independent of sync functionality

## Future Enhancements (Possible)
- Timer history/statistics
- Auto-start next timer after completion
- Custom notification sounds
- Timer presets (work/break patterns)
- Time tracking per task

---

**Pro Tip**: Enter Focus Mode before starting a task to minimize distractions and maximize productivity! 🚀
