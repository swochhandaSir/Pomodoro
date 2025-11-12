import type { FormEvent, JSX } from "react";
import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
};

function createTaskId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const STORAGE_KEY = "pomodoro.tasks";

function loadInitialTasks(): Task[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid tasks data");
    }
    const tasks = parsed
      .filter((candidate): candidate is Task => typeof candidate?.id === "string" && typeof candidate?.title === "string")
      .map((candidate) => ({ id: candidate.id, title: candidate.title }));
    return tasks;
  } catch {
    return [];
  }
}

function TaskList(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(loadInitialTasks);
  const [draft, setDraft] = useState<string>("");

  const remainingCount = useMemo(() => tasks.length, [tasks]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
    }
  }, [tasks]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = draft.trim();
    if (!normalized) {
      return;
    }

    setTasks((current) => [
      ...current,
      {
        id: createTaskId(),
        title: normalized,
      },
    ]);
    setDraft("");
  }

  function handleRemove(taskId: string) {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }

  return (
    <section className="task-list">
      <header className="task-list__header">
        <h2>Tasks</h2>
        <span aria-live="polite" className="task-list__count">
          {remainingCount} task{remainingCount === 1 ? "" : "s"}
        </span>
      </header>

      <form className="task-list__form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="task-input">
          Add a task
        </label>
        <input
          id="task-input"
          className="task-list__input"
          placeholder="What would you like to focus on?"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="task-list__submit" disabled={!draft.trim()}>
          Add
        </button>
      </form>

      <ul className="task-list__items">
        {tasks.map((task) => (
          <li key={task.id} className="task-list__item">
            <span className="task-list__title">{task.title}</span>
            <button
              type="button"
              className="task-list__delete"
              onClick={() => handleRemove(task.id)}
            >
              Remove
            </button>
          </li>
        ))}
        {tasks.length === 0 && <li className="task-list__empty">No tasks yet. Start by adding one above.</li>}
      </ul>
    </section>
  );
}

export default TaskList;
