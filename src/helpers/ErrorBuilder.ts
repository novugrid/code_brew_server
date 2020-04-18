import { ValidationError } from "express-validator";

export class ErrorBuilder {
    private errorCode: number; // Todo: This will be set by letting us know if it a validation error or diff error
    public userMessage: string;
    public statusCode: number;
    private devMessage: string = "";
    private possibleSolution: string = "";
    private exceptionError: string = "";
    private validationError: ValidationError[] = [];

    constructor(userMessage: string, statusCode: number = 400, errorCode: number = 0) {
        this.userMessage = userMessage;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }

    public UserMessage(message: string): ErrorBuilder {
        this.userMessage = message;
        return this;
    }

    public PossibleSolution(message: string): ErrorBuilder {
        this.possibleSolution = message;
        return this;
    }

    public DevMessage(message: string): this {
        // Todo: this.errorType = 1;
        this.devMessage = message;
        return this;
    }

    public ExceptionError(error: string): this {
        this.exceptionError = error;
        return this;
    }

    /**
     * Todo: make sure we cna type the ValidationErrors[]. so we should remove the any
     * @param errors
     * @constructor
     */
    public ValidationError(errors: ValidationError[]) {
        this.statusCode = 422;
        this.validationError = errors;
        return this;
    }

}
