export class InvalidTransactionAmountError extends Error {
  constructor() {
    super("Transaction invalid amount.");
  }
}
