import { useSelector } from "react-redux";
import "./App.css";
import Folder from "./components/Folder";
import { selectRootId } from "./Repository/Slices/explorerSlice";

function App() {
  const rootId = useSelector(selectRootId);

  return (
    <div className="App">
      <div className="folderContainerBody">
        <div className="folder-container">
          {rootId ? <Folder nodeId={rootId} /> : null}
        </div>
        <div className="empty-state">Your content will be here</div>
      </div>
    </div>
  );
}

export default App;
