# mongodb

## 1. Convert MySQL database to MongoDB database:

1. MySQL
   
   ```
   sudo apt install mysql-server -y
   sudo systemctl daemon-reload
   sudo systemctl start mysql
   ```
   
   ```
   mysql -u root -p -e "SELECT * FROM suppliers" coffee > output.csv
   ```

2. Convert .CSV to JSON

   ```
   sudo apt install python3-pip
   pip3 install pandas
   python3
   ```

   ```
   touch csv_to_json.py
   ```

   ```
   import pandas as pd

   # Read the CSV file
   df = pd.read_csv('output.csv', delimiter='\t')  # use tab as delimiter
    
   # Convert dataframe to JSON format
   df.to_json('output.json', orient='records', lines=True)
   ```
   
   ```
   python3 csv_to_json.py
   ```

3. MongoDB
   1. install mongodb:
   
   https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

   ```
   cat /etc/lsb-release
   sudo apt-get install gnupg curl
   curl -fsSL https://pgp.mongodb.com/server-7.0.asc |    sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg    --dearmor
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ls /var/lib/mongodb
   ps --no-headers -o comm 1
   sudo systemctl start mongod
   sudo systemctl status mongod
   sudo systemctl enable mongod
   mongosh
   ```

   ```
   mongoimport --db coffee --collection suppliers --file output.json
   ```
   <img width="1000" alt="Screenshot 2023-09-02 at 15 10 30" src="https://github.com/otammato/mongodb/assets/104728608/ee9f8c66-c674-4927-ae8e-91f904659eeb">
