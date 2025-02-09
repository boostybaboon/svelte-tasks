<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Task } from "../../api/src/types"; // is this ok - getting types from the api?

    let {
        tasks,
        toggleDone,
        removeTask,
    }: {
        tasks: Task[];
        toggleDone: (task: Task) => void;
        removeTask: (id: string) => void;
    } = $props();
</script>

<section>
    {#each tasks as task}
        <article class="task" transition:fade>
            <label>
                <input
                    checked={task.done}
                    onchange={() => toggleDone(task)}
                    type="checkbox"
                />
                <span class:done={task.done}>{task.title}</span>
            </label>
            <button onclick={() => removeTask(task.id)} class="outline"
                >Remove</button
            >
        </article>
    {/each}
</section>

<style>
    .done {
        text-decoration: line-through;
    }

    .task {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
