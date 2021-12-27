const onError = (error: any): string => {
  let message = error.toString();
  // Auth errors
  if (!(error instanceof Error) && error.message) {
    message = error.message;
  }
  return message!;
};

const isUnauthorized = (error: any): boolean => {
  if (!error) {
    return false;
  }
  const { response } = error;
  if (!response) {
    return false;
  }
  const { status } = response;
  if (status !== 401) {
    return false;
  }
  return true;
};

const appError = { onError, isUnauthorized };

export default appError;
