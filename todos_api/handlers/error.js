function errorHandler(error, request, response, next){
  console.log('In /handlers/error.js errorHandler(): ');
  console.log(`error status: ${error.status}`);
  console.log(`error message: ${error.message}`);
  return response.status(error.status || 500).json({
    error: {
      message: error.message || 'Oops! Something went wrong.'
    }
  });
}

module.exports = errorHandler;