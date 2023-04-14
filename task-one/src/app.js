import FileTree from './fileTree';

export function createFileTree(input) {
  const fileTree = new FileTree();
  let newInput = input.sort((item1, item2)=>{
    return item1.id - item2.id;
  })

  newInput[0].parentId = 0

  for (const inputNode of input) {
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;

    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}