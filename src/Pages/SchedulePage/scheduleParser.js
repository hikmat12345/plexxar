//parser for staff values
/* eslint-disable*/
export const staffScheduleArray = (array) => {
  const schedular = [];
  array.map((obj) => {
    schedular.push({ label: obj.businesstimefrom, value: obj.businesstimeto });
  });
  return schedular;
};
