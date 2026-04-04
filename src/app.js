let tasks = [];
let currentFilter = 'all';

function init() {
  try {
    const saved = localStorage.getItem('tasks');
    if (saved) tasks = JSON.parse(saved);
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') document.body.classList.add('dark');
  } catch (e) {
    console.warn('localStorage read failed:', e);
    tasks = [];
  }
  updateThemeBtn();
  render();
  bindEvents();
}

function addTask(text, tags) {
  if (!text || text.trim() === '') return null;
  const task = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    tags: tags || [],
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  save();
  return task;
}

function deleteTask(id) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  save();
  return true;
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  task.completed = !task.completed;
  save();
  return task;
}

function save() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.warn('localStorage unavailable:', e);
  }
}

function filterTasks(tag) {
  if (!tag) return tasks;
  return tasks.filter(t => t.tags && t.tags.includes(tag));
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.matches('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = document.body.classList.contains('dark') ? 'Sun' : 'Moon';
}

function render() {
  const list = document.getElementById('taskList');
  if (!list) return;
  list.innerHTML = '';

  var displayTasks = getFilteredTasks();

  if (displayTasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'Chua co cong viec nao. Hay them cong viec dau tien!';
    list.appendChild(empty);
    updateStats();
    return;
  }
  displayTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;
    li.innerHTML =
      '<input type="checkbox" ' + (task.completed ? 'checked' : '') + '>' +
      '<span class="task-text">' + task.text + '</span>' +
      '<button class="delete-btn">Xoa</button>';
    list.appendChild(li);
  });
  updateStats();
}

function getFilteredTasks() {
  if (currentFilter === 'active') return tasks.filter(function(t) { return !t.completed; });
  if (currentFilter === 'done') return tasks.filter(function(t) { return t.completed; });
  return tasks;
}

function bindEvents() {
  const input = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const list   = document.getElementById('taskList');
  const theme  = document.getElementById('themeToggle');
  const filterBar = document.querySelector('.filter-bar');

  if (addBtn) addBtn.addEventListener('click', function() {
    addTask(input.value); input.value = ''; render();
  });

  if (input) input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { addTask(input.value); input.value = ''; render(); }
  });

  if (list) list.addEventListener('click', function(e) {
    const item = e.target.closest('.task-item');
    if (!item) return;
    if (e.target.matches('input[type="checkbox"]')) { toggleTask(item.dataset.id); render(); }
    if (e.target.matches('.delete-btn'))            { deleteTask(item.dataset.id); render(); }
  });

  if (filterBar) filterBar.addEventListener('click', function(e) {
    if (e.target.matches('.filter-btn')) setFilter(e.target.dataset.filter);
  });

  if (theme) theme.addEventListener('click', toggleTheme);
}

if (typeof module !== 'undefined') {
  module.exports = { addTask, deleteTask, toggleTask, filterTasks, setFilter, getFilteredTasks };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}
