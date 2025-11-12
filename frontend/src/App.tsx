import type { JSX } from "react";
import { BrowserRouter } from "react-router-dom";

import { PomodoroProvider } from "./features/pomodoro/PomodoroProvider";
import AppRoutes from "./routes";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <PomodoroProvider>
        <AppRoutes />
      </PomodoroProvider>
    </BrowserRouter>
  );
}

export default App;
