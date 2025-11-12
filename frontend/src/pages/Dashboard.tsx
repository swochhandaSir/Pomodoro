import type { JSX } from "react";

import Controls from "../components/Controls";
import TaskList from "../components/TaskList";
import Timer from "../components/Timer";

function Dashboard(): JSX.Element {
  return (
    <main className="dashboard">
      <section className="dashboard__timer">
        <h1>Pomodoro Dashboard</h1>
        <Timer />
        <Controls />
      </section>
      <aside className="dashboard__tasks">
        <TaskList />
      </aside>
    </main>
  );
}

export default Dashboard;
