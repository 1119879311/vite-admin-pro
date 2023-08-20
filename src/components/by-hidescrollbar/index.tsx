import { useCallback, useMemo, useRef } from "react";
import "./index.less";
export interface IAppProps {
  x?: boolean;
  y?: boolean;
}

function App({
  children,
  x = false,
  y = false,
}: React.PropsWithChildren<IAppProps>) {
  let yStyles = useMemo(() => {
    return y ? "0" : "-17px";
  }, [y]);
  return (
    <div className="by-hidescrollbar-warp">
      <div className="by-hidescrollbar-main" style={{ right: yStyles }}>
        {children}
      </div>
    </div>
  );
}

export default App;
