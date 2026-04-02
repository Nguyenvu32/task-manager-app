const localStorageMock = (() => {
  let store = {};
  return {
    getItem:  function(k)     { return store[k] || null; },
    setItem:  function(k, v)  { store[k] = String(v); },
    clear:    function()      { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const { addTask, deleteTask, toggleTask, filterTasks } = require('../src/app.js');

describe('Task Manager Core', function() {
  beforeEach(function() { localStorage.clear(); });

  test('addTask: creates task with correct properties', function() {
    var t = addTask('Hoc Git');
    expect(t.text).toBe('Hoc Git');
    expect(t.completed).toBe(false);
    expect(t.id).toBeDefined();
  });

  test('addTask: returns null for empty string', function() {
    expect(addTask('')).toBeNull();
  });

  test('deleteTask: returns true when task exists', function() {
    var t = addTask('Xoa cai nay');
    expect(deleteTask(t.id)).toBe(true);
  });

  test('deleteTask: returns false when id not found', function() {
    expect(deleteTask('fake-id')).toBe(false);
  });

  test('toggleTask: flips completed status', function() {
    var t = addTask('Chua xong');
    expect(toggleTask(t.id).completed).toBe(true);
  });

  test('filterTasks: returns tasks matching tag', function() {
    addTask('A', ['work']);
    addTask('B', ['personal']);
    addTask('C', ['work']);
    expect(filterTasks('work').length).toBe(2);
  });
});
