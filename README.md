# LaborX Profile Backend

## Prerequisites

1. Install node v8.9.4+, npm 5.6.0+, Yarn 1.3.2+
2. Install and launch mongodb service
3. Update these config files:

 - config/default.json
 - config/production.json


## Setup & Run

### Development

```
# install dependencies
yarn install

# startapp using development settings
pm2 start ecosystem.config.js

# stop app
pm2 stop ecosystem.config.js
```

### Production

```
# install dependencies
yarn install

# startapp using production settings
pm2 start ecosystem.config.js --env production

# stop app
pm2 stop ecosystem.config.js
```

### API
Postman collection not deployed yet


### TESTS
For running test follow next step:
```
yarn test
```
