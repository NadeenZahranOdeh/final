
const prayers = [
  { name: 'Fajr',    time: '04:32 AM' },
  { name: 'Dhuhr',   time: '01:15 PM' },
  { name: 'Asr',     time: '04:52 PM' },
  { name: 'Maghrib', time: '07:44 PM' },
  { name: 'Isha',    time: '09:12 PM' },
];

const adhkarMessages = [
  "Start your day with remembrance of Allah.",
  "One step closer — keep going!",
  "Don't forget your evening dhikr to close your day with peace.",
  "Almost there — one more dhikr to go!",
  "MashaAllah! All adhkar completed today! 🌿",
];

/* ===========================
   LOCAL STORAGE HELPERS
=========================== */
function loadState(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage unavailable:', e);
  }
}

/* ===========================
   ADHKAR MODULE
=========================== */
let adhkarState = loadState('adhkar', [false, false, false, false]);

function renderAdhkar() {
  const toggles = document.querySelectorAll('.adhkar-toggle');
  toggles.forEach((toggle, i) => {
    toggle.checked = adhkarState[i];
  });
  updateAdhkarCompletion();
}

function updateAdhkarCompletion() {
  const count = adhkarState.filter(Boolean).length;
  document.getElementById('adhkarCount').textContent = `${count}/4`;
  document.getElementById('adhkarMsg').textContent = adhkarMessages[count];
}

function initAdhkar() {
  document.querySelectorAll('.adhkar-toggle').forEach((toggle, i) => {
    toggle.addEventListener('change', () => {
      adhkarState[i] = toggle.checked;
      saveState('adhkar', adhkarState);
      updateAdhkarCompletion();
    });
  });
  renderAdhkar();
}

/* ===========================
   PRAYER DATE
=========================== */
function setPrayerDate() {
  const d = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dayName = days[d.getDay()];
  const date = d.getDate();
  const suffix = date === 1 ? 'ST' : date === 2 ? 'ND' : date === 3 ? 'RD' : 'TH';
  document.getElementById('prayerDate').textContent =
    `TODAY · ${dayName.toUpperCase()}, ${date}${suffix} ${months[d.getMonth()].toUpperCase()}`;
}

/* ===========================
   PRAYER TRACKER MODULE
=========================== */
let prayerState = loadState('prayerState', prayers.map(() => ({ fard: false, sunnah: false })));

function renderPrayers() {
  const list = document.getElementById('prayerList');
  list.innerHTML = '';

  prayers.forEach((prayer, i) => {
    const state = prayerState[i];
    list.innerHTML += `
      <div class="prayer-item">
        <div class="prayer-name-col">
          <div class="prayer-name">${prayer.name}</div>
          <div class="prayer-time">${prayer.time}</div>
        </div>
        <div class="prayer-circles">
          <div class="prayer-circle-col">
            <div class="prayer-circle ${state.fard ? 'done' : ''}" data-prayer="${i}" data-type="fard">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="circle-label">Fard</div>
          </div>
          <div class="prayer-circle-col">
            <div class="prayer-circle ${state.sunnah ? 'done' : ''}" data-prayer="${i}" data-type="sunnah">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="circle-label">Sunnah</div>
          </div>
        </div>
      </div>`;
  });

  // Attach click events to circles
  document.querySelectorAll('.prayer-circle').forEach(circle => {
    circle.addEventListener('click', () => {
      const i = +circle.dataset.prayer;
      const type = circle.dataset.type;
      prayerState[i][type] = !prayerState[i][type];
      saveState('prayerState', prayerState);
      renderPrayers();
    });
  });

  updatePrayerPct();
  renderNotifRows();
}

function updatePrayerPct() {
  const total = prayers.length * 2;
  const done = prayerState.reduce(
    (sum, p) => sum + (p.fard ? 1 : 0) + (p.sunnah ? 1 : 0), 0
  );
  const pct = Math.round((done / total) * 100);
  document.getElementById('prayerPct').textContent = `${pct}%`;
}

/* ===========================
   NOTIFICATIONS MODULE
=========================== */
let notifSettings = loadState(
  'notifSettings',
  prayers.map(() => ({ enabled: false, before: '10' }))
);

