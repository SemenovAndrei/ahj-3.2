import List from './List';
import Task from './Task';
import TasksList from './TasksList';

const list = new List();

const task = new Task();

const tasksList = new TasksList(list, task);
tasksList.init();
