const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
fs = require("fs");
const secret_key = fs.readFileSync("jwtRS256.key");
users = undefined;

const getHash = username => {
  hash = users.getAll().filter(value => {
    return value.login === username;
  });
  if (hash.length > 0) {
    return hash[0].password;
  } else {
    return undefined;
  }
};

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    hash = getHash(username);
    if (!hash) {
      reject();
    } else {
      bcrypt
        .compare(password, hash)
        .then(compare => {
          if (compare) {
            token = jwt.sign(username, secret_key, (err, token) => {
              if (err) {
                reject();
              } else {
                resolve(token);
              }
            });
          } else {
            reject();
          }
        })
        .catch(() => reject());
    }
  });
};

const verifyacess = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        reject();
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = model => {
  users = model;
  return { login, verifyacess };
};