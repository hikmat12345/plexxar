//parser for staff values

export const staffScheduleArray=(array)=>{
 console.log("arr",array)
 const schedular=[];
 array.map((obj) => {
  schedular.push({"label": obj.businesstimefrom, "value": obj.businesstimeto})
 })
 console.log("final: ",schedular)
}