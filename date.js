exports.getDate = function() {
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let today = new Date()
    return day = today.toLocaleString("en-US", options);

}
exports.getDay = function() {
    let options = {
        weekday: "long",

    }
    let today = new Date()
    return day = today.toLocaleString("en-US", options);

}