export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class PropertyRequiredError extends ValidationError {
  property: string;

  constructor(property: string, statusCode: number) {
    super("No Property : " + property, statusCode);
    this.property = property;
  }
}
