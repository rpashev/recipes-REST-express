# Recipe app REST API
Node/Express/Mongo REST API for my [Angular app](https://github.com/rpashev/angular-recipe-app/#readme)


## Endpoints

- /api/v1/users/register &emsp; `POST`
- /api/v1/users/login &emsp; `POST`
- /api/v1/recipes/ &emsp; `GET` | `POST`
- /api/v1/recipes/:recipeId &emsp; `GET` | `PUT` | `DELETE`
- /api/v1/users/favorites &emsp; `GET` | `POST`
- /api/v1/users/favorites/:recipeId &emsp; `DELETE`
- /api/v1/users/authored &emsp; `GET`



## Setup
### To get a local copy up and running follow these simple steps:

1. Make sure you have **`node`** and **`npm`** installed globally on your machine.  
2. Environmental variables - you need **JWT_SECRET** and **DB_CONNECTION** (mongoDB connection string) to run the app

3. Clone the repo  
    ### `git clone https://github.com/rpashev/rest-movie-apps.git`  

3. Install NPM packages  
    ### `npm install`    
  
4. Run the app in development mode 
    ### `npm start`  
