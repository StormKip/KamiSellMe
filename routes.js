
const routes = require('next-routes')();

routes.add('marketplace/explore','/marketplace/explore')
    .add('/user/:address/','/user/showUser')
    .add('/marketplace/:header','/marketplace/markets');


module.exports = routes;