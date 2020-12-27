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

  /**
   * первоначальная инициация
   */
  init() {
    this.addList();
    this.loadTasksList();
    this.addListener();
    this.addTask();
    this.writeTask();
    this.filterTasks();
  }

  /**
   * Добавляет на страницу
   * список с базовой разметкой
   *
   * Закрепляет элементы
   */
  addList() {
    const body = document.getElementsByTagName('body');
    body[0].insertBefore(this.list.getList(), body[0].firstChild);

    this.taskField = document.querySelector('.task-field');
    this.taskContainer = document.querySelector('.tasks-container');
    this.taskPinnedContainer = document.querySelector('.pinned-tasks-container');
  }

  /**
   * Очищает списки задач
   */
  cleanTasksList() {
    this.taskContainer.innerHTML = '';
    this.taskPinnedContainer.innerHTML = '';
  }

  /**
   * Добавляет listeners
   */
  addListener() {
    const container = document.querySelector('.container');
    container.addEventListener('click', this.deleteFunc);
    container.addEventListener('click', this.pinnedFunc);
  }

  /**
   * Добавляет задачу в список задач
   */
  addTask() {
    this.cleanTasksList();

    if (this.getTaskValue()) {
      this.checkNameTask(this.getTaskValue());
    }

    this.showTask();
    this.saveTasksList();
  }

  /**
   * Проверяет имя задачи на уникальность
   *
   * @param {String} name - name of the task
   */
  checkNameTask(name) {
    const array = this.tasksArray.filter((e) => e.name.toLowerCase() === name.toLowerCase());
    if (!array.length) {
      this.tasksArray.push(this.task.getTask(this.getTaskValue()));
    } else {
      TasksList.showHint('Задача уже существует');
    }
  }

  /**
   * Показывает на странице списки с задачами
   *
   * @param {Array} arr - массив задач
   */
  showTask(arr = this.tasksArray) {
    const tasks = arr.filter((e) => e.pinned === false);
    const tasksPinned = arr.filter((e) => e.pinned === true);

    if (!tasks.length) {
      this.taskContainer.textContent = 'No tasks found';
    } else {
      this.taskContainer.textContent = '';

      tasks.forEach((e) => {
        this.taskContainer.appendChild(e.node);
      });
    }

    if (!tasksPinned.length) {
      this.taskPinnedContainer.textContent = 'No pinned tasks';
    } else {
      this.taskPinnedContainer.textContent = '';
      tasksPinned.forEach((e) => {
        this.taskPinnedContainer.appendChild(e.node);
        const buttons = this.taskPinnedContainer.querySelectorAll('.task-switch');
        buttons.forEach((el) => {
          el.checked = true;
        });
      });
    }
  }

  /**
   * Фильтрует задачи по введенному значению
   */
  filterTasks() {
    this.taskField.addEventListener('input', (e) => {
      this.showFilteredTasks(e.target.value);
    });
  }

  /**
   * Показывает элементы списка задач
   * которые начинаются со значения
   *
   * @param {String} value - введенное значение
   */
  showFilteredTasks(value) {
    const str = value.replace(/^\s+|\s+$/g, '').toLowerCase();
    const testString = new RegExp(`^${str}`);
    if (testString) {
      const noPinnedTasks = this.tasksArray.filter((el) => el.pinned === false);
      const pinnedTasks = this.tasksArray.filter((el) => el.pinned === true);
      const filteredTasks = noPinnedTasks
        .filter((el) => testString.test(el.name.toLowerCase()));
      const result = [...filteredTasks, ...pinnedTasks];

      this.showTask(result);
    }
  }

  /**
   * Записывает задачу в массив задач
   */
  writeTask() {
    this.taskField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.storage.setItem('taskField', e.target.value.replace(/^\s+|\s+$/g, ''));

        this.checkFieldValue();
      }
    });
  }

  /**
   * Удаляет задачу
   *
   * @param {event} e - event
   */
  deleteTask(e) {
    if (e.target.classList.contains('task-delete')) {
      e.preventDefault();
      const task = e.target.closest('.task');
      const name = task.querySelector('.task-name').textContent;
      this.tasksArray = this.tasksArray.filter((el) => el.name !== name);

      this.addTask();
    }
  }

  /**
   * Закрепляет \ открепляет задачу
   *
   * @param {event} e - event
   */
  pinnedTask(e) {
    if (e.target.classList.contains('task-switch')) {
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
      this.saveTasksList();
      this.showFilteredTasks(this.taskField.value);
    }
  }

  /**
   * Проверяет поле ввода на заполненность
   */
  checkFieldValue() {
    if (!this.getTaskValue()) {
      TasksList.showHint('Напишите задачу');
    } else {
      this.addTask();
      this.cleanTaskValue();
    }
  }

  /**
   * Показывает переданное сообщение
   *
   * @param {string} message - сообщение
   */
  static showHint(message) {
    const hint = document.querySelector('.hint');
    hint.textContent = message;
    setTimeout(() => {
      hint.textContent = '';
    }, 2000);
  }

  /**
   * Возвращает значение из localStorage
   */
  getTaskValue() {
    if (this.storage.getItem('taskField')) {
      return this.storage.getItem('taskField');
    }
  }

  /**
   * Очищает записанное в localStorage значение
   */
  cleanTaskValue() {
    this.taskField.value = '';
    this.storage.removeItem('taskField');
  }

  /**
   * Сохраняет массив задач в localStorage
   */
  saveTasksList() {
    this.storage.setItem('tasksList', JSON.stringify(this.tasksArray));
  }

  /**
   * Загружает массив задач из localStorage
   */
  loadTasksList() {
    if (this.storage.getItem('tasksList')) {
      this.tasksArray = JSON.parse(this.storage.getItem('tasksList'));
      this.tasksArray.forEach((e) => {
        e.node = this.task.getTask(e.name).node;
      });
    }
  }
}
