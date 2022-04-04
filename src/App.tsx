import { css } from "@emotion/react";
import { Display } from "@/components/Display";

const styles = {
  app: css({
    width: "100%",
    backgroundColor: "#000",
  }),
};

const rootElement = document.getElementById("root");

function App() {
  return (
    <div css={styles.app}>
      <Display />
    </div>
  );
}

export default App;
