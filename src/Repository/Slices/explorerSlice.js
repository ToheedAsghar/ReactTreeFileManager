import { createSlice } from "@reduxjs/toolkit";
import folderData from "../../data/folderData";

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now());

function normalizeTree(node) {
  const byId = {};
  function walk(n) {
    const id = n.id ?? generateId();
    const children = Array.isArray(n.items) ? n.items : [];
    const childIds = children.map((c) => {
      const childId = walk(c);
      return childId;
    });
    byId[id] = {
      id,
      name: n.name,
      isFolder: !!n.isFolder,
      childrenIds: childIds,
    };
    return id;
  }
  const rootId = walk(folderData); // seed from existing data
  return { byId, rootId };
}

const initial = normalizeTree(folderData);

const explorerSlice = createSlice({
  name: "explorer",
  initialState: {
    nodes: { byId: initial.byId },
    rootId: initial.rootId,
  },
  reducers: {
    insertNode: {
      prepare: (parentId, name, isFolder) => ({
        payload: { parentId, name: String(name).trim(), isFolder: !!isFolder },
      }),
      reducer: (state, action) => {
        const { parentId, name, isFolder } = action.payload;
        if (!name) return;
        const parent = state.nodes.byId[parentId];
        if (!parent || !parent.isFolder) return;

        const id = generateId();
        state.nodes.byId[id] = {
          id,
          name,
          isFolder,
          childrenIds: [],
        };
        parent.childrenIds.unshift(id);
      },
    },
    renameNode(state, action) {
      const { id, name } = action.payload;
      const node = state.nodes.byId[id];
      if (node && String(name).trim()) {
        node.name = String(name).trim();
      }
    },
    deleteNode(state, action) {
      const { id } = action.payload;
      if (!state.nodes.byId[id]) return;

      // remove id from any parent list (O(n) but simple)
      Object.values(state.nodes.byId).forEach((n) => {
        if (n.childrenIds?.length) {
          n.childrenIds = n.childrenIds.filter((cid) => cid !== id);
        }
      });

      function removeRecursively(nodeId) {
        const node = state.nodes.byId[nodeId];
        if (!node) return;
        if (node.childrenIds?.length) {
          node.childrenIds.forEach(removeRecursively);
        }
        delete state.nodes.byId[nodeId];
      }
      // if deleting root, just clear everything but keep empty root
      if (id === state.rootId) {
        const root = state.nodes.byId[state.rootId];
        root.childrenIds.forEach(removeRecursively);
        root.childrenIds = [];
        return;
      }
      removeRecursively(id);
    },
  },
});

export const { insertNode, renameNode, deleteNode } = explorerSlice.actions;

export const selectRootId = (state) => state.explorer.rootId;
export const selectNodeById = (state, id) => state.explorer.nodes.byId[id];

export default explorerSlice.reducer;