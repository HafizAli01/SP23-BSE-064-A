# Data Folder

This folder is used for MongoDB data storage when running MongoDB locally.

## Usage

If you're running MongoDB locally, you can specify this folder as the data directory:

```bash
mongod --dbpath ./data
```

## Contents

- MongoDB will automatically create database files in this directory
- Collections and documents will be stored here
- This folder should be added to .gitignore in production

## Database Collections

The application will create the following collections:
- `users` - User accounts and authentication data
- `products` - Product catalog information
- `orders` - Customer order history
- `sessions` - User session data (managed by connect-mongo) 