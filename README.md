# Sample app (the page is under development)

## Summary
This is a simple CRUD Node.JS app built with Express.

## Running on EC2 and RDS MySQL instances

### 1. Terraform template to create an EC2 + an AWS RDS instance

```
provider "aws" {
  region                    = "us-east-1"
  shared_config_files       = ["/home/ec2-user/.aws/config"]
  shared_credentials_files  = ["/home/ec2-user/.aws/credentials"]
}


data "aws_availability_zones" "available" {
  state = "available"
}
data "aws_ssm_parameter" "current-ami" {
  name = "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
}


# resource "aws_vpc" "vpc" {
#   cidr_block = "10.0.0.0/16"
#   #public_subnets       = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
#   enable_dns_hostnames = true
#   enable_dns_support   = true

#   tags = {
#     Name = "test-vpc"
#   }
# }

resource "aws_default_vpc" "default" {
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name = "Default VPC"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id     = aws_default_vpc.default.id
  # cidr_block = "10.0.1.0/24"
  cidr_block = "172.31.98.128/25"
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "test-public-subnet"
  }
}

resource "aws_subnet" "private_subnet" {
  vpc_id     = aws_default_vpc.default.id
  # cidr_block = "10.0.2.0/24"
  cidr_block = "172.31.99.128/25"
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name     = "test-private-subnet"
  }
}


resource "aws_security_group" "ec2_security_group" {
  name        = "test-ec2-security-group"
  description = "Allow ssh access"
  vpc_id      = aws_default_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "ec2_instance" {
  ami           = data.aws_ssm_parameter.current-ami.value
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.ec2_security_group.id]
  associate_public_ip_address = true
  key_name      = "test_delete"

  user_data     = <<-EOF
#!/bin/bash
sudo su
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install node
nvm install --lts
nvm install 10.16.0
npm install express
  EOF
  
  tags = {
    Name = "web-server-terr"
  }
}

resource "aws_security_group" "rds_security_group" {
  name        = "test-rds-security-group"
  description = "Allow mysql access"
  vpc_id      = aws_default_vpc.default.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name        = "test-rds-subnet-group"
  subnet_ids  = [aws_subnet.private_subnet.id, aws_subnet.public_subnet.id]
}

resource "aws_db_instance" "rds_instance" {
  engine                  = "mysql"
  engine_version          = "5.7"
  instance_class          = "db.t2.micro"
  db_name                 = var.dbname
  username                = var.dbuser
  password                = var.dbpassword
  allocated_storage       = 20
  vpc_security_group_ids  = [aws_security_group.rds_security_group.id]
  db_subnet_group_name    = aws_db_subnet_group.rds_subnet_group.name
  skip_final_snapshot     = true
  publicly_accessible     = true
}

resource "null_resource" "setup_db" {
  depends_on = [aws_db_instance.rds_instance] #wait for the db to be ready
  provisioner "local-exec" {
    command = "mysql -h ${aws_db_instance.rds_instance.address} -u ${aws_db_instance.rds_instance.username} --password=${var.dbpassword}  ${var.dbname} < my_sql.sql"
  }
}



output "rds_hostname" {
  description = "RDS instance hostname"
  value       = aws_db_instance.rds_instance.address
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.rds_instance.port
}

output "rds_username" {
  description = "RDS instance root username"
  value       = aws_db_instance.rds_instance.username
  sensitive   = true
}

output "rds_endpoint" {
  value = aws_db_instance.rds_instance.endpoint
}

output "ec2_public_dns" {
  value = aws_instance.ec2_instance.public_dns
}

output "ec2_public_ip" {
  value = aws_instance.ec2_instance.public_ip
}
```

```
terraform init

terraform validate

terraform plan

terraform apply

# terraform state rm RESOURCE, example: terraform state rm aws_ebs_volume.volume.

# terraform state list

# terraform destroy --target=resource.name
```

### 2. Launch the app
```
git clone https://github.com/otammato/CRUD_WebApp_NodeJS_AWS_RDS_MySql.git
```

```
cd CRUD_WebApp_NodeJS_AWS_RDS_MySql/resources/codebase_partner/
```

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install node
nvm install --lts
nvm install 10.16.0
npm install express
npm start
```

```
npm i -g pm2

sudo pm2 startup

pm2 start server.js

#pm2 unstartup systemd
#pm2 list
#pm2 kill
#ps aux | grep PM2
#kill -9 [pid]
```

```
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000

#sudo iptables -L
#sudo iptables -t nat -L 
#sudo iptables -t nat -L --line-numbers
#sudo iptables -t nat -D PREROUTING 1
```

```
# replace the endpoint with yours:
# this is to connect with a DB using the command line:
mysql -h database-2.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com -P 3306 -u admin -p

# this is to import a backup file with DB from the project folder.
mysql -h database-2.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com -u admin -p  COFFEE < my_sql.sql
```

### 3. Test the app 
<br><br>
<p align="center" >
  <img src="images/Screenshot 2023-01-31 at 19.23.50.png" width="700px"/>
</p>
<br><br>

<br><br>
<p align="center" >
  <img src="images/Screenshot 2023-01-31 at 19.48.21.png" width="700px"/>
</p>
<br><br>


## Running locally

### 1. Build the local Db manually
```sql
create DATABASE coffee;
use coffee;
create table suppliers(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  PRIMARY KEY ( id )
);
```

### 2. Install and run the server
```zsh
npm install

# define your db vars at start
APP_DB_HOST=localhost \
APP_DB_USER=root \
APP_DB_PASSWORD="" \
APP_DB_NAME=coffee \
npm start
```
If you do not set the env vars when starting the app the values 
from `app/config/config.js` will be used
