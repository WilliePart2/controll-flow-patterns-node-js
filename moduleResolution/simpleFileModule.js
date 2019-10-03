const parentId = module.parent ? module.parent.filename : null;

console.log(`simple file module is loaded by the: ${parentId} module`);
