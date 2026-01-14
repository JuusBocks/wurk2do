# 📅 Calendar View Guide - Time-Proportional Task Blocks

## Overview

The **Calendar View** now works like a real calendar (Google Calendar, Outlook, etc.) where tasks visually span the amount of time they'll take. Tasks automatically resize based on their estimated hours!

## How It Works

### Visual Time Blocks

Tasks are displayed as **colored blocks** that span multiple hours:

```
┌─────────────────────────────┐
│ 9 AM  ┌──────────────┐      │
│       │  Team Meeting │      │ ← 1 hour task
│ 10 AM └──────────────┘      │
│       ┌──────────────┐      │
│ 11 AM │              │      │
│       │  Deep Work   │      │ ← 3 hour task
│ 12 PM │              │      │
│       │              │      │
│ 1 PM  └──────────────┘      │
└─────────────────────────────┘
```

### Key Features

✅ **Time-Proportional**: 1 hour = 60px height, 2 hours = 120px, etc.  
✅ **Live Resizing**: Change estimated hours → task automatically resizes  
✅ **Visual Schedule**: See your day at a glance  
✅ **Priority Colors**: Red (High), Orange (Medium), Yellow (Low), Blue (None)  
✅ **Start Times**: Tasks show when they start (e.g., "9 AM")  
✅ **Duration Input**: Edit hours directly in the calendar  

## Adding Tasks

### Step 1: Click a Time Slot
- Click any hour slot (e.g., "9 AM" on Monday)
- The slot will highlight in blue

### Step 2: Enter Task Details
- **Task Name**: Type the task description
- **Duration**: Enter estimated hours (0.5 to 12)
- Click **Add** or press **Enter**

### Example
```
Click: "9 AM" on Monday
Type: "Team Standup"
Duration: 0.5 hours
Result: A small 30-minute block appears at 9 AM
```

## Editing Task Duration

### Method 1: Direct Input (Recommended)
1. Find your task in the calendar
2. Look for the duration input box at the bottom (shows current hours)
3. Click the number input
4. Change the value (e.g., 1 → 2)
5. Task **automatically resizes** to span 2 hours!

### Method 2: Priority Change
- Changing priority changes the color
- Red tasks (High priority) stand out more
- Visual cue for importance

## Task Display

Each task block shows:

```
┌─────────────────────────┐
│ ○  Meeting w/ Client  🔴│ ← Checkbox + Title + Priority
│                         │
│ 2 PM     [2.0] hrs     │ ← Start time + Duration input
└─────────────────────────┘
```

### Components:
- **Checkbox (○/✓)**: Mark complete/incomplete
- **Task Name**: Your task description
- **Priority Indicator**: 🔴 (High), 🟠 (Medium), 🟡 (Low)
- **Start Time**: When the task begins
- **Duration Input**: Editable hours (click to change)
- **Action Buttons** (on hover):
  - ⏱ Start timer
  - × Delete task

## Visual Scheduling

### Time Management
- **Morning blocks**: 6 AM - 12 PM
- **Afternoon blocks**: 12 PM - 6 PM
- **Evening blocks**: 6 PM - 10 PM

### Overlapping Tasks
- Tasks stack left-to-right if they overlap
- Narrower blocks for multiple concurrent tasks
- Visual indication of overbooked times

### Today Highlighting
- Current day has blue background tint
- Easy to see today's schedule at a glance

## Examples

### Short Task (30 minutes)
```javascript
Task: "Quick Email Check"
Duration: 0.5 hours
Visual: Small block, 30px height
```

### Normal Task (1-2 hours)
```javascript
Task: "Write Report"
Duration: 2 hours
Visual: Medium block, 120px height
```

### Long Task (4+ hours)
```javascript
Task: "Deep Work Session"
Duration: 4 hours
Visual: Large block, 240px height, spans multiple time slots
```

## Dynamic Resizing Demo

```
Before (1 hour):
┌─────────────┐
│ Write Code  │  ← 60px height
└─────────────┘

Change duration to 3 hours:
┌─────────────┐
│             │
│ Write Code  │  ← 180px height
│             │
└─────────────┘
```

## Priority and Color Coding

| Priority | Color | Border | Use Case |
|----------|-------|--------|----------|
| **High** | Red | Red border | Urgent, critical tasks |
| **Medium** | Orange | Orange border | Important, but not urgent |
| **Low** | Yellow | Yellow border | Nice to have |
| **None** | Blue | Blue border | General tasks |

