import List from '../List';

const list = new List();

test('create List', () => {
  const obj = list.getList();
  expect(obj.classList.contains('container')).toBeTruthy();
});
