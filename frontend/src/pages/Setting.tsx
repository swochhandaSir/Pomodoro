import type { JSX } from "react";

function Setting(): JSX.Element {
  return (
    <section className="settings">
      <h1>Timer Settings</h1>
      <p>Adjust focus, short break, and long break durations here.</p>
      <p className="settings__hint">This page is a placeholder for future configuration UI.</p>
    </section>
  );
}

export default Setting;
