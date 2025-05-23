const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
window.addEventListener('load', () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => addTask(task.text, task.completed));
});

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').textContent,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText !== '') {
    addTask(taskText, false);
    input.value = '';
    saveTasks();
  }
});

function addTask(taskText, completed = false) {
  const li = document.createElement('li');

  // Assign random background color for funky look
  const colors = ['#fbd38d', '#f6ad55', '#9f7aea', '#63b3ed', '#68d391'];
  li.style.background = colors[Math.floor(Math.random() * colors.length)];

  // Create checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.classList.add('task-checkbox');

  // Create span for text
  const span = document.createElement('span');
  span.textContent = taskText;

  // Add 'completed' class if already completed
  if (completed) {
    li.classList.add('completed');
  }

  // Checkbox change handler for 3D vanish effect on complete
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      li.classList.add('completed', 'vanishing');
      li.addEventListener('animationend', () => {
        li.classList.remove('vanishing'); // clean up
        saveTasks();
      }, { once: true });
    } else {
      li.classList.remove('completed');
      saveTasks();
    }
  });

  // Delete button with fade out
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      li.remove();
      saveTasks();
    });
  };

  // Append elements
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Dark/light mode toggle (optional, keep if you want mode switching)
const modeSwitch = document.getElementById('mode-switch');
modeSwitch?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    modeSwitch.textContent = '☀️ Light Mode';
  } else {
    modeSwitch.textContent = '🌙 Night Mode';
  }
});
