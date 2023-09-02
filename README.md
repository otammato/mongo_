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
