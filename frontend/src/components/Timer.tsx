import type { JSX } from "react";

import { usePomodoro } from "../features/pomodoro/hooks";

function Timer(): JSX.Element {
  const { state } = usePomodoro();

  return (
    <div className="timer">
      <p className="timer__phase">{state.phase.toUpperCase()}</p>
      <p className="timer__value">{state.remainingFormatted}</p>
    </div>
  );
}

export default Timer;
