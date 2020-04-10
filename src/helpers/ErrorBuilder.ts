
export class ErrorBuilder {
    private errorCode: number; // Todo: This will be set by letting us know if it a validation error or diff error
    private userMessage: string;
    private devMessage: string = "";
    private possibleSolution: string = "";
    private exceptionError: string = "";

    constructor(userMessage: string, errorCode: number = 0) {
        this.userMessage = userMessage;
        this.errorCode = errorCode;
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


}
