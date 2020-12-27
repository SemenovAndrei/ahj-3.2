/**
 * @class Task
 *
 * задача с базовой разметкой
 */
export default class Task {
  constructor() {
    this.pinned = false;
  }

  /**
   * Возвращает задачу с базовой разметкой
   *
   * @param {string} name - name of the task
   *
   * @return
   */
  getTask(name) {
    return {
      name,
      node: Task.createTask(name),
      pinned: this.pinned,
    };
  }

  /**
   * Создает задачу с базовой разметкой
   *
   * @param {string} name - name of the task
   *
   * Записывает задачу в this.task
   */
  static createTask(name) {
    const task = document.createElement('article');
    task.classList.add('task');
    task.innerHTML = Task.addMarkUpTask(name);

    return task;
  }

  /**
   * @return базовую разметку задачи
   */
  static addMarkUpTask(name) {
    return `
    <div class="task-name">${name}</div>
    <div class="controls">
    <label class="task-switch-label">
      <input type="checkbox" class="task-switch" />
      <div class="mark"></div>
    </label>
      <button class="task-delete">❌</button>
    </div>
    `;
  }
}
