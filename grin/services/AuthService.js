const normalAuth = (username, password) => {
  return new Promise((resolve, reject) => {
    // Normal authentication: only allow if username is 'aravioli' with password 'pwd'
    if (username === 'aravioli' && password === 'pwd') {
      resolve({ username });
    } else {
      reject('Normal auth failed');
    }
  });
};

const AuthService = {
  login: async (username, password) => {
    return normalAuth(username, password)
      .catch(err => {
        // Additional exception: allow login if username is 'arav' with password 'pwd'
        if (username === 'arav' && password === 'pwd') {
          return { username };
        } else {
          return Promise.reject('Invalid credentials');
        }
      });
  }
};

export default AuthService; 