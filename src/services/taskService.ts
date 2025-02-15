import { GraphQLClient, gql } from 'graphql-request';
import type { Task } from '../components/types';

const client = new GraphQLClient('/data-api/graphql');

const GET_TASK_LIST = gql`
  query GetTaskList($userId: String!, $taskListId: String!) {
    getTaskList(userId: $userId, id: $taskListId) {
      id
      userId
      tasks {
        id
        title
        done
      }
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($userId: String!, $taskListId: String!, $id: String!, $title: String!, $done: Boolean!) {
    addTask(userId: $userId, taskListId: $taskListId, id: $id, title: $title, done: $done) {
      id
      title
      done
    }
  }
`;

const SET_TASK_DONE = gql`
  mutation SetTaskDone($userId: String!, $taskListId: String!, $taskId: String!, $done: Boolean!) {
    setTaskDone(userId: $userId, taskListId: $taskListId, taskId: $taskId, done: $done) {
      id
      title
      done
    }
  }
`;

const REMOVE_TASK = gql`
  mutation RemoveTask($userId: String!, $taskListId: String!, $taskId: String!) {
    removeTask(userId: $userId, taskListId: $taskListId, taskId: $taskId) {
      id
    }
  }
`;

const SET_TASK_TITLE = gql`
  mutation SetTaskTitle($userId: String!, $taskListId: String!, $taskId: String!, $title: String!) {
    setTaskTitle(userId: $userId, taskListId: $taskListId, taskId: $taskId, title: $title) {
      id
      title
      done
    }
  }
`;

export async function getTaskList1(userId: string, taskListId: string): Promise<Task[]> {
  const { getTaskList } = await client.request<{ getTaskList: { tasks: Task[] } }>(GET_TASK_LIST, { userId, taskListId });
  return getTaskList.tasks;
}

export async function addTask1(userId: string, taskListId: string, newTask: Task): Promise<Task> {
  const { addTask } = await client.request<{ addTask: Task }>(ADD_TASK, { userId, taskListId, ...newTask });
  return addTask;
}

export async function setTaskDone1(userId: string, taskListId: string, taskId: string, done: boolean): Promise<Task> {
  const { setTaskDone } = await client.request<{ setTaskDone: Task }>(SET_TASK_DONE, { userId, taskListId, taskId, done });
  return setTaskDone;
}

export async function removeTask1(userId: string, taskListId: string, taskId: string): Promise<{ id: string }> {
  const { removeTask } = await client.request<{ removeTask: { id: string } }>(REMOVE_TASK, { userId, taskListId, taskId });
  return removeTask;
}

export async function setTaskTitle1(userId: string, taskListId: string, taskId: string, title: string): Promise<Task> {
  const { setTaskTitle } = await client.request<{ setTaskTitle: Task }>(SET_TASK_TITLE, { userId, taskListId, taskId, title });
  return setTaskTitle;
}