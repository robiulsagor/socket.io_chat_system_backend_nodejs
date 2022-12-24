let users = []

const join_room = (id, username, room) => {
    const user = { id, username, room }
    users.push(user)
    return users
}

const usersByRoom = room => {
    return users.filter(user => user.room === room)
}

const removeUser = username => {
    const leftUsers = users.filter(user => user.username !== username)
    users = leftUsers
    return users
}

module.exports = { join_room, usersByRoom, removeUser }