function renderNotifRows() {
  const container = document.getElementById('notifRows');
  container.innerHTML = '';

  prayers.forEach((prayer, i) => {
    const setting = notifSettings[i];
    container.innerHTML += `
      <div class="notif-row">
        <label class="toggle" style="width:36px;height:20px;">
          <input type="checkbox" class="notif-toggle" data-idx="${i}" ${setting.enabled ? 'checked' : ''}>
          <span class="slider" style="border-radius:20px;"></span>
        </label>
        <span>${prayer.name}</span>
        <select class="notif-before" data-idx="${i}">
          <option value="10" ${setting.before === '10' ? 'selected' : ''}>10 min before</option>
          <option value="15" ${setting.before === '15' ? 'selected' : ''}>15 min before</option>
          <option value="30" ${setting.before === '30' ? 'selected' : ''}>30 min before</option>
        </select>
      </div>`;
  });

  document.querySelectorAll('.notif-toggle').forEach(toggle => {
    toggle.addEventListener('change', () => {
      notifSettings[+toggle.dataset.idx].enabled = toggle.checked;
      saveState('notifSettings', notifSettings);
      if (toggle.checked) requestNotifPermission();
    });
  });

  document.querySelectorAll('.notif-before').forEach(select => {
    select.addEventListener('change', () => {
      notifSettings[+select.dataset.idx].before = select.value;
      saveState('notifSettings', notifSettings);
    });
  });
}

function requestNotifPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function initAdjustBtn() {
  document.getElementById('adjustBtn').addEventListener('click', () => {
    document.getElementById('notifPanel').classList.toggle('open');
  });
}

/* ===========================
   TASKS MODULE
=========================== */
let tasks = loadState('tasks', []);

function renderTasks() {
  const list = document.getElementById('taskList');
  const successEl = document.getElementById('tasksSuccess');
  const progressFill = document.getElementById('taskProgressFill');
  const progressLabel = document.getElementById('taskProgressLabel');

  // Empty state
  if (tasks.length === 0) {
    list.innerHTML = '';
    successEl.classList.remove('visible');
    progressFill.style.width = '0%';
    progressLabel.textContent = '0/0 Tasks Completed';
    return;
  }

  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  progressFill.style.width = pct + '%';
  progressLabel.textContent = `${completed}/${total} Tasks Completed`;

  // All done → show success screen
  if (completed === total && total > 0) {
    list.innerHTML = '';
    successEl.classList.add('visible');
    return;
  }

  successEl.classList.remove('visible');

  list.innerHTML = tasks.map((task, i) => `
    <div class="task-item ${task.done ? 'completed' : ''}">
      <div class="task-checkbox ${task.done ? 'checked' : ''}" data-idx="${i}">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="task-content">
        <div class="task-category">${task.category}</div>
        <div class="task-title">${task.name}</div>
      </div>
      <button class="task-menu-btn" data-del="${i}" title="Delete">⋮</button>
    </div>
  `).join('');

  // Checkbox toggle
  document.querySelectorAll('.task-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      const i = +cb.dataset.idx;
      tasks[i].done = !tasks[i].done;
      saveState('tasks', tasks);
      renderTasks();
    });
  });

  // Delete button
  document.querySelectorAll('.task-menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.del;
      if (confirm('Delete this task?')) {
        tasks.splice(i, 1);
        saveState('tasks', tasks);
        renderTasks();
      }
    });
  });

  // Schedule browser reminders
  tasks.forEach((task, i) => {
    if (task.reminder && !task.done && !task._notified) {
      const reminderTime = new Date(task.reminder).getTime();
      const now = Date.now();
      if (reminderTime > now) {
        setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Task Reminder: ${task.name}`, {
              body: `Category: ${task.category}`
            });
          }
          tasks[i]._notified = true;
        }, reminderTime - now);
      }
    }
  });
}

/* ===========================
   MODAL MODULE
=========================== */
function initModal() {
  const modal = document.getElementById('modalOverlay');

  document.getElementById('addTaskBtn').addEventListener('click', () => {
    modal.classList.add('open');
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    modal.classList.remove('open');
  });

  // Close on backdrop click
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('open');
  });

  document.getElementById('modalAddBtn').addEventListener('click', () => {
    const name = document.getElementById('taskNameInput').value.trim();
    if (!name) {
      alert('Please enter a task name.');
      return;
    }

    const category = document.getElementById('taskCategoryInput').value;
    const reminder = document.getElementById('taskReminderInput').value;

    tasks.push({ name, category, reminder, done: false });
    saveState('tasks', tasks);
    renderTasks();

    // Reset fields
    document.getElementById('taskNameInput').value = '';
    document.getElementById('taskReminderInput').value = '';
    modal.classList.remove('open');

    // Ask for notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  });
}

/* ===========================
   INIT — Run on DOM ready
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  setPrayerDate();
  initAdhkar();
  renderPrayers();
  initAdjustBtn();
  initModal();
  renderTasks();
});