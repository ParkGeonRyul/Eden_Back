export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
export class InternalServerError extends ValidationError {
  constructor() {
    super("INTERNAL_SERVER_ERROR", 500);
  }
}

export class PropertyRequiredError extends ValidationError {
  property: string;

  constructor(property: string) {
    super("NO_PROPERTY " + property, 400);
    this.property = property;
  }
}
export class DuplicatePropertyError extends ValidationError {
  property: string;

  constructor(property: string) {
    super("DUPLICATE " + property, 400);
    this.property = property;
  }
}