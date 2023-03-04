exports.getPostData = (data) => {
  if (!!data)
    return JSON.parse(Object.keys(JSON.parse(JSON.stringify(data)))[0]);
};

exports.isSameDay = (dateObj1, dateObj2) => {
  let year1 = dateObj1.getYear(),
    month1 = dateObj1.getMonth(),
    date1 = dateObj1.getDate();
  let year2 = dateObj2.getYear(),
    month2 = dateObj2.getMonth(),
    date2 = dateObj2.getDate();
  return year1 == year2 && month1 == month2 && date1 == date2;
}