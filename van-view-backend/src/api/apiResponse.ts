export interface APIResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

const ApiResponse = <T>(
  data: T | null,
  message: string,
  statusCode: number,
): APIResponse<T> => {
  return {
    data,
    message,
    statusCode,
  };
};
export default ApiResponse;
