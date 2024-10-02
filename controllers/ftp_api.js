const sql = require("mssql");
const path = require("path");

const ftpFolder = path.resolve(__dirname, "../uploads/ftp/");

const dbConfig = {
    user: "smartsmelter",
    password: "Smelter@123",
    server: "10.130.82.111", // example: localhost
    database: "smartsmelter",
    options: {
        encrypt: false, // If using Azure SQL, else set to false
        trustServerCertificate: true, // True for local dev/test (self-signed certs)
    },
};

module.exports.uploadPdfReport = async (req, res) => {
    const { date, shift } = req.body;
    try {
        // Connect to the database
        await sql.connect(dbConfig);
        const result =
            await sql.query`SELECT status FROM ftp_report WHERE shift_date = ${date} AND shift = ${shift}`;

        if (result.recordset.length > 0) {
            const report = result.recordset[0];
            if (report.status === "draft") {
                // Send the PDF file if status is 'final'
                const pdfFilePath = path.join(ftpFolder, "withdrawal.pdf");
                console.log("pdffile");
                res.download(pdfFilePath);
            } else {
                // Send JSON response if status is not 'final'
                res.json({
                    message:
                        "No matching data found, do you want to add all the data manually?",
                });
            }
        } else {
            // No matching row found
            res.json({
                message:
                    "No matching data found, do you want to add all the data manually?",
            });
        }
    } catch (err) {
        console.error("Database query failed:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
