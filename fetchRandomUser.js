let keepRequesting = false;
let randUser = {
  location: {},
};

var binArrayToJson = function (binArray) {
  var str = '';
  for (var i = 0; i < binArray.length; i++) {
    str += String.fromCharCode(parseInt(binArray[i]));
  }
  return JSON.parse(str);
};

let restart = () => {
  let userContainer = document.querySelector('.card-container');
  userContainer.innerHTML = '';
};

let stopFetchingRandomUsers = () => {
  keepRequesting = false;
};

let fetchRandomUserWithFetch = async (e) => {
  if (e.type == 'click') keepRequesting = true;

  let reader = await (
    await fetch('https://randomuser.me/api')
  ).body.getReader();
  let { results } = binArrayToJson((await reader.read()).value);
  let userContainer = document.querySelector('.card-container');
  let userList = document.querySelector('ul');

  console.log(results[0]);

  randUser.name = results[0].name;
  randUser.location.city = results[0].location.city;
  randUser.location.country = results[0].location.country;
  randUser.email = results[0].email;
  randUser.userName = results[0].login.username;
  randUser.password = results[0].login.password;
  randUser.profilePic = results[0].picture.large;
  let userName = document.createElement('div');
  userName.className = 'user-name';
  userName.innerText = results[0].name.first;
  console.log(randUser);
  //console.log(userContainer);

  Object.entries(randUser).map(([name, val]) => {
    let currAttr = document.createElement('li');
    // currAttr.innerText = name;
    if (name == 'profilePic') {
      document.querySelector('img').src = val;
    }
    console.log(name);
    currAttr.setAttribute('data-label', name);
    if (name == 'name') {
      currAttr.setAttribute(
        'data-value',
        `${val.title} ${val.first} ${val.last}`
      );
    } else if (name == 'location') {
      currAttr.setAttribute('data-value', `${val.city} : ${val.country}`);
    } else {
      currAttr.setAttribute('data-value', val);
    }
    userList.appendChild(currAttr);
  });

  //userContainer.appendChild(userName);
  keepRequesting && requestAnimationFrame(fetchRandomUserWithFetch);
};

function addListeners() {
  var t = Array.prototype.slice.call(document.getElementsByTagName('li'));
  //console.log(t);
  t.forEach(function (e) {
    e.addEventListener('mouseover', function () {
      t.forEach(function (t) {
        t.className = t.className.replace(/\bactive\b/, '');
      }),
        (this.className += ' active'),
        (document.getElementById('user-title').innerHTML =
          this.getAttribute('data-label')),
        (document.getElementById('user-value').innerHTML =
          this.getAttribute('data-value'));
    });
  });
}

window.onload = (e) => {
  setTimeout(() => {
    addListeners();
  }, 1000);
  requestAnimationFrame(fetchRandomUserWithFetch.bind(this, e));
};
