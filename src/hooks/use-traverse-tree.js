const useTraverseTree = () => {
  function insertNode(tree, folderId, itemName, isFolder) {
    if (tree.id === folderId && tree.isFolder) {
      const newChild = {
        id: Date.now(),
        name: itemName, 
        isFolder, 
        items: []
      };

      return {...tree, items: [newChild, ...(tree.items || [] )]};
    }

    if(!tree.items) return tree;

    return {
      ...tree,
      items: tree.items.map((child) =>
      insertNode(child, folderId, itemName, isFolder)
    )};
  }
  function deleteNode(tree, folderId) {
    // base case: found the node to be deleted

    if (tree.id === folderId) {
      // Node found, return null to remove it from the parent
      return null;
    }

    if (tree.items && tree.items.length > 0) {
      // If the node has children, recursively process them
      tree.items = tree.items.map((child) => deleteNode(child, folderId));
      // Remove null entries (nodes with matching "id") from the array
      tree.items = tree.items.filter(Boolean);
    }

    return { ...tree };
  }
  function updateNode(tree, folderId, itemName, isFolder) {
    if (tree.id === folderId) {
      // Node found, update its properties
      return {
        ...tree,
        name: itemName,
      };
    }

    if (tree.items && tree.items.length > 0) {
      tree.items = tree.items.map((child) =>
        updateNode(child, folderId, itemName)
      );
    }

    return { ...tree };
  }
  return { insertNode, deleteNode, updateNode };
};

export default useTraverseTree;
