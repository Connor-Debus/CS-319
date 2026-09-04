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

The Version 2 build adds assignment metrics and optional grading:

- Total, completed, remaining, and overdue assignment counts
- Optional grades on assignments
- Average grade calculated only from graded assignments
- Inline grade entry and clear overdue labels

The current app is the Version 2 enhanced build. Version 1 remains available on the `Version_1` branch.

```bash
git add .
git commit -m "Add Version 2 assignment metrics and grading"
git tag v2.0
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

## Version 2 verification

Create five assignments. Complete exactly two, leave three unfinished, and set one of the unfinished assignments to a past due date. Give grades to exactly three assignments and leave two ungraded. Verify the dashboard displays:

- Total = 5
- Completed = 2
- Remaining = 3
- Overdue = 1
- Average grade uses only the three graded assignments
