const superagent = require('superagent')
const os = require('os')
var isStart = false, rendering

function start () {
  if (isStart) {
    isStart = false
    clearInterval(rendering)
    document.getElementById('render').style.display = 'none'
    document.getElementById('bottomNavbar').style.display = 'none'
    document.getElementById('read').classList.replace('btn-danger', 'btn-success')
    document.getElementById('read').innerHTML = '<i class="fas fa-play"></i>'
  } else {
    document.getElementById('read').classList.replace('btn-success', 'btn-secondary')
    superagent.get(document.getElementById('jsonUrl').value)
      .then((res) => {
        if (!res) {
          document.getElementById('read').classList.replace('btn-secondary', 'btn-success')
          return alert(document.getElementById('jsonUrl').value + '서버가 응답하지 않습니다')
        } else {
          isStart = true
          document.getElementById('render').style.display = 'block'
          document.getElementById('bottomNavbar').style.display = 'unset'
          document.getElementById('read').classList.replace('btn-secondary', 'btn-danger')
          document.getElementById('read').innerHTML = '<i class="fas fa-stop"></i>'
          rendering = setInterval(() => {
            superagent.get(document.getElementById('jsonUrl').value).then((res) => {
              if (!res.body.messages) {
                res.body = {
                  messages: [{
                    ip: 'PChat',
                    message: 'PChat에 오신걸 환영합니다!'
                  }]
                }
                superagent.put(document.getElementById('jsonUrl').value)
                  .send(res.body)
              }
              let renderTemp = ''
              res.body.messages.forEach((v, i) => {
                if (v.ip === os.hostname()) {
                  renderTemp += '<div class="text-right"><h5>' + v.ip + '</h5><p>' + v.message + '</p></div>'
                } else {
                  renderTemp += '<h5>' + v.ip + '</h5><p>' + v.message + '</p>'
                }
              })
              document.getElementById('render').innerHTML = renderTemp
            })
          }, 30)
        }
      }).catch((err) => {
        document.getElementById('read').classList.replace('btn-secondary', 'btn-success')        
        return alert(document.getElementById('jsonUrl').value + '서버가 응답하지 않습니다\n' + err)
      })
    }
}

function post () {
  document.getElementById('post').classList.replace('btn-success', 'btn-secondary')
  superagent.get(document.getElementById('jsonUrl').value).then((res) => {
    if (!res.body.messages) {
      res.body = {
        messages: [{
          ip: 'PChat',
          message: 'PChat에 오신걸 환영합니다!'
        }]
      }
      superagent.put(document.getElementById('jsonUrl').value)
        .send(res.body)
    }
    res.body.messages[res.body.messages.length] = {
      ip: os.hostname(),
      message: document.getElementById('message').value
    }
    superagent.put(document.getElementById('jsonUrl').value)
      .send(res.body)
      .catch(err => console.log(err))
    document.getElementById('message').value = ''
    document.getElementById('post').classList.replace('btn-secondary', 'btn-success')
  })
}
