export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public info?: object
  ) {
    super(message);
  }
}
export class NotFoundError extends ApiError {
  constructor(msg: string) {
    super(404, msg);
  }
}
export class BadRequestError extends ApiError {
  constructor(info: object) {
    super(400, "Bad request", info);
  }
}
