# P2P
P2P - Portal

## Development - Run The Application

Want to Run The Application and code? Great!

P2P application uses Angular Framework for FrontEnd and Nodejs with Express as Middleware.
To run the application both Angualr and Nodejs have to run.

Follow the steps below

Open your favorite Terminal and run these commands.

> For the **New Developer** run `'npm install'` in root of the project and run `'npm ci'` inside the client folder !


First Tab:

```sh
npm run start:client
```

Second Tab:

```sh
npm run start:api
```
> Note: Angular is running in  [http://localhost:4200/](http://localhost:4200/)
> Node is running in [http://localhost:3000/](http://localhost:3000/)



## Build and deployment

Angular build command 

> `'npm run build -- -c=<env>'`



| Environment | Build Command |
| ------ | ------ |
| Project Development | `'npm run build -- -c=projdev'` |
| Project Quality | `'npm run build -- -c=qa'` |
| Production | `'npm run build -- -c=production'` |



## Happy Coding !