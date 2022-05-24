/* eslint-disable linebreak-style */
module.exports.ErrorCode = {
  ApplicationError: 500,
  Invalid_Request: 501,
  Invalid_Request_Url: 10001,
  Invalid_User_Credentials: 10002,
  Invalid_User: 10004,
  Invalid_User_Name_Or_Password: 10005,
  Invalid_Authentication: 10006,
  Invalid_Playlist_Ref: 10007,
  Invalid_Schedule_Ref: 10008,
  Invalid_Monitor_Ref: 10009,

};

module.exports.ErrorMessage = {
  ApplicationError: 'An Application Error Has Occured',
  Invalid_Request: 'Invalid Request',
  Invalid_Login_Credentials: 'Invalid username or password',
  Invalid_User_Credentials: 'Invalid User Credentials',
  Invalid_Request_Url: 'Invalid Request URL',
  Invalid_User: 'Invalid User',
  Invalid_User_Name_Or_Password: 'Invalid UserName or Password',
  Invalid_Authentication: 'Invalid Authentication',
  Invalid_Playlist_Ref: 'Invalid Playlist Reference',
  Invalid_Schedule_Ref: 'Invalid Schedule Reference',
  Invalid_Monitor_Ref: 'Invalid Monitor Reference',

};

module.exports.COMPONENTS = {
  Media: 1,
  Playlist: 2,
  Schedule: 3,
  Monitor: 4,
};
