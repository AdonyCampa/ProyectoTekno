const handleHttpError = (res, message = 'Algo sucedio', code = 403) => {
    res.status(code);
    res.send({ ok: false, msg: message });
}

const handleErrorResponse = (res, message = "Algo ocurrio", code = 401) => {
    console.log("Error", message);
    res.status(code);
    res.send({ ok: false, msg: message });
};


module.exports = { handleHttpError, handleErrorResponse };