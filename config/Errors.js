let currentId = 0;
function createError(message, htmlCode) {
  const newError = {
    message,
    htmlCode,
    errorId: currentId,
  };
  currentId++;
  return newError;
}
export function sendError(res, errorCode, details = "") {
  if (!errorCode in ErrorCodes) {
    throw `Invalid error ID used in Errors class: ${errorId}`;
  }
  res.status(errorCode.htmlCode).json({
    error: {
      message: errorCode.message,
      errorCode: errorCode.errorId,
      details: details,
    },
  });
}
export let ErrorCodes = {
  Unauthorized: createError("You are not authorized to use this resource", 401),
  Forbidden: createError("You are not allowed to use this resource.", 403),
  UnloggedIn: createError("You are not currently logged in.", 400),
  InvalidUser: createError("Invalid user specified.", 404),
  InvalidCredentials: createError("Invalid credentials specified.", 400),
  UnknownServerErr: createError("Unknown server error has occured.", 500),
  invalidInput: createError("Unexpected input was received.", 400),
};
