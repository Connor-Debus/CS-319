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

### Version 2 — Future Enhancements

Version 2 will be developed after the basic workflow is demonstrated. Possible enhancements include richer progress views, assignment search and filters, responsive improvements, and additional study-planning tools.

The current app is the Version 1 basic build. Create the first Git checkpoint now. After the Version 2 features are provided and implemented, create the second checkpoint:

```bash
git init
git add .
git commit -m "Build Version 1 basic study planner"
# Add Version 2 requirements and implementation later, then:
# git add .
# git commit -m "Add Version 2 enhancements"
# git tag v1.0-basic
# git tag v2.0-enhanced
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
