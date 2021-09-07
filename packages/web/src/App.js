import * as React from "react";

import { getEmbeddedUrl } from "./common";

export const App = () => {
  const [load, setLoad] = React.useState(true);

  React.useEffect(() => {
    getEmbeddedUrl(setLoad);
  }, []);

  return (
    <>
      <h1>Quicksight React App Demo</h1>
      {load && <p>Please wait loading quick sight dashboard ....</p>}
      <div id="quick-sight-dashboard-container"></div>
    </>
  );
};
