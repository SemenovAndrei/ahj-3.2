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
    this.taskPinnedContainer = null;
    this.tasksArray = [];
    this.tasksPinnedArray = [];
    this.deleteFunc = (e) => { this.deleteTask(e); };
    this.pinnedFunc = (e) => { this.pinnedTask(e); };
  }

  init() {
    this.addList();
    this.loadTasksList();
    this.addListener();
    this.addTask();
    this.writeTask();
  }

  addList() {
    const body = document.getElementsByTagName('body');
    body[0].insertBefore(this.list.getList(), body[0].firstChild);

    this.taskField = document.querySelector('.task-field');
    this.taskContainer = document.querySelector('.tasks-container');
    this.taskPinnedContainer = document.querySelector('.pinned-tasks-container');
  }

  cleanTasksList() {
    this.taskContainer.innerHTML = '';
    this.taskPinnedContainer.innerHTML = '';
  }

  addListener() {
    const container = document.querySelector('.container');
    container.addEventListener('click', this.deleteFunc);
    container.addEventListener('click', this.pinnedFunc);
  }

  addTask() {
    this.cleanTasksList();

    if (this.getTaskValue()) {
      this.checkTitleTask(this.getTaskValue());
    }

    this.showTask();
  }

  checkTitleTask(name) {
    const array = this.tasksArray.filter((e) => e.name === name);
    if (!array.length) {
      this.tasksArray.push(this.task.getTask(this.getTaskValue()));
    } else {
      TasksList.showHint('Задача уже существует');
    }
  }

  showTask() {
    const tasks = this.tasksArray.filter((e) => e.pinned === false);
    const tasksPinned = this.tasksArray.filter((e) => e.pinned === true);

    if (!tasks.length) {
      this.taskContainer.textContent = 'No tasks found';
    } else {
      tasks.forEach((e) => {
        this.taskContainer.appendChild(e.node);
      });
    }

    if (!tasksPinned.length) {
      this.taskPinnedContainer.textContent = 'No pinned tasks';
    } else {
      tasksPinned.forEach((e) => {
        this.taskPinnedContainer.appendChild(e.node);
        const buttons = this.taskPinnedContainer.querySelectorAll('.task-switch');
        buttons.forEach((el) => {
          el.checked = true;
        });
      });
    }

    this.saveTasksList();
  }

  writeTask() {
    this.taskField.addEventListener('keydown', (e) => {
      this.storage.setItem('taskField', e.target.value);

      if (e.key === 'Enter') {
        this.checkFieldValue();
      }
    });
  }

  deleteTask(e) {
    if (e.target.classList.contains('task-delete')) {
      e.preventDefault();
      const task = e.target.closest('.task');
      const name = task.querySelector('.task-name').textContent;
      this.tasksArray = this.tasksArray.filter((el) => el.name !== name);

      this.addTask();
    }
  }

  pinnedTask(e) {
    if (e.target.classList.contains('task-switch')) {
      // e.preventDefault();
      const task = e.target.closest('.task');
      this.tasksArray.forEach((el) => {
        if (el.name === task.querySelector('.task-name').textContent) {
          if (e.target.checked) {
            el.pinned = true;
          } else {
            el.pinned = false;
          }
        }
      });

      this.addTask();
    }
  }

  checkFieldValue() {
    if (this.getTaskValue()) {
      this.addTask();
      this.cleanTaskValue();
    } else {
      TasksList.showHint('Напишите задачу');
    }
  }

  static showHint(message) {
    const hint = document.querySelector('.hint');
    hint.textContent = message;
    setTimeout(() => {
      hint.textContent = '';
    }, 2000);
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
      this.tasksArray.forEach((e) => {
        e.node = this.task.getTask(e.name).node;
      });
    }
    console.log(this.tasksArray);
  }
}
