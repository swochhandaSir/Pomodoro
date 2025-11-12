import type { JSX } from "react";

import { usePomodoro } from "../features/pomodoro/hooks";

function Controls(): JSX.Element {
  const { start, pause, reset, state } = usePomodoro();

  return (
    <div className="controls">
      <button type="button" onClick={start} disabled={state.isRunning}>
        Start
      </button>
      <button type="button" onClick={pause} disabled={!state.isRunning}>
        Pause
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

export default Controls;
