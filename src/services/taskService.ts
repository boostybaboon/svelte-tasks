import type { Task } from '../components/types';

const endpoint = '/data-api/graphql';

async function fetchGraphQL(query: string, variables: any) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors.map((error: any) => error.message).join(', '));
  }
  return result.data;
}

const GET_USER_TASK_LIST_IDS = `
  query getFiltered($f: TaskListFilterInput!){
    taskLists(filter: $f, first: 1) {
      items {
        id
        userId
      }
    }
  }  
`;

const GET_TASKS = `
  query getTasksForTaskListId($g: TaskFilterInput!) {
    tasks(filter: $g) {
      items {
        id
        title
        done
      }
    }
  }
`;

const CREATE_TASK_LIST_FOR_USER = `
  mutation addTaskList($taskListToAdd: CreateTaskListInput!) {
    createTaskList(item: $taskListToAdd) {
      id
      userId
    }
  }
`;

export async function getTaskListId(userId: string): Promise<string> {
  var taskListData = await fetchGraphQL(
    GET_USER_TASK_LIST_IDS, { "f": { "userId": {"eq": userId} }, });
  console.log("Try get existing task list data for user: ", taskListData);
  var firstTaskList = "";
  if (taskListData.taskLists.items.length === 0) {
    taskListData = await fetchGraphQL(
      CREATE_TASK_LIST_FOR_USER, { "taskListToAdd": { "id": crypto.randomUUID(), "userId": userId } });
      console.log("New task list data for user: ", taskListData);
      firstTaskList = taskListData.createTaskList.id;
  }
  else {
    firstTaskList = taskListData.taskLists.items[0].id;
  }
  console.log(firstTaskList);
  return firstTaskList;
}

export async function getTaskList(taskListId: string): Promise<Task[]> {
  const tasksData = await fetchGraphQL(
    GET_TASKS, { "g": { "taskListId": { "eq": taskListId} }, });
  console.log(tasksData);
  return tasksData.tasks.items;
}

const ADD_TASK = `
  mutation addTask($taskToAdd: CreateTaskInput!) {
    createTask(item: $taskToAdd) {
      id
      title
      done
    }
  }
`;

export async function addTask(newTask: Task, taskListId: string): Promise<Task> {
  const data = await fetchGraphQL(ADD_TASK, { "taskToAdd": {...newTask, taskListId} });
  console.log("added a task in taskService", data);
  return data.createTask;
}

const UPDATE_TASK = `
  mutation update($taskId: ID!, $_partitionKeyValue: String!, $item: UpdateTaskInput!) {
    updateTask(id: $taskId, _partitionKeyValue: $_partitionKeyValue, item: $item) {
      id
      title
      done
    }
  }
`;

export async function updateTask(task: Task, taskListId: string): Promise<Task> {
  const data = await fetchGraphQL(UPDATE_TASK, 
    { "taskId": task.id,
      "_partitionKeyValue": task.id,
      "item": {...task, "taskListId": taskListId} });
  return data.updateTask;
}

const REMOVE_TASK = `
  mutation del($id: ID!, $_partitionKeyValue: String!) {
    deleteTask(id: $id, _partitionKeyValue: $_partitionKeyValue) {
      id
    }
  }
`;

export async function removeTask(taskId: string): Promise<{ id: string }> {
  const data = await fetchGraphQL(REMOVE_TASK, 
    { "id": taskId,
      "_partitionKeyValue": taskId });
  return data.deleteTask;
}

const SET_TASK_TITLE = `
  mutation SetTaskTitle($userId: String!, $taskListId: String!, $taskId: ID!, $title: String!) {
    updateTask(id: $taskId, data: { title: $title }) {
      id
      title
      done
    }
  }
`;

export async function setTaskTitle(userId: string, taskListId: string, taskId: string, title: string): Promise<Task> {
  const data = await fetchGraphQL(SET_TASK_TITLE, { userId, taskListId, taskId, title });
  return data.updateTask;
}

