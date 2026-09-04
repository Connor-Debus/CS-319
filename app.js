const STORAGE_KEY = 'study-board-state-v2';
const defaultState = {
  courses: [
    { id: 'c1', name: 'Data Structures', code: 'CS 201', instructor: 'Dr. Chen', grade: 92, color: '#f26d5b' },
    { id: 'c2', name: 'Design & Society', code: 'ART 108', instructor: 'Prof. Hall', grade: 88, color: '#68aeb9' },
    { id: 'c3', name: 'Linear Algebra', code: 'MATH 240', instructor: 'Dr. Patel', grade: 95, color: '#e0ad55' }
  ],
  assignments: [
    { id: 'a1', title: 'Binary search analysis', courseId: 'c1', due: '2026-09-07', priority: 'high', status: 'todo' },
    { id: 'a2', title: 'Reading response: public space', courseId: 'c2', due: '2026-09-09', priority: 'medium', status: 'todo' },
    { id: 'a3', title: 'Problem set 04', courseId: 'c3', due: '2026-09-11', priority: 'low', status: 'todo' },
    { id: 'a4', title: 'Interface critique', courseId: 'c2', due: '2026-09-03', priority: 'medium', status: 'completed' }
  ]
};

let state = loadState();
let assignmentFilter = 'all';
let editing = { type: null, id: null };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultState); }
  catch { return structuredClone(defaultState); }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function courseName(id) { return state.courses.find((course) => course.id === id)?.name || 'Unknown course'; }
