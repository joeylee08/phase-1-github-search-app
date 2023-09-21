//URL templates
const userUrl = user => `https://api.github.com/search/users?q=${user}`;
const repoUrl = user => `https://api.github.com/users/${user}/repos`;

//rendering locations
const userList = document.querySelector('ul#user-list');

//search form
const searchForm = document.querySelector('form#github-form');
searchForm.addEventListener('submit', (e) => fetchUserInfo(e))

//helper functions
function fetchUserInfo(e) {
  e.preventDefault()
  const user = searchForm.search.value.trim()
  if (user === "") {
    alert("Enter a name, please.");
    return;
  }
  fetch(userUrl(user))
    .then(res => res.json())
    .then(json => renderUserInfo(json))
}

function renderUserInfo(userObj) {
  userList.innerHTML = "";
  userObj.items.forEach(user => {
    const card = document.createElement('div');
    const name = document.createElement('h2');
    const avatar = document.createElement('img');
    const profile = document.createElement('a');
    const line = document.createElement('br');

    name.textContent = user.login;
    avatar.src = user.avatar_url;
    avatar.alt = `${user.login} avatar`;
    avatar.classList.add('image');
    profile.textContent = `Link to profile`;
    profile.href = user.html_url;
    profile.classList.add('link')

    avatar.addEventListener('click', (e) => fetchUserRepos(e, user))
    
    card.append(name, avatar, line, profile)
    userList.append(card)
  })
}
  
function fetchUserRepos(e, user) {
  document.querySelectorAll('li.repoData').forEach(repo => {
    repo.remove()
  })
  fetch(repoUrl(user.login))
    .then(res => res.json())
    .then(repoObj => {
      renderUserRepos(e, repoObj)
    })
}

function renderUserRepos(e, repoObj) {
  const target = e.target;
  repoObj.forEach(repo => {
    const li = document.createElement('li')
    li.textContent = repo.html_url
    li.className = 'repoData'
    target.insertAdjacentElement('afterend', li)
  })
}