/**
 * @class Task
 *
 * задача с базовой разметкой
 */
export default class Task {
  constructor() {
    this.task = {};
  }

  /**
   * @return this.task
   */
  getTask(name) {
    this.createTask(name);

    return this.task;
  }

  /**
   * Создает задачу с базовой разметкой
   *
   * @param {string} name - name of the task
   *
   * Записывает задачу в this.task
   */
  createTask(name) {
    const task = document.createElement('article');
    task.classList.add('task');
    task.innerHTML = Task.addMarkUpTask(name);

    this.task.node = task;
  }

  /**
   * @return базовую разметку задачи
   */
  static addMarkUpTask(name) {
    return `
    <div class="task-name">${name}</div>
    <div class="controls">
      <input type="checkbox" class="task-switch" />
      <button class="task-delete">delete</button>
    </div>
    `;
  }
}
