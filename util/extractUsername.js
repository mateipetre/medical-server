const extractUsername = (username) => 
    username ? username.slice(username.lastIndexOf(':') + 1) : '';
  
  module.exports = {
    extractUsername
  };  