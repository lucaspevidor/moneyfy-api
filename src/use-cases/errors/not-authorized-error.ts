export class NotAuthorizedError extends Error {
  constructor() {
    super("Operation not authorized.");
  }
}
