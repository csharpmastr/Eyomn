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

export const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  const birthDateObj = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }
  return age;
};

const removeNullValues = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => value !== null && value !== "")
      .map(([key, value]) => [key, removeNullValues(value)])
  );
};
