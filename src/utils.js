export const init = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };
  
  export const saveSet = (setter, name, value) => {
    function newSetter(item) {
      setter(item);
      localStorage.setItem(name, JSON.stringify(item));
    }
    newSetter(value);
  };
  