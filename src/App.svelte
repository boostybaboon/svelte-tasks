<script lang="ts">
  import TasksForm from "./components/tasks-form.svelte";
  import TasksList from "./components/tasks-list.svelte";
  import type { Task } from "./components/types";

  let message = "Tasks App";
  let tasks = $state<Task[]>([]);
  let totalDone = $derived(
    tasks.reduce(
      (total, task) => total + Number(task.done),
      0
    )
  );

  function addTask(newTask: string) {
    tasks.push({
      id: crypto.randomUUID(),
      title: newTask,
      done: false,
    });
  }

  function toggleDone(task: Task) {
    task.done = !task.done;
  }

  function removeTask(index: number) {
    tasks.splice(index, 1);
  }
</script>

<main>
  <h1>{message}</h1>
  <TasksForm {addTask} />
  <p>
    {#if tasks.length}
      {totalDone} / {tasks.length} tasks completed
    {:else}
      Add a task to get started!
    {/if}
  </p>
  <TasksList {tasks} {toggleDone} {removeTask} />
</main>

<style>
  main {
    margin: 1rem auto;
    max-width: 800px;
  }
</style>
