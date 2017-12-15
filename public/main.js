const config = {
  databaseURL: "https://jackslowfuck.firebaseio.com/"
}
firebase.initializeApp(config)
const db = firebase.database()
const postsRef = db.ref('posts')
displayPosts()

function displayPosts () {
  var div = document.getElementById('container')
  var fragment = document.createDocumentFragment()
  postsRef.on('value', ss => {
    div.innerHTML = ''
    var posts = ss.val()
    posts = objToArray(posts)
    posts.sort((x, y) => Number(y.date) - Number(x.date))
    posts.forEach((post, index) => {
      fragment.appendChild(createFieldset(post, posts.length - index))
    })
    div.appendChild(fragment)
  })
}

function createFieldset (post, id) {
  var lgdom = document.createElement('legend')
  var a = document.createElement('a')
  a.href = '#' + id
  a.innerText = '#' + id
  lgdom.appendChild(a)
  var text = document.createTextNode(' | ' + post.name + ' | ' + timeStampToLocalTime(post.date))
  lgdom.appendChild(text)
  var p = document.createElement('p')
  p.innerText = post.message
  var fsdom = document.createElement('fieldset')
  fsdom.id = String(id)
  fsdom.appendChild(lgdom)
  fsdom.appendChild(p)
  return fsdom
}

function timeStampToLocalTime (n) {
  n = parseInt(n) || 0
  var d = new Date(n)
  return d.toLocaleString()
}

function objToArray (o) {
  return Object.keys(o || {}).map(key => o[key])
}

function addPost (name, message) {
  var data = {
    name: name,
    message: message,
    date: Date.now()
  }
  postsRef.push(data)
}

function submit () {
  var name = document.getElementById('name')
  var msg = document.getElementById('msg')
  if (msg.value === '') {
    alert('message can not be empty')
    return
  }
  addPost(name.value || 'anonymous', msg.value)
  name.value = ''
  msg.value = ''
}
