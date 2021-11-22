const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    LOCAL_HOST: process.env.LOCAL_HOST,
    PLCI_HOST: process.env.PLCI_HOST
}

// .env file contents
// PORT=3000
// LOCAL_HOST="127.0.0.1"
// PLCI_HOST="10.130.64.23"