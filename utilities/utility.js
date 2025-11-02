const deleteMeta = (array) => {
    if (array && array.length > 0) {
      array.forEach((item) => {
        if (item.__metadata) {
          delete item.__metadata;
        }
      });
    }
    delete array.__metadata;
    return array;
};

const transform = (data, keys) => {

  const transformObject = (object, keys) => {
    return keys.reduce((acc, key) => {
      if (key in object) {
        acc[key] = object[key];
      }
      return acc;
    }, {});
  }

  if (Array.isArray(data)) {
    return data.map(obj => transformObject(obj, keys)); 
  }
  return transformObject(data, keys);

}

module.exports = {
  deleteMeta,
  transform
};