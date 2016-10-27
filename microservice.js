
require('seneca')()
  .use('math',{logfile:'./math.log'}) // finds ./math.js in local folder
  .listen()
curl -d '{"role":"math","cmd":"sum","left":1,"right":2}' http://localhost:10101/act
