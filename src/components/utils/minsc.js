export const citiesImage = [
  "bangkok",
  "beijing",
  "hanoi",
  "moscow",
  "saintpetersburg",
  "paris",
  "seoul",
  "tokyo",
  "london",
];

export const cities = (data) => {
  let convertedData = Object.keys(data).map((key) => [Number(key), data[key]]);
  let returnData = [];

  convertedData = convertedData.map((country) => country[1]);
  for (var i = 0; i < convertedData.length; i++)
    returnData = returnData.concat(convertedData[i]);

  // console.log(typeof returnData)
  return returnData;
};
