// ReportError() -------------------------------------------------------------

// Log the specified error to the console.error log, and pop up an alert with
// the error.message string.  In both cases, prepend the specified prefix so
// that it will be clear where the error came from.

export const ReportError = (prefix: string, error: any) => {
    let message : string = error.message;
    if (error.response) {
        message = `[${error.response.status}]: ${error.response.data}`
    }
    console.error(`${prefix} Error: ${message}:`);
    console.error(`${prefix} Original: "`, error);
    alert(`${prefix} Error: '${message}'`);
}

export default ReportError;
