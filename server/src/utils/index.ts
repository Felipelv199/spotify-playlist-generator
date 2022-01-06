export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const onError = (error: any): string => {
  const { response, message } = error;
  if (!response) {
    return message;
  }
  const { statusText } = response;
  if (!statusText) {
    return message;
  }
  return statusText;
};
