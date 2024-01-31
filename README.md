# Untitled Chess App

A webapp for playing timed chess matches against other players, including profiles and match histories. 

## Installation 

First, install Node [here](https://nodejs.org/en) (if not already installed). Get the LTS version. 

**Frontend Dependencies**

1. Install modules
```bash
# Navigate to /client in the repo
cd client 
# Install Node modules
npm ci
```
2. Start the frontend server to check installation.
```bash
# Start the dev server
npm run dev 
```
3. You should now see a message showing the port where the frontend is running on localhost. You can type 'q' and enter to stop the server.

**Backend Dependencies**

1. Install modules 
```bash
# Navigate to /server in the repo
cd server 
# Install Node modules
npm ci
# Install nodemon
npm install -g nodemon
```
2. Start the backend server to check installation.
```bash
nodemon index
```
3. This should give a message saying "server has started on port 5000". ctrl + c to stop the server.

*When developing, run each of these servers in its own terminal window. You can keep track of the servers and make changes without manually restarting anything.*

**Database Dependencies**
1. Install PostgreSQL [here](https://www.postgresql.org/download/). (**If it asks you to make a password, use the one in server/db.js**)
2. Access server as default user
```bash
#Login as superadmin. Enter the same password you entered on install.
psql -U postgres
```
3. Run all the commands that are in server/database.sql, in order. 
4. Now, try `\l`. You should see a list of databases including "chessapp".

*You will probably have to go back in and reconfigure the database when we add more features. Besides that, you should be able to run and test the app now.*