
require('seneca')()
  .client()
  .act('role:math,cmd:sum,left:333,right:336',console.log)
