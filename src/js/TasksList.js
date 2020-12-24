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
    this.tasksPinnedArray = new Set();
  }

  init() {
    this.addList();
    this.loadTasksList();
    this.addTask();
    this.writeTask();
    this.deleteTask();
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
      this.tasksArray.add(this.getTaskValue());
    }

    this.showTask();
  }

  showTask() {
    if (!this.tasksArray.size) {
      this.taskContainer.textContent = 'No tasks found';
    } else {
      this.tasksArray.forEach((e) => {
        this.taskContainer.appendChild(this.task.getTask(e).node);
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

  deleteTask() {
    const container = document.querySelector('.container');
    container.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('task-delete')) {
        const task = e.target.closest('.task');
        this.tasksArray.delete(task.querySelector('.task-name').textContent);
        // this.taskContainer.removeChild(task);
        // this.saveTasksList();
        this.addTask();
      }
    });
  }

  checkFieldValue() {
    if (this.getTaskValue()) {
      this.addTask();
      this.cleanTaskValue();
    } else {
      document.querySelector('.hint').classList.add('hint-active');
      setTimeout(() => {
        document.querySelector('.hint').classList.remove('hint-active');
      }, 2000);
    }
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
    this.storage.setItem('tasksList', JSON.stringify([...this.tasksArray]));
  }

  loadTasksList() {
    if (this.storage.getItem('tasksList')) {
      this.tasksArray = new Set(JSON.parse(this.storage.getItem('tasksList')));
    }
  }
}
