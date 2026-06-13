const STORAGE_KEY = 'desktop-work-os-web';

const state = loadState();

const taskForm = document.querySelector('#task-form');
const taskTitle = document.querySelector('#task-title');
const taskList = document.querySelector('#task-list');
const fileEntryForm = document.querySelector('#file-entry-form');
const fileEntry = document.querySelector('#file-entry');
const activityList = document.querySelector('#activity-list');

taskForm.addEventListener('submit', addTask);
fileEntryForm.addEventListener('submit', addFileEntry);
taskList.addEventListener('click', handleTaskAction);

render();

function addTask(event) {
  event.preventDefault();

  const title = taskTitle.value.trim();
  if (!title) return;

  const task = {
    id: createId(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.tasks.unshift(task);
  logActivity('task', `Added task: ${title}`);
  taskTitle.value = '';
  saveAndRender();
}

function addFileEntry(event) {
  event.preventDefault();

  const message = fileEntry.value.trim();
  if (!message) return;

  logActivity('file', `File entry: ${message}`);
  fileEntry.value = '';
  saveAndRender();
}

function handleTaskAction(event) {
  const element = event.target.closest('[data-action]');
  if (!element) return;

  const task = state.tasks.find((item) => item.id === element.dataset.id);
  if (!task) return;

  if (element.dataset.action === 'toggle') {
    task.completed = element.checked;
    task.updatedAt = new Date().toISOString();
    logActivity('task', task.completed ? `Completed task: ${task.title}` : `Reopened task: ${task.title}`);
  }

  if (element.dataset.action === 'edit') {
    const title = prompt('Edit task', task.title);
    const cleaned = title ? title.trim() : '';

    if (cleaned) {
      task.title = cleaned;
      task.updatedAt = new Date().toISOString();
      logActivity('task', `Edited task: ${task.title}`);
    }
  }

  if (element.dataset.action === 'delete') {
    state.tasks = state.tasks.filter((item) => item.id !== task.id);
    logActivity('task', `Deleted task: ${task.title}`);
  }

  saveAndRender();
}

function render() {
  renderTasks();
  renderActivities();
}

function renderTasks() {
  if (state.tasks.length === 0) {
    taskList.innerHTML = '<p class="empty">No tasks yet.</p>';
    return;
  }

  taskList.innerHTML = state.tasks.map((task) => `
    <article class="task-item ${task.completed ? 'is-done' : ''}">
      <label>
        <input type="checkbox" data-action="toggle" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
        <span class="task-title">${escapeHtml(task.title)}</span>
      </label>
      <div class="task-actions">
        <button type="button" class="secondary" data-action="edit" data-id="${task.id}">Edit</button>
        <button type="button" class="secondary danger" data-action="delete" data-id="${task.id}">Delete</button>
      </div>
    </article>
  `).join('');
}

function renderActivities() {
  if (state.activities.length === 0) {
    activityList.innerHTML = '<p class="empty">No activity yet.</p>';
    return;
  }

  activityList.innerHTML = state.activities.map((activity) => `
    <article class="activity-item">
      <strong>${escapeHtml(activity.message)}</strong>
      <span>${escapeHtml(activity.type)} · ${formatDateTime(activity.createdAt)}</span>
    </article>
  `).join('');
}

function logActivity(type, message) {
  state.activities.unshift({
    id: createId(),
    type,
    message,
    createdAt: new Date().toISOString()
  });
  state.activities = state.activities.slice(0, 100);
}

function createId() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      tasks: Array.isArray(saved?.tasks) ? saved.tasks : [],
      activities: Array.isArray(saved?.activities) ? saved.activities : []
    };
  } catch {
    return { tasks: [], activities: [] };
  }
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
