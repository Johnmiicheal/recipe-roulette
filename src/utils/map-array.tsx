/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapArrayByKey(arr: any[], key: string | number) {
  if (arr && !Array.isArray(arr)) {
    throw new Error("Expected an array as the first argument.");
  }

  // Flatten and filter the array
  const validItems = arr?.flat().filter(item => item && item[key]);

  // Map the array by the specified key
  return validItems?.reduce((acc, item) => {
    acc[item[key]] = item; // Use the key's value as the key in the result object
    return acc;
  }, {});
}