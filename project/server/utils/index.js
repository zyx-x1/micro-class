exports.getPostData = (data) => {
  if (!!data)
    return JSON.parse(Object.keys(JSON.parse(JSON.stringify(data)))[0]);
};
