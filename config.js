const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    LOCAL_HOST: process.env.LOCAL_HOST,
    PLCI_HOST: process.env.PLCI_HOST,
    DB_URL: process.env.DB_URL,
    validShifts : ['A', 'B', 'C', 'G', 'WO/LV', 'M', 'N'],
    AREACODE: {
        POTLINE: ['530', '128', '131', '359', '139', '024', '026', '039', '020', '021', '027', '028']
    }
}

// .env file contents
// PORT=3000
// LOCAL_HOST="127.0.0.1"
// PLCI_HOST="10.130.64.23"
// DB_URL="mongodb://localhost:27017/yelp-camp"