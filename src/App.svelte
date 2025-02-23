<script lang="ts">
  import TasksForm from "./components/tasks-form.svelte";
  import TasksList from "./components/tasks-list.svelte";
  import type { Task, Filter } from "./components/types";
  import { getTaskListId, getTaskList, addTask, updateTask, removeTask } from "./services/taskService";
  import { onMount } from "svelte";

  let message = "Tasks App";
  let currentFilter = $state<Filter>("all");
  let tasks = $state<Task[]>([]);
  let userId = "user-1"; // Replace with actual user ID, when authentication is implemented
  let taskListId = ""; 

  let totalDone = $derived(
    tasks.reduce((total, task) => total + Number(task.done), 0),
  );

  let filteredTasks = $derived.by(() => {
    switch (currentFilter) {
      case "all": {
        return tasks;
      }
      case "todo": {
        return tasks.filter((t) => !t.done);
      }
      case "done": {
        return tasks.filter((t) => t.done);
      }
    }
    return tasks;
  });

  // use a $effect without dependencies instead?
  onMount(async () => {
    taskListId = await getTaskListId(userId);
    tasks = await getTaskList(taskListId);
  });

  async function handleAddTask(newTaskTitle: string) {
    const newTask: Task = { id: crypto.randomUUID(), title: newTaskTitle, done: false };
    const addedTask = await addTask(newTask, taskListId);
    console.log("added a task in App.svelte", addedTask);
    tasks = [...tasks, addedTask];
  }

  async function handleToggleDone(task: Task) {
    task.done = !task.done;
    const toggledTask = await updateTask(task, taskListId);
    console.log(toggledTask);
    tasks = tasks.map((t) => (t.id === task.id ? { ...t, done: toggledTask.done } : t));
  }

  async function handleRemoveTask(id: string) {
    const removedTask = await removeTask(id);
    console.log(removedTask);
    tasks = tasks.filter((t) => t.id !== id);
  }
</script>

{#snippet filterButton(filter: Filter)}
  <button
    onclick={() => (currentFilter = filter)}
    class:contrast={currentFilter === filter}
    class="secondary filterButton">{filter}</button
  >
{/snippet}

<main>
  <h1>{message}</h1>
  <TasksForm addTask={handleAddTask} />
  <p>
    {#if tasks.length}
      {totalDone} / {tasks.length} tasks completed
    {:else}
      Add a task to get started!
    {/if}
  </p>
  {#if tasks.length}
    <div class="button-container">
      {@render filterButton("all")}
      {@render filterButton("todo")}
      {@render filterButton("done")}
    </div>
  {/if}
  <TasksList tasks={filteredTasks} toggleDone={handleToggleDone} removeTask={handleRemoveTask} />
</main>

<style>
  main {
    margin: 1rem auto;
    max-width: 800px;
  }
  .button-container {
    display: flex;
    justify-content: end;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }
  .filterButton {
    text-transform: capitalize;
  }
</style>