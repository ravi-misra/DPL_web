const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    LOCAL_HOST: process.env.LOCAL_HOST,
    PLCI_HOST: process.env.PLCI_HOST,
    DB_URL: process.env.DB_URL,
    validShifts: ["A", "B", "C", "G", "M", "N"],
    deptGroups: {
        CI: ["530"],
        ELECTRICAL: ["359"],
        MECHANICAL: ["128", "131", "139"],
        PLO1: ["020"],
        PLO2: ["021"],
        PLO3: ["027"],
        PLO4: ["028"],
        FTP: ["024"],
        TRANSPORT: ["039"],
    },
    pl_dept: [
        "530-E & I - POTLINE",
        "128-MECH.ALUMINA HNDLG. SHOP",
        "131-POT CAP.REP.SHOP",
        "359-POT LINE (ELECT.)",
        "139-POT LINE (MECH.)",
        "024-POTLINE(O) FTP & PC",
        "023-POTLINE(O) LPC SHOP",
        "026-POTLINE(O) OSG-I & OSG-II",
        "039-POTLINE(O) TRANSPORT",
        "020-POTLINE-I(OPRN.)",
        "021-POTLINE-II(OPRN.)",
        "027-POTLINE-III(OPRN.)",
        "028-POTLINE-IV(OPRN.)",
    ],
    defaultPassword: "password",
};

// .env file contents
// PORT=3000
// LOCAL_HOST="127.0.0.1"
// PLCI_HOST="10.130.64.51"
// DB_URL="mongodb://localhost:27017/dpl"
