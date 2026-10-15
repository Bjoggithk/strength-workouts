# Strength Workouts

A mobile-first, standalone workout website designed for runners. This repository contains only the static website; it does not depend on the separate Django project.

## What's included

- Six guided sessions: Gym A, Gym B, Gym C, Home A, Home B and Home C.
- One exercise per screen, with set/rep prescriptions, rest guidance, instructions, technique cues and regressions.
- Lightweight SVG exercise illustrations with simple motion cues.
- Tap-to-track set completion, previous/next exercise navigation, a workout recap and recent session history.
- A selectable hip-flexor loading progression included at the beginning of every workout.
- Responsive layouts for phones, a web-app manifest and an offline cache after first load.
- No login, analytics, third-party libraries or remote exercise-image dependencies.

## Structure

- `index.html` — app shell
- `app.css` — mobile-first layout and styling
- `app.js` — workout data, exercise guidance, set tracking and rendering
- `manifest.webmanifest` — installable web-app metadata
- `sw.js` — offline caching
- `icon.svg` — app icon
- `.github/workflows/deploy.yml` — GitHub Pages deployment

## Deploy to GitHub Pages

1. Open [repository Pages settings](https://github.com/Bjoggithk/strength-workouts/settings/pages).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab and verify that **Deploy Strength Workouts to GitHub Pages** finishes successfully.

Expected public site URL if published publicly: https://bjoggithk.github.io/strength-workouts/

**Plan and visibility note:** GitHub Pages is available for public repositories on GitHub Free. Publishing from a private repository requires GitHub Pro, Team, or Enterprise. This repository is currently private; keep it private only if your plan supports private-repository Pages or you intend to upgrade. If you want to use Pages on a free plan, you can make the repository public in Settings → General → Danger Zone → Change repository visibility. Changing visibility exposes the source code publicly, so make that change only if you are comfortable with it.

## Add future exercises or workouts

Edit `catalog` and `workouts` in `app.js`.

1. Add an exercise to `catalog` with a unique ID, a name, sets/reps, equipment, a short rationale, ordered setup instructions, technique cues, a warning/regression, and a `visual` category.
2. Add the ID to a workout's `exercises` array, or add a new workout object to `workouts`.
3. Available illustration categories include `hip`, `squat`, `hinge`, `step`, `calf`, `shin`, `abduction`, `upper` and `core`. Add a drawing to `pose()` when you need a new category.
4. If you change cached files, increment `CACHE_NAME` in `sw.js` so installed copies refresh.

Workout completion and selected hip-flexor stage are stored in local browser storage on each device; they are not synchronised across devices.

## Safety note

This is a general strength reference, not a diagnosis-specific rehabilitation plan. Pain that increases during exercise, worsens the next morning, affects walking/running mechanics or becomes focal over bone warrants stopping/regressing and seeking appropriate clinical assessment. The illustrations are simplified movement schematics, not clinical technique videos.