function formatDate(dateString) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${dateString}T12:00:00`)); }
function dateParts(dateString) { const date = new Date(`${dateString}T12:00:00`); return { day: date.getDate(), month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date) }; }
function uid(prefix) { return `${prefix}${Date.now().toString(36)}`; }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2500); }

function render() {
  renderStats(); renderFocus(); renderProgress(); renderUpcoming(); renderCourses(); renderAssignments();
}
function renderStats() {
  const assignments = state.assignments;
  const incomplete = assignments.filter((item) => item.status !== 'completed');
  $('#due-value').textContent = incomplete.length;
  $('#urgent-value').textContent = `${incomplete.filter((item) => item.priority === 'high').length} urgent`;
  const complete = assignments.filter((item) => item.status === 'completed').length;
  $('#completed-value').textContent = assignments.length ? `${Math.round((complete / assignments.length) * 100)}%` : '0%';
  $('#completed-count').textContent = `${complete} of ${assignments.length}`;
}
function assignmentMarkup(item) { return `<div class="focus-item"><span class="priority-bar ${item.priority}"></span><div class="item-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(courseName(item.courseId))}</span></div><span class="due-date">${formatDate(item.due)}</span></div>`; }
function renderFocus() {
  const items = state.assignments.filter((item) => item.status !== 'completed').sort(sortAssignments).slice(0, 4);
  $('#focus-list').innerHTML = items.length ? items.map(assignmentMarkup).join('') : emptyState('You are all caught up.', 'Nice work. Add a new assignment when you are ready.');
}
function renderProgress() {
  $('#course-progress').innerHTML = state.courses.length ? state.courses.map((course) => `<div class="progress-row"><span>${escapeHtml(course.code)}</span><div class="progress-track"><span style="width:${course.grade}%"></span></div><strong>${course.grade}%</strong></div>`).join('') : emptyState('No courses yet.', 'Add your first course to see progress.');
}
function renderUpcoming() {
  const items = state.assignments.filter((item) => item.status !== 'completed').sort((a, b) => a.due.localeCompare(b.due)).slice(0, 3);
  $('#upcoming-list').innerHTML = items.length ? items.map((item) => { const parts = dateParts(item.due); return `<div class="upcoming-item"><div class="date-block"><strong>${parts.day}</strong><span>${parts.month}</span></div><div class="item-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(courseName(item.courseId))} · ${item.priority} priority</small></div></div>`; }).join('') : emptyState('No upcoming deadlines.', 'Your calendar is clear.');
}
function renderCourses() {
  $('#course-count').textContent = `${state.courses.length} course${state.courses.length === 1 ? '' : 's'}`;
  if (!state.courses.length) { $('#courses-table').innerHTML = emptyState('Your roster is empty.', 'Add a course to get started.'); return; }
  $('#courses-table').innerHTML = `<table class="data-table"><thead><tr><th>Course</th><th>Instructor</th><th>Grade</th><th>Assignments</th><th></th></tr></thead><tbody>${state.courses.map((course) => `<tr><td><span class="course-name">${escapeHtml(course.name)}</span><span class="course-code">${escapeHtml(course.code)}</span></td><td>${escapeHtml(course.instructor || 'Not set')}</td><td><span class="grade-pill">${course.grade}%</span></td><td>${state.assignments.filter((item) => item.courseId === course.id).length}</td><td><div class="table-actions"><button class="table-action" data-edit-course="${course.id}" aria-label="Edit ${escapeHtml(course.name)}" title="Edit course">✎</button><button class="table-action" data-delete-course="${course.id}" aria-label="Delete ${escapeHtml(course.name)}" title="Delete course">×</button></div></td></tr>`).join('')}</tbody></table>`;
}
function renderAssignments() {
  const query = $('#assignment-search').value.trim().toLowerCase();
  const filtered = state.assignments.filter((item) => (assignmentFilter === 'all' || (assignmentFilter === 'done' ? item.status === 'completed' : item.status !== 'completed')) && (`${item.title} ${courseName(item.courseId)}`.toLowerCase().includes(query))).sort(sortAssignments);
  $('#assignments-table').innerHTML = filtered.length ? `<table class="data-table"><thead><tr><th>Assignment</th><th>Course</th><th>Due date</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody>${filtered.map((item) => `<tr><td><span class="course-name">${escapeHtml(item.title)}</span></td><td>${escapeHtml(courseName(item.courseId))}</td><td>${formatDate(item.due)}</td><td><select class="priority-pill ${item.priority}" data-priority="${item.id}" aria-label="Change priority for ${escapeHtml(item.title)}"><option value="high" ${item.priority === 'high' ? 'selected' : ''}>High</option><option value="medium" ${item.priority === 'medium' ? 'selected' : ''}>Medium</option><option value="low" ${item.priority === 'low' ? 'selected' : ''}>Low</option></select></td><td><select class="status-pill ${item.status}" data-status="${item.id}" aria-label="Change status for ${escapeHtml(item.title)}"><option value="todo" ${item.status === 'todo' ? 'selected' : ''}>To do</option><option value="completed" ${item.status === 'completed' ? 'selected' : ''}>Completed</option></select></td><td><div class="table-actions"><button class="table-action" data-edit-assignment="${item.id}" aria-label="Edit ${escapeHtml(item.title)}" title="Edit assignment">✎</button><button class="table-action" data-delete-assignment="${item.id}" aria-label="Delete ${escapeHtml(item.title)}" title="Delete assignment">×</button></div></td></tr>`).join('')}</tbody></table>` : emptyState('Nothing matches this view.', 'Try another filter or add a new assignment.');
}
function sortAssignments(a, b) { const priority = { high: 0, medium: 1, low: 2 }; return (a.status === 'completed') - (b.status === 'completed') || priority[a.priority] - priority[b.priority] || a.due.localeCompare(b.due); }
function emptyState(title, detail) { return `<div class="empty-state"><strong>${title}</strong>${detail}</div>`; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

function openModal(type, id = null) {
  editing = { type, id };
  const isCourse = type === 'course'; const item = id ? state[isCourse ? 'courses' : 'assignments'].find((entry) => entry.id === id) : null;
  $('#modal-kicker').textContent = item ? `Edit ${isCourse ? 'course' : 'assignment'}` : `New ${isCourse ? 'course' : 'assignment'}`;
  $('#modal-title').textContent = item ? `Update ${isCourse ? 'course' : 'assignment'}` : `Add ${isCourse ? 'course' : 'assignment'}`;
  $('#form-fields').innerHTML = isCourse ? courseFields(item) : assignmentFields(item);
  $('#modal-backdrop').hidden = false;
  setTimeout(() => $('#form-fields input, #form-fields select')?.focus(), 0);
}
function courseFields(course = {}) { return `<div class="form-grid"><div class="form-field full"><label for="course-name">Course name</label><input id="course-name" name="name" required value="${escapeHtml(course.name || '')}" placeholder="e.g. Data Structures"></div><div class="form-field"><label for="course-code">Course code</label><input id="course-code" name="code" required value="${escapeHtml(course.code || '')}" placeholder="e.g. CS 201"></div><div class="form-field"><label for="course-instructor">Instructor</label><input id="course-instructor" name="instructor" value="${escapeHtml(course.instructor || '')}" placeholder="e.g. Dr. Chen"></div><div class="form-field full"><label for="course-grade">Current grade (%)</label><input id="course-grade" name="grade" type="number" min="0" max="100" required value="${course.grade ?? 90}"></div></div>`; }
function assignmentFields(item = {}) { return `<div class="form-grid"><div class="form-field full"><label for="assignment-title">Assignment title</label><input id="assignment-title" name="title" required value="${escapeHtml(item.title || '')}" placeholder="e.g. Research proposal"></div><div class="form-field full"><label for="assignment-course">Course</label><select id="assignment-course" name="courseId" required>${state.courses.map((course) => `<option value="${course.id}" ${course.id === item.courseId ? 'selected' : ''}>${escapeHtml(course.name)} (${escapeHtml(course.code)})</option>`).join('')}</select></div><div class="form-field"><label for="assignment-due">Due date</label><input id="assignment-due" name="due" type="date" required value="${item.due || '2026-09-15'}"></div><div class="form-field"><label for="assignment-priority">Priority</label><select id="assignment-priority" name="priority"><option value="high" ${item.priority === 'high' ? 'selected' : ''}>High</option><option value="medium" ${item.priority === 'medium' || !item.priority ? 'selected' : ''}>Medium</option><option value="low" ${item.priority === 'low' ? 'selected' : ''}>Low</option></select></div></div>`; }
function closeModal() { $('#modal-backdrop').hidden = true; editing = { type: null, id: null }; }

$('#modal-form').addEventListener('submit', (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.target)); const collection = editing.type === 'course' ? state.courses : state.assignments; if (editing.id) Object.assign(collection.find((item) => item.id === editing.id), values, editing.type === 'course' ? { grade: Number(values.grade) } : {}); else collection.push({ id: uid(editing.type === 'course' ? 'c' : 'a'), ...values, ...(editing.type === 'course' ? { grade: Number(values.grade), color: '#f26d5b' } : { status: 'todo' }) }); persist(); render(); closeModal(); showToast(`${editing.type === 'course' ? 'Course' : 'Assignment'} saved`); });
$('#modal-close').addEventListener('click', closeModal); $('#modal-cancel').addEventListener('click', closeModal); $('#modal-backdrop').addEventListener('click', (event) => { if (event.target.id === 'modal-backdrop') closeModal(); });
$('#add-course').addEventListener('click', () => openModal('course')); $('#add-assignment').addEventListener('click', () => state.courses.length ? openModal('assignment') : showToast('Add a course before creating assignments')); $('#quick-add').addEventListener('click', () => state.courses.length ? openModal('assignment') : showToast('Add a course before creating assignments'));

