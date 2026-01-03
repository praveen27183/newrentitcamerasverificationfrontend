const bcrypt = require('bcryptjs');

// Change this to your desired admin password
const password = 'Admin@1234';

const hashedPassword = bcrypt.hashSync(password, 10);
console.log('Hashed password:', hashedPassword); 