### Visual Hierarchy
- High priority tasks "pop" with bright red
- Medium priority stands out with orange
- Low priority is subtle with yellow
- Regular tasks blend with blue

## Mobile Optimization

### Touch-Friendly
- **Large tap targets**: Easy to click task blocks
- **Scrollable**: Horizontal scroll for days, vertical for hours
- **Sticky headers**: Day names and times stay visible
- **Responsive inputs**: Duration changes work on mobile

### iPhone Specific
- Optimized for iPhone screen widths
- Touch manipulation for smooth scrolling
- Safe area padding for notch/home indicator

## Keyboard Shortcuts

- **Enter**: Add task (when form is open)
- **Escape**: Cancel task creation
- **Tab**: Navigate between inputs
- **Number input**: Change duration instantly

## Best Practices

### ✅ Do:
- Set realistic estimated hours
- Use priorities to highlight critical tasks
- Resize tasks as you learn actual time needed
- Check for scheduling conflicts (overlapping blocks)

### ❌ Don't:
- Set duration to 0 (minimum is 0.5 hours)
- Exceed 12 hours for a single task (break it up!)
- Forget to update hours after completing tasks
- Overbook your schedule (leave buffer time)

## Tips & Tricks

### 1. Visual Time Blocking
Use different priorities to color-code your day:
- 🔴 Deep work sessions
- 🟠 Meetings and collaboration
- 🟡 Email and admin tasks
- 🔵 Breaks and flexible time

### 2. Realistic Scheduling
- Add 25% buffer to your estimates
- 1 hour task? Set it to 1.25 hours
- Accounts for context switching

### 3. Daily Planning
- Morning: Schedule high-priority tasks (red blocks)
- Afternoon: Medium priority and meetings (orange blocks)
- Evening: Low priority and cleanup (yellow/blue blocks)

### 4. Quick Reschedule
If a task takes longer:
1. Click the duration input
2. Change 2 → 3 hours
3. Watch it grow automatically!

## Comparison: Week View vs Calendar View

| Feature | Week View | Calendar View |
|---------|-----------|---------------|
| **Layout** | List of tasks per day | Time-proportional blocks |
| **Visual** | Compact, text-based | Spacious, graphical |
| **Duration** | Shows hours as text | Shows hours as size |
| **Best For** | Task lists, GTD | Time blocking, scheduling |
| **Resizing** | Edit field | Live input in calendar |

## Use Calendar View When:
- Planning your day hour-by-hour
- Doing time blocking / Pomodoro
- Need to visualize time allocation
- Checking for scheduling conflicts
- Estimating total daily workload

## Use Week View When:
- Reviewing task completion
- Bulk editing many tasks
- Drag-and-drop reorganization
- Quick task list overview

## Technical Details

### Time Calculation
- **1 hour** = 60 pixels height
- **0.5 hours** (30 min) = 30 pixels
- **2 hours** = 120 pixels
- **Formula**: `height = duration × 60px`

### Positioning
- Tasks start at their scheduled hour
- Top position calculated from 6 AM baseline
- Formula: `top = (startHour - 6) × 60px`

### Duration Constraints
- **Minimum**: 0.5 hours (30 minutes)
- **Maximum**: 12 hours
- **Increment**: 0.5 hours (30-minute blocks)

## Troubleshooting

### Task Too Small
- Minimum height is 40px even for short tasks
- Ensures buttons remain clickable
- Text remains readable

### Task Overlaps Time Slots
- This is normal! Tasks span multiple hours
- Use this to visualize actual time commitment

### Duration Input Not Changing
- Make sure you're authenticated (changes sync to Drive)
- Check browser console for errors
- Try refreshing if sync is stuck

### Mobile Issues
- Scroll horizontally to see all days
- Scroll vertically to see all hours
- Use two fingers to zoom if needed

## Keyboard Accessibility

All actions are keyboard accessible:
- **Tab**: Move between tasks and inputs
- **Enter**: Confirm duration change
- **Space**: Toggle task completion
- **Escape**: Cancel editing

---

**Pro Tip**: Use Calendar View for planning your day in the morning, then switch to Week View for quick task updates throughout the day! The best of both worlds! 📅✨
