/**
 * @class List
 *
 * список с базовой разметкой
 */
export default class List {
  constructor() {
    this.list = null;
  }

  /**
   * @return this.list
   */
  getList() {
    this.createList();

    return this.list;
  }

  /**
   * Создает список с базовой разметкой
   *
   * Записывает список в this.list
   */
  createList() {
    const list = document.createElement('div');
    list.classList.add('container');
    list.innerHTML = List.addMarkUpList();

    this.list = list;
  }

  /**
   * @return базовую разметку списка
   */
  static addMarkUpList() {
    return `
    <section class="main">
      <h1 class="title">TOP Tasks</h1>
      <input class="task-field" type="text" placeholder="write the task here" />
      <div class="hint"></div>
    </section>
    <section class="tasks-pinned">
      <h2 class="title title-pinned">Pinned:</h2>
      <div class="pinned-tasks-container">No pinned tasks</div>
    </section>
    <section class="all-tasks">
      <h2 class="title title-all-tasks">All Tasks:</h2>
      <div class="tasks-container">No tasks found</div>
    </section>
    `;
  }
}
