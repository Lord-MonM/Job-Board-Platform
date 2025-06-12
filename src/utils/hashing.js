const bcrypt = require("bcrypt");
const {createHmac} = require('crypto')


const doHash = (password, saltValue) =>{  
  const result = bcrypt.hash(password, saltValue);
  return result;
};

const doHashValidation = (password, hashedValue) =>{  
  const result = bcrypt.compare(password, hashedValue);
  return result;
};

const hmacProcess = (value, key) => {
  const result = createHmac('sha256',key).update(value).digest("hex");
  return result;
};

module.exports = { doHash, doHashValidation, hmacProcess};