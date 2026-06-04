import axios from 'axios';

const routes = {
  tasksPath: () => '/api/tasks',
};

// BEGIN
export default async () => {
  const state = {
    tasks: [],
  };

  const form = document.querySelector('form');
  const input = document.querySelector('input[name="name"]');
  const tasksList = document.getElementById('tasks');

  const render = () => {
    tasksList.innerHTML = '';

    state.tasks.forEach((task) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.textContent = task.name;

      tasksList.append(li);
    });
  };

  const response = await axios.get(routes.tasksPath());
  state.tasks = response.data.items;
  render();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const task = {
      name: formData.get('name'),
    };

    const response = await axios.post(routes.tasksPath(), task);

    if (response.status === 201) {
      state.tasks.unshift(task);
      render();

      form.reset();
      input.focus();
    }
  });
};
// END