export enum BusinessErrorType {
  NOT_FOUND = 0,
  PRECONDITION_FAILED = 1,
  BAD_REQUEST = 2,
}

export class BusinessLogicException extends Error {
  public readonly type: BusinessErrorType;
  constructor(message: string, type = BusinessErrorType.PRECONDITION_FAILED) {
    super(message);
    this.name = 'BusinessLogicException';
    this.type = type;
    Object.setPrototypeOf(this, BusinessLogicException.prototype);
  }
}