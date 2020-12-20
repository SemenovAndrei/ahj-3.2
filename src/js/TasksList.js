/* eslint-disable consistent-return */

/**
 * @class TasksList
 */
export default class TasksList {
  /**
   *
   * @param {Class} list - список с базовой разметкой
   * @param {Class} task - контейнер с разметкой задачи
   */
  constructor(list, task) {
    this.list = list;
    this.task = task;
    this.storage = localStorage;
    this.taskContainer = null;
    this.tasksArray = new Set();
    this.tasksPinnedArray = [1, 2, 3];
  }

  init() {
    this.addList();
    this.loadTasksList();
    this.addTask();
    this.writeTask();
  }

  addList() {
    const body = document.getElementsByTagName('body');
    body[0].insertBefore(this.list.getList(), body[0].firstChild);

    this.taskField = document.querySelector('.task-field');
  }

  cleanTasksList() {
    this.taskContainer.innerHTML = '';
  }

  addTask() {
    this.taskContainer = document.querySelector('.tasks-container');
    this.cleanTasksList();

    if (this.getTaskValue()) {
      console.log(this.tasksArray);
      this.tasksArray.add(this.getTaskValue());
    }

    if (!this.tasksArray.size) {
      this.taskContainer.textContent = 'No tasks found';
    } else {
      this.tasksArray.forEach((e) => {
        console.log(this.tasksArray);
        this.taskContainer.appendChild(this.task.getTask(e).node);
      });

      this.saveTasksList();
    }
  }

  writeTask() {
    this.taskField.addEventListener('keydown', (e) => {
      this.storage.setItem('taskField', e.target.value);

      if (e.key === 'Enter') {
        this.addTask();
        this.cleanTaskValue();
      }
    });
  }

  getTaskValue() {
    if (this.storage.getItem('taskField')) {
      return this.storage.getItem('taskField');
    }
  }

  cleanTaskValue() {
    this.taskField.value = '';
    this.storage.removeItem('taskField');
  }

  saveTasksList() {
    this.storage.setItem('tasksList', JSON.stringify(this.tasksArray));
  }

  loadTasksList() {
    if (this.storage.getItem('tasksList')) {
      this.tasksArray = JSON.parse(this.storage.getItem('tasksList'));
    }
  }
}
