import { callApi, Methods } from '../utils/ApiUtils';
import {
  REQUEST_FETCH_TASKS,
  RECEIVE_FETCH_TASKS,
  ERROR_FETCH_TASKS,
  ADD_TASK_LOCAL,
  REMOVE_TASK_LOCAL,
  UPDATE_TASK_LOCAL,
} from '../constants/actionTypes';
import { queryItemsLimit } from '../constants/config';
import { showMessageError } from './messageActions';

const requestFetchTasks = (limit, skip) => (
  {
    type: REQUEST_FETCH_TASKS,
    limit,
    skip,
  }
);

const receiveFetchTasks = tasks => (
  {
    type: RECEIVE_FETCH_TASKS,
    tasks,
  }
);

const errorFetchTasks = error => (
  {
    type: ERROR_FETCH_TASKS,
    error,
  }
);

const addTaskLocal = task => (
  {
    type: ADD_TASK_LOCAL,
    task,
  }
);

const removeTaskLocal = taskIndex => (
  {
    type: REMOVE_TASK_LOCAL,
    taskIndex,
  }
);

const updateTaskLocal = task => (
  {
    type: UPDATE_TASK_LOCAL,
    task,
  }
);

export const fetchTasksByCategory = (
  categoriesId = [],
  completed = false,
  limit = queryItemsLimit,
  skip = 0,
) => (dispatch) => {
  dispatch(requestFetchTasks(limit, skip));
  const request = callApi('tasks', {
    categoriesId, completed, limit, skip,
  }, Methods.GET);
  return request.then(
    (response) => {
      if (response.success) {
        const todos = response.data.map(todo =>
          ({
            ...todo,
            completedAt: (todo.completedAt) ? new Date(todo.completedAt) : undefined,
            todoWithin: (todo.todoWithin) ? new Date(todo.todoWithin) : undefined,
          }));
        dispatch(receiveFetchTasks(todos));
      } else {
        dispatch(errorFetchTasks(response.messageError));
      }
    },
    error => ({ error }),
  );
};

export const deleteTask = (id = '') => (dispatch, getState) => {
  const request = callApi('tasks', id, Methods.DELETE);
  return request.then(
    (response) => {
      if (response.success) {
        const { items } = getState().todoArguments;
        const todoArgumentIndex = items.findIndex(todoArgument =>
          todoArgument.id === id);
        dispatch(removeTaskLocal(todoArgumentIndex));
      } else {
        dispatch(showMessageError(response.messageError));
      }
    },
    error => ({ error }),
  );
};

export const addTask = (title = '', description = '', category = { id: '' }, todoWithin, callback = undefined) => (dispatch) => {
  const request = callApi(
    'tasks',
    {
      title,
      description,
      categoryId: category.id,
      todoWithin,
    },
    Methods.POST,
  );
  return request.then(
    (response) => {
      if (response.success) {
        const todo = {
          ...response.data,
          completedAt: (response.data.completedAt)
            ? new Date(response.data.completedAt) : undefined,
          todoWithin: (response.data.todoWithin)
            ? new Date(response.data.todoWithin) : undefined,
        };
        dispatch(addTaskLocal(todo));
        if (callback !== undefined) {
          callback();
        }
      } else {
        dispatch(showMessageError(response.messageError));
      }
    },
    error => ({ error }),
  );
};

export const toogleTaskCompleted = (id = '', isCompleted = false) => (dispatch) => {
  const completed = !isCompleted;
  const completedAt = (completed) ? new Date() : null;
  const request = callApi('tasks', { id, completed, completedAt }, Methods.PATCH);
  return request.then(
    (response) => {
      if (response.success) {
        const todo = {
          ...response.data,
          completedAt: (response.data.completedAt)
            ? new Date(response.data.completedAt) : undefined,
        };
        dispatch(updateTaskLocal(todo));
      } else {
        dispatch(showMessageError(response.messageError));
      }
    },
    error => ({ error }),
  );
};
