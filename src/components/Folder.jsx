import { useState, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  VscChevronRight,
  VscChevronDown,
  VscFolder,
  VscFile,
  VscNewFolder,
  VscNewFile,
  VscEdit,
  VscTrash,
} from "react-icons/vsc";
import {
  insertNode,
  deleteNode,
  renameNode,
  selectNodeById,
} from "../Repository/Slices/explorerSlice";

const Folder = ({ nodeId }) => {
  const dispatch = useDispatch();
  const explorerData = useSelector((s) => selectNodeById(s, nodeId));
  const [nodeName, setNodeName] = useState(explorerData?.name ?? "");
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: null,
  });
  const [updateInput, setUpdateInput] = useState({
    visible: false,
    isFolder: null,
  });

  if (!explorerData) return null;

  const handleNewFolderButton = useCallback((e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  }, []);

  const handleUpdateFolderButton = useCallback((e, isFolder, nodeValue) => {
    setNodeName(nodeValue);
    e.stopPropagation();
    setUpdateInput({
      visible: true,
      isFolder,
    });
  }, []);

  const handleDeleteFolder = useCallback((e) => {
    e.stopPropagation();
    dispatch(deleteNode({ id: explorerData.id }));
  }, [dispatch, explorerData?.id]);
  const onAdd = useCallback((e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      dispatch(insertNode(explorerData.id, e.target.value.trim(), !!showInput.isFolder));
      setShowInput({ ...showInput, visible: false });
    }
  }, [dispatch, explorerData?.id, showInput]);
  const onUpdate = useCallback((e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      dispatch(renameNode({ id: explorerData.id, name: e.target.value.trim() }));
      setUpdateInput({ ...updateInput, visible: false });
    }
  }, [dispatch, explorerData?.id, updateInput]);
  const handleChange = (event) => {
    setNodeName(event.target.value);
  };
  if (explorerData.isFolder) {
    return (
      <div>
        <div
          className="folder"
          style={{ cursor: "pointer" }}
          onClick={() => setExpand(!expand)}
        >
          <span>
            {expand ? <VscChevronDown /> : <VscChevronRight />} <VscFolder />
            {updateInput.visible ? (
              <input
                type="text"
                value={nodeName}
                onChange={handleChange}
                autoFocus
                onBlur={() =>
                  setUpdateInput({ ...updateInput, visible: false })
                }
                onKeyDown={onUpdate}
              />
            ) : (
              <label>{explorerData.name}</label>
            )}
          </span>

          <div className="buttons-container">
            <button onClick={(e) => handleDeleteFolder(e, true)}>
              <VscTrash />
            </button>
            <button
              onClick={(e) =>
                handleUpdateFolderButton(e, true, explorerData.name)
              }
            >
              <VscEdit />
            </button>
            <button onClick={(e) => handleNewFolderButton(e, true)}>
              <VscNewFolder />
            </button>
            <button onClick={(e) => handleNewFolderButton(e, false)}>
              <VscNewFile />
            </button>
          </div>
        </div>
        <div
          id="folderContainer"
          style={{ display: expand ? "block" : "none", marginLeft: 20 }}
        >
          {showInput.visible && (
            <div className="addItem">
              <span>{showInput.isFolder ? <VscFolder /> : <VscFile />}</span>
              <input
                type="text"
                autoFocus
                onBlur={() => setShowInput({ ...showInput, visible: false })}
                onKeyDown={onAdd}
              />
            </div>
          )}
          {explorerData.childrenIds.map((childId) => {
            return (
              <Folder key={childId} nodeId={childId} />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="folder">
        <span>
          <VscFile />
          {updateInput.visible ? (
            <input
              type="text"
              value={nodeName}
              onChange={handleChange}
              autoFocus
              onBlur={() => setUpdateInput({ ...updateInput, visible: false })}
              onKeyDown={onUpdate}
            />
          ) : (
            <label>{explorerData.name}</label>
          )}
        </span>
        <div className="buttons-container">
          <button onClick={(e) => handleDeleteFolder(e, false)}>
            <VscTrash />
          </button>
          <button
            onClick={(e) =>
              handleUpdateFolderButton(e, false, explorerData.name)
            }
          >
            <VscEdit />
          </button>
        </div>
      </div>
    );
  }
};

export default memo(Folder);
