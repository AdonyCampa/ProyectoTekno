const handleHttpError = (res, message = "Algo sucedio", code = 403) => {
  res.status(code);
  res.send({ succes: false, message: message });
};

const handleErrorResponse = (res, message = "Algo ocurrio", code = 401) => {
  console.log("Error", message);
  res.status(code);
  res.send({ succes: false, message: message });
};

module.exports = { handleHttpError, handleErrorResponse };
