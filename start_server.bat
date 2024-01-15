start  "DB Server" "C:/Program Files/MongoDB/Server/5.0/bin/mongod.exe" --dbpath "D:/mongoDB_Data"
start  "ODBC" "C:/Program Files/MongoDB/Connector for BI/2.14/bin/mongosqld.exe" --mongo-uri "mongodb://127.0.0.1:27017"
npm start > app.log 2>&1