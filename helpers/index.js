ReE = function (res, err, code) {
    // Error Web Response
    if (typeof err == "object" && typeof err.message != "undefined") {
        err = err.message;
    }
    if (typeof code !== "undefined") res.statusCode = code;

    return res.json({ success: false, message: err });
};

ReS = function (res, msg, data, code) {
    // Success Web Response
    let send_data = { success: true, message: msg };
    if (typeof data == "object") {
        send_data = Object.assign(data, send_data); //merge the objects
    }
    if (typeof code !== "undefined") res.statusCode = code;

    return res.json(send_data);
};

module.exports = {
    ReE,
    ReS
}