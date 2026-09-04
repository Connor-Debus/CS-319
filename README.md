# Study Board

A student study planner and grade dashboard built with HTML, CSS, and vanilla JavaScript. It is intentionally dependency-free so it can deploy directly to GitHub Pages.

## Versions

### Version 1 — Basic Version

The initial version establishes the core workflow:

- Add, edit, and delete courses
- Add, edit, and delete assignments
- Change assignment priority and completion status
- View course grades and assignment counts
- Persist data through browser refresh with `localStorage`

### Version 2 — Enhanced Version

The enhanced version keeps the Version 1 workflow and adds:

- Responsive dashboard layout for mobile and desktop
- Overview dashboard with GPA, due-work, completion, and focus summaries
- Assignment search and All / To do / Completed filters
- Inline priority and status controls
- Upcoming deadlines and course progress visualizations
- Light theme toggle
- Accessible labels, dialog behavior, empty states, and confirmation prompts

The current app is the Version 2 enhanced build. For a classroom demonstration, create a Git checkpoint after the Basic Version, then a second checkpoint after the enhancements:

```bash
git init
git add .
git commit -m "Build Version 1 basic study planner"
# Add Version 2 enhancements, then:
git add .
git commit -m "Enhance dashboard with progress views and filters"
git tag v1.0-basic
git tag v2.0-enhanced
```

## Run locally

Open `index.html` in a browser, or serve the folder with:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## GitHub Pages

1. Push the project to a GitHub repository.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main`, and choose `/ (root)`.
4. Save. GitHub Pages will publish `index.html`.

## Required test checklist

- Add a course.
- Edit a course.
- Delete a course.
- Add several courses.
- Add an assignment.
- Edit an assignment.
- Delete an assignment.
- Change priority.
- Change status.
- Refresh the browser and confirm data remains.
