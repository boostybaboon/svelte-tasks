<script lang="ts">
    import type { Task } from "./types";

    let {
        tasks,
        toggleDone,
    }: {
        tasks: Task[];
        toggleDone: (task: Task) => void;
    } = $props();
</script>

<section>
    {#each tasks as task}
        <article>
            <label>
                <input 
                    checked={task.done}
                    onchange={() => toggleDone(task)}
                    type="checkbox" />
                <span class:done={task.done}>{task.title}</span>    
            </label>
        </article>
    {/each}
</section>

<style>
    .done {
        text-decoration: line-through;
    }
</style>