import CustomError from "./CustomError";

export class NotFoundError extends CustomError {
  constructor(message: string, code: number = 404, details?: Object) {
    super(message, code, details);
    this.name = "NotFoundError";
  }
}

export default NotFoundError;
