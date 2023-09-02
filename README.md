
# MongoDB 

# 1.1. Migrate the MySQL database to MongoDB by following these steps.

## 1. Setting up MySQL:

1. **Install MySQL**:

    ```bash
    sudo apt install mysql-server -y
    sudo systemctl daemon-reload
    sudo systemctl start mysql
    ```

1.1.2. **Access MySQL**:

    ```bash
    sudo mysql
    ```

1.1.3. **Configure MySQL User**:

    ```sql
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<yoursecurepassword>';
    ```

1.1.4. **Create a Sample Database for Testing**:

    ```sql
    CREATE DATABASE coffee;
    USE coffee;
    CREATE TABLE suppliers(
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(100) NOT NULL,
      PRIMARY KEY (id)
    );
    ```

    ![MySQL Screenshot](https://github.com/otammato/mongodb/assets/104728608/d288a854-cde8-4e2a-b87c-689ff2108344.png)

1.1.5. **Export Data to CSV**:

    ```bash
    mysql -u root -p -e "SELECT * FROM suppliers" coffee > output.csv
    ```

## 1.2. Convert CSV to JSON:

1.2.1. **Setup Python & Required Libraries**:

    ```bash
    sudo apt install python3-pip
    pip3 install pandas
    ```

1.2.2. **Create the Conversion Script**:

    ```bash
    touch csv_to_json.py
    ```

    Then, add the following Python code to the file:

    ```python
    import pandas as pd

    # Read the CSV file
    df = pd.read_csv('output.csv', delimiter='\t')  # use tab as delimiter

    # Convert dataframe to JSON format
    df.to_json('output.json', orient='records', lines=True)
    ```

1.2.3. **Run the Conversion Script**:

    ```bash
    python3 csv_to_json.py
    ```

## 1.3. Setup and Import Data to MongoDB:

1.3.1. **Install MongoDB**:

    [Official MongoDB Installation Guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

    ```bash
    cat /etc/lsb-release
    sudo apt-get install gnupg curl
    curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
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

1.3.2. **Import Data into MongoDB**:

    ```bash
    mongoimport --db coffee --collection suppliers --file output.json
    ```

    ![MongoDB Screenshot](https://github.com/otammato/mongodb/assets/104728608/ee9f8c66-c674-4927-ae8e-91f904659eeb.png)


---

## 1. Migrate the MySQL database to MongoDB database:

1. MySQL
   
   ```
   sudo apt install mysql-server -y
   sudo systemctl daemon-reload
   sudo systemctl start mysql
   ```
   
   ```
   sudo mysql
   ```
   
   ```
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<yoursecurepassword>';
   ```
   create a sample database to test migration:
   
   ```
   CREATE DATABASE coffee;
   USE coffee;
   CREATE TABLE suppliers(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     address VARCHAR(255) NOT NULL,
     city VARCHAR(255) NOT NULL,
     state VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     phone VARCHAR(100) NOT NULL,
     PRIMARY KEY (id)
   );

   ```
   
   <img width="1000" alt="Screenshot 2023-09-02 at 15 18 46" src="https://github.com/otammato/mongodb/assets/104728608/d288a854-cde8-4e2a-b87c-689ff2108344">

   ```
   mysql -u root -p -e "SELECT * FROM suppliers" coffee > output.csv
   ```

1. Convert .CSV to JSON

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

2. MongoDB
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
