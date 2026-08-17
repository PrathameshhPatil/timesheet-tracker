# TimeTrack — Personal Timesheet App

A personal, single-page timesheet tracker for logging daily work tasks, visualizing productivity, and managing time — no backend, no login, all data stays in your browser.

## Features

- Log tasks with date, category, start/end time (auto-calculated duration), notes, and status
- Dashboard with today's/this week's hours, tasks completed today, top category, daily progress bar, weekly bar chart, and a category pie chart
- Full task list with date range, category, status, and text filters; sorting; pagination; bulk delete; CSV export
- Analytics page: date-range selector (this week / this month / last month / custom), daily hours trend, hours-by-category bar chart, category distribution pie chart, top 5 longest tasks, productivity score vs. daily target
- Settings: dark mode, custom categories, daily hour target, working days, full JSON backup/restore, clear-all-data with double confirmation
- Responsive: mobile hamburger nav, tablet/desktop horizontal nav
- Sample data auto-loads on first run so the app isn't empty out of the box

## Tech Stack

- React 18 (functional components + hooks)
- Vite
- Tailwind CSS
- Recharts (bar / line / pie charts)
- React Router v6
- React Context API for global state
- date-fns
- react-hot-toast
- lucide-react icons
- Data persistence: `localStorage` only — nothing leaves your browser

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Building for Production

```bash
npm run build
npm run preview
```

## How to Use

1. On first load, sample tasks are generated automatically so you can see the app populated.
2. Click **Quick Add Task** (Dashboard) or use the form at the top of the **Tasks** page to log a task.
3. Edit or delete any task from its card (pencil / trash icons — delete asks for inline confirmation).
4. Use the filter bar on **Tasks** to narrow by date range, category, status, or search text; sort by any column; select multiple tasks to bulk-delete; export the current filtered view to CSV.
5. Check **Analytics** for trends over a selected period and your productivity score against your daily target.
6. Adjust categories, daily target, working days, dark mode, and backups in **Settings**.

## Customization

- **Categories:** add/remove custom categories in Settings → Categories (the 8 defaults can't be deleted). New categories immediately appear in the task form's dropdown.
- **Colors:** edit `CATEGORY_COLORS` in [`src/utils/chartUtils.js`](src/utils/chartUtils.js) to change category colors used in badges and charts, or edit the `primary`/`secondary`/`accent`/`danger` values in [`tailwind.config.js`](tailwind.config.js) to change the app's overall color scheme.
- **Daily target:** Settings → Daily Target (defaults to 8h; drives the Dashboard progress bar and Analytics productivity score).
- **New field on a task:** update the shape in `useTasks.js` (`addTask`/`updateTask`), the validation in `utils/validators.js`, the inputs in `components/TaskForm.jsx`, and wherever it should be displayed (`TaskCard.jsx`, `exportUtils.js` for CSV columns).
- **Working week start (Monday vs Sunday):** the weekly views use `date-fns`'s `{ weekStartsOn: 1 }` (Monday) in `utils/timeUtils.js` (`getWeekStart`/`getWeekEnd`) — change to `0` for Sunday-start weeks.

## Deployment

All three targets below just need the contents of `dist/` after `npm run build`.

**Vercel**
```bash
npm install -g vercel
vercel
```
Framework preset: Vite. No environment variables needed.

**Netlify**
```bash
npm run build
# Drag-and-drop the dist/ folder at app.netlify.com/drop
# or, with the Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages**
1. Set `base: '/<repo-name>/'` in `vite.config.js`.
2. `npm run build`
3. Push the `dist/` folder to a `gh-pages` branch (e.g. via the `gh-pages` npm package), or use a GitHub Actions workflow that runs `npm run build` and publishes `dist/`.

## Data & Privacy

Every task, category, and setting lives in your browser's `localStorage` — nothing is sent to any server. This means:
- Data is per-browser, per-device (not synced across devices)
- Clearing browser data / site data will erase it — use **Settings → Export Backup (JSON)** periodically if you want a portable copy
- **Settings → Import Backup (JSON)** restores from that file (on this or another browser)

## License

Personal project — no license restrictions specified.
