import { useState, useEffect, useCallback } from "react";
import "./App.css";
import folderData from "./data/folderData";
import Folder from "./components/Folder";
import useTraverseTree from "./hooks/use-traverse-tree";

function App() {
  const [explorerData, setExplorerData] = useState(() => {
    try {
      const stored = localStorage.getItem("explorerData");
      return stored ? JSON.parse(stored) : folderData;
    } catch {
      return folderData;
    }
  });
  const { insertNode, deleteNode, updateNode } = useTraverseTree();

  useEffect(() => {
    try {
      localStorage.setItem("explorerData", JSON.stringify(explorerData));
    } catch {
      // ignore storage errors
    }
  }, [explorerData]);

  const handleInsertNode = useCallback((folderId, itemName, isFolder) => {
    setExplorerData((prev) => insertNode(prev, folderId, itemName, isFolder));
  }, [insertNode]);

  const handleDeleteNode = useCallback((folderId) => {
    const finalItem = deleteNode(explorerData, folderId);
    setExplorerData(finalItem);
  }, [explorerData, deleteNode]);

  const handleUpdateFolder = useCallback((id, updatedValue, isFolder) => {
    const finalItem = updateNode(explorerData, id, updatedValue, isFolder);
    setExplorerData(finalItem);
  }, [explorerData, updateNode]);

  return (
    <div className="App">
      <div className="folderContainerBody">
        <div className="folder-container">
          <Folder
            handleInsertNode={handleInsertNode}
            handleDeleteNode={handleDeleteNode}
            handleUpdateFolder={handleUpdateFolder}
            explorerData={explorerData}
          />
        </div>
        <div className="empty-state">Your content will be here</div>
      </div>
    </div>
  );
}

export default App;
