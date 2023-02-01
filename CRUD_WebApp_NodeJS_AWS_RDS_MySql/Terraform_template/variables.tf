variable "dbpassword" {
    description = "RDS root user password"
    type        = string
    sensitive   = true
}

variable "dbname" {
    description = "DB name"
    type        = string
    sensitive   = true
}

variable "dbuser" {
    description = "DB user"
    type        = string
    sensitive   = true
}
 

