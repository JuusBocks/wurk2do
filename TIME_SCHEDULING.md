# Time Scheduling Feature

## Overview

Tasks in **wurk2do** can now be scheduled with specific start times and durations, allowing seamless integration between Week View and Calendar View.

## How to Schedule a Task

### In Week View:

#### 1. **Set Start Time** (Purple Calendar Icon)
- Click the purple **"Time"** button on any task
- Select a time slot from the dropdown (12 AM - 11 PM)
- The task text will update to include the time prefix
  - Example: "Meeting with team" → "2 PM - Meeting with team"

#### 2. **Set Duration** (Blue Clock Icon)
- Click the blue **"Duration"** button (or "Hours" if not set)
- Enter estimated hours (0.5 to 24 hours)
- This determines how long the task block appears in Calendar View

#### 3. **View in Calendar**
- Switch to Calendar View using bottom navigation
- Your task will appear at the scheduled time with the correct duration
- Tasks without times won't show in Calendar View

## Features

### Visual Indicators

**In Week View Day Headers:**
- 🕐 **Blue clock** + number = Total estimated hours for the day
- 📅 **Purple calendar** + number = Number of tasks with scheduled times
- ⭐ **Priority indicators** = High/medium/low priority task counts

**In Task Cards:**
- **Purple pill** = Start time (e.g., "2 PM")
- **Blue pill** = Duration (e.g., "1.5h")
- **Priority star** = Color-coded by priority level

### Smart Time Formatting

When you set a time, the task is automatically formatted:
```
Original: "Write report"
With time: "2 PM - Write report"
```

The time is stored in the task text and syncs to Google Drive!

## Use Cases

### Scenario 1: Daily Schedule
1. Create tasks in Week View: "Team standup", "Review PRs", "Lunch break"
2. Click each task and set times: 9 AM, 10 AM, 12 PM
3. Set durations: 0.5h, 1h, 1h
4. View your day in Calendar View as a visual timeline!

### Scenario 2: Mixed Planning
- Some tasks have times (meetings, appointments)
- Other tasks are flexible (todos without specific times)
- Week View shows all tasks
- Calendar View shows only time-scheduled tasks

### Scenario 3: Time Blocking
1. Estimate all task durations in Week View
2. See total hours per day in the header
3. Schedule important tasks in Calendar View
4. Adjust as needed based on available time

## Integration Between Views

### Week View → Calendar View
- Set time + duration in Week View
- Task automatically appears in Calendar View at the correct time slot
- Drag-and-drop still works in Week View
- Changes sync instantly

### Calendar View → Week View
- Tasks created in Calendar View with times
- Appear in Week View with time shown in task text
- Can be moved between days
- Time remains part of the task

## Tips & Tricks

### Efficient Workflow
1. **Plan in Week View**: Add all tasks, set priorities
2. **Estimate durations**: Add hours to each task
3. **Schedule in Calendar**: Drag tasks to time slots or set times
4. **Check Summary**: Review total hours and priorities

### Time Management
- Use the blue clock totals to avoid over-scheduling
- Purple calendar count shows how much is locked into specific times
- Leave some tasks unscheduled for flexibility

### Multi-Day Events
- For tasks spanning multiple days, create separate entries
- Use consistent naming: "Project X - Day 1", "Project X - Day 2"
- Set same duration for consistency

## Keyboard Shortcuts

- **Enter**: Save time/duration
- **Escape**: Cancel editing
- **Tab**: Move between fields (in forms)

## Data Sync

All time and duration data syncs to Google Drive:
- Times are stored in task text
- Durations stored as `estimatedHours` field
- Changes merge intelligently across devices
- Works offline, syncs when connected

## Visual Design

Time features use distinct colors for easy identification:
- 🟣 **Purple** = Time/scheduling features
- 🔵 **Blue** = Duration/hours features
- 🔴 **Red** = High priority
- 🟠 **Orange** = Medium priority
- 🟡 **Yellow** = Low priority

---

*Schedule smart, work smarter!* ⏰
