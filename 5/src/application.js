import uniqueId from 'lodash/uniqueId.js';

// BEGIN
export default () => {
  const generalList = {
    id: uniqueId(),
    name: 'General',
  };

  const state = {
    currentListId: generalList.id,
    lists: [generalList],
    tasks: [],
  };

  const listsContainer = document.querySelector('[data-container="lists"]');
  const tasksContainer = document.querySelector('[data-container="tasks"]');
  const newListForm = document.querySelector('[data-container="new-list-form"]');
  const newTaskForm = document.querySelector('[data-container="new-task-form"]');

  const renderLists = () => {
    listsContainer.innerHTML = '';

    const ul = document.createElement('ul');

    state.lists.forEach((list) => {
      const li = document.createElement('li');

      if (list.id === state.currentListId) {
        const b = document.createElement('b');
        b.textContent = list.name;
        li.append(b);
      } else {
        const link = document.createElement('a');
        link.href = `#${list.name.toLowerCase()}`;
        link.textContent = list.name;

        link.addEventListener('click', (event) => {
          event.preventDefault();
          state.currentListId = list.id;
          render();
        });

        li.append(link);
      }

      ul.append(li);
    });

    listsContainer.append(ul);
  };

  const renderTasks = () => {
    tasksContainer.innerHTML = '';

    const currentTasks = state.tasks.filter((task) => task.listId === state.currentListId);

    if (currentTasks.length === 0) {
      return;
    }

    const ul = document.createElement('ul');

    currentTasks.forEach((task) => {
      const li = document.createElement('li');
      li.textContent = task.name;
      ul.append(li);
    });

    tasksContainer.append(ul);
  };

  const render = () => {
    renderLists();
    renderTasks();
  };

  newListForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get('name');

    const listExists = state.lists.some((list) => list.name === name);

    if (!listExists) {
      state.lists.push({
        id: uniqueId(),
        name,
      });

      render();
    }

    event.target.reset();
  });

  newTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get('name');

    state.tasks.push({
      id: uniqueId(),
      name,
      listId: state.currentListId,
    });

    event.target.reset();
    render();
  });

  render();
};
// END