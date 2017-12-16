const md = window.markdownit()
const config = {
  apiKey: "AIzaSyBo6_MpYasiBOK_tR3SNHMwOilK-hHnu9Q",
  databaseURL: "https://jackslowfuck.firebaseio.com",
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
  lgdom.innerText = '#' + id + ' | ' + timeStampToLocalTime(post.date)
  var p = document.createElement('p')
  p.innerHTML = md.render(post.message)
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

function addPost (message) {
  var data = {
    message: message,
    date: Date.now()
  }
  postsRef.push(data)
}

function submit () {
  var msg = document.getElementById('msg')
  if (msg.value === '') {
    alert('Message can not be empty')
    return
  }
  addPost(msg.value)
  msg.value = ''
}

function enter (e) {
  if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
    submit()
  }
}

function login () {
  var username = document.getElementById('username').value
  var password = document.getElementById('password').value
  firebase.auth().signInWithEmailAndPassword(username, password).catch(err => console.log(err.errorMessage))
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById('hide').style.display = 'block'
    document.getElementById('user').innerText = 'hello, ' + user.email
    document.getElementById('log').style.display = 'none'
  } else {
    console.log('not logged in yet.')
  }
})
