const moment = require("moment/moment")

const messageFormat = (username, message, type) => {
    return {
        username, message, time: moment().format("h:m A"), type
    }
}

module.exports = messageFormat