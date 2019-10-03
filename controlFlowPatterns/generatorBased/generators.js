function* createIterator (values) {
  for (let i = 0; i < values.length; i++) {
    yield values[i];
  }
}

const iterator = createIterator([1, 2, 3]);
let data = iterator.next();
while (!data.done) {
  console.log(data.value);
  data = iterator.next();
}