$$('[data-view], [data-view-target]').forEach((button) => button.addEventListener('click', () => { const view = button.dataset.view || button.dataset.viewTarget; $$('.nav-link').forEach((link) => link.classList.toggle('active', link.dataset.view === view)); $$('.view').forEach((section) => section.classList.toggle('active-view', section.dataset.page === view)); $('#page-title').innerHTML = view === 'overview' ? 'Good morning, Alex<span class="accent">.</span>' : view[0].toUpperCase() + view.slice(1); }));
$$('.filter-tab').forEach((button) => button.addEventListener('click', () => { assignmentFilter = button.dataset.filter; $$('.filter-tab').forEach((tab) => tab.classList.toggle('active', tab === button)); renderAssignments(); }));
$('#assignment-search').addEventListener('input', renderAssignments);
document.addEventListener('click', (event) => { const target = event.target; if (target.dataset.editCourse) openModal('course', target.dataset.editCourse); if (target.dataset.deleteCourse) deleteCourse(target.dataset.deleteCourse); if (target.dataset.editAssignment) openModal('assignment', target.dataset.editAssignment); if (target.dataset.deleteAssignment) deleteAssignment(target.dataset.deleteAssignment); });
document.addEventListener('change', (event) => { const target = event.target; if (target.dataset.priority) updateAssignment(target.dataset.priority, { priority: target.value }); if (target.dataset.status) updateAssignment(target.dataset.status, { status: target.value }); });
function updateAssignment(id, changes) { Object.assign(state.assignments.find((item) => item.id === id), changes); persist(); render(); showToast('Assignment updated'); }
function deleteCourse(id) { const course = state.courses.find((item) => item.id === id); if (!course || !confirm(`Delete ${course.name}? Its assignments will also be removed.`)) return; state.courses = state.courses.filter((item) => item.id !== id); state.assignments = state.assignments.filter((item) => item.courseId !== id); persist(); render(); showToast('Course deleted'); }
function deleteAssignment(id) { const item = state.assignments.find((entry) => entry.id === id); if (!item || !confirm(`Delete ${item.title}?`)) return; state.assignments = state.assignments.filter((entry) => entry.id !== id); persist(); render(); showToast('Assignment deleted'); }
$('#theme-toggle').addEventListener('click', () => { document.body.classList.toggle('warm-mode'); document.body.style.setProperty('--paper', document.body.classList.contains('warm-mode') ? '#fff8ee' : '#f7f8f4'); showToast('Theme updated'); });
render();
