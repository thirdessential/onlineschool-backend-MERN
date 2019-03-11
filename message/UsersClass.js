class Users {
  constructor() {
    this.users = [];
  }
  // adding user data
  AddUserData(id, name, room) {
    var users = {
      id: id,
      name: name,
      room: room
    };
    this.users.push(users);
    return users;
  }

  // fucntion to get the list of all the online users in partivular class/room

  GetUsersList(room) {
    var users = this.users.filter(user => user.room === room);

    // this will return all the names of users in that room
    var namesArray = users.map(user => {
      return user.name;
    });
    return namesArray;
  }
}

// Exporting it
module.exports = { Users };
