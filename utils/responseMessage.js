function responseMessage(message, success, anotherDate) {
  return {
    success,
    message,
    ...anotherDate,
  }
}

module.exports = responseMessage
