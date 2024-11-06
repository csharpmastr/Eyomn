export const cleanData = (data) => {
  const cleanedData = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];

      if (typeof value === "object" && value !== null) {
        const nestedCleanedData = cleanData(value);

        if (Object.keys(nestedCleanedData).length > 0) {
          cleanedData[key] = nestedCleanedData;
        }
      } else if (value !== "" && value !== null) {
        cleanedData[key] = value;
      }
    }
  }

  return cleanedData;
};
