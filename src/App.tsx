import { Display } from "@/components/Display";
import { css } from "@emotion/react";

const styles = {
  app: css({
    width: "100%",
    backgroundColor: "#000",
  }),
};

function App() {
  return (
    <div css={styles.app}>
      <Display />
    </div>
  );
}

export default App;
