import CustomError from "./CustomError.js";

class UnauthorizedError extends CustomError {
  constructor(message: string, code: number = 401, details?: Object) {
    super(message, code, details);
    this.name = "UnauthorizedError";
  }
}

export default UnauthorizedError;
