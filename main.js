
//========= خاص بعمليه الاسكرول ========//
let currentPage = 1
lastPage = 1
window.addEventListener("scroll", () => {
  // const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  // if (endOfPage && currentPage < lastPage) {
  //   currentPage = currentPage + 1
  //   getPost(false, currentPage)
  // }
})
//========= خاص بعمليه الاسكرول ========//
getPost()
function getPost(reload = true, page = 1) {
  toggleLoader(true)
  axios
    .get(`https://tarmeezAcademy.com/api/v1/posts?limit=4&page=${page}`)
    .then((response) => {
      toggleLoader(false)
      const posts = response.data.data

      lastPage = response.data.meta.last_page

      if (reload) {
        document.getElementById("posts").innerHTML = ""
      }

      // اخفاء واظهر زر تعديل البوست

      for (post of posts) {
        var profileImage = post.author.profile_image

        if (Object.keys(profileImage).length == 0) {
          profileImage = `./img/1.jpg`
        }

        const author = post.author

        let user = getCurrentUser()
        let isMyPost = user != null && post.author.id == user.id
        let editBtnContent = ``



        if (isMyPost) {
          editBtnContent = `
          <button id="btn-etit" class="btn btn-secondary" style=" margin-left: 8px; float: right;" onclick="btnEtidPost('${encodeURIComponent(
            JSON.stringify(post)
          )}')" >Edit</button>

          <span id="btn-delete" class="icon-trash c-danger" style="float: right;" onclick="oneBtnDleatPost('${encodeURIComponent(
            JSON.stringify(post)
          )}')"> </span>


          `
        }





        let content = ` 
            <div class="card shadow">
                <div class="card-header  ">

                <span onclick="userClick(${author.id}) "style="cursor: pointer">
                  <img src="${profileImage}" style=" width: 40px; height: 40px; border-radius: 50%; box-shadow:0px 0px 3px 0px;"/>
                  <b>@${post.author.username}</b>
                </span>
                 
                   ${editBtnContent}
       
                </div>
                <div class="card-body" onclick="clickOnPost(${post.id})" style="cursor: pointer;">
                  <img id="test-img" class="w-100" src="${post.image}" alt="" />
                  <h6 style="color: rgb(165, 164, 164)">${post.created_at}</h6>
                  <h5> ${post.title}  </h5>
                 <p>
                   ${post.body}
                 </p>
                  <hr />
                   <div">
                     <svg
                       xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"   viewBox="0 0 16 16" >   <path     d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" /> 
                     </svg>
                     <span> 
                        ${post.comments_count} Comments 
                      
                     </span>

                  </div>
                </div>
            </div>`
        document.getElementById("posts").innerHTML += content
      }
    })
}

function clickOnPost(postId) {
  window.location = `commentPost.html?postId=${postId}`
}

function loginBtnClicked() {
  toggleLoader(true);
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;

  const params = {
    username: username,
    password: password,
  };

  axios
    .post("https://tarmeezacademy.com/api/v1/login", params)
    .then((response) => {
      toggleLoader(false);
      let userName = response.data.user.name;
      let profileImg = response.data.user.profile_image;
      
      if (!profileImg) {
        profileImg = `./img/1.jpg`;
      }

      document.querySelector("#logout-div > img").src = profileImg;
      document.querySelector("#nav-username").innerHTML = userName;

      // تخزين التوكن والمستخدم في localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("loginModal");
      const BootstrapHide = bootstrap.Modal.getInstance(modal);
      BootstrapHide.hide();
      setupUI();
      
      showAlert("تم تسجيل دخولك بنجاح");

    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
      location.reload()
    });
}


// function logout() {
//   localStorage.removeItem("token")
//   localStorage.removeItem("user")
//   showAlert("تم تسجيل خروجك بنجاح")
//   setupUI()
//   location.reload()
// }

function showAlert(customMessage, type = "success") {
  const successAlert = document.getElementById("success-alert")
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("")

    successAlert.append(wrapper)
  }
  setTimeout(() => {
    const alertToHide = bootstrap.Alert.getOrCreateInstance(`#success-alert`)
  }, 2000)

  appendAlert(customMessage, type)
}

function registerBtnClicked() {
  toggleLoader(true)
  const name = document.getElementById("register-name-input").value
  const username = document.getElementById("register-username-input").value
  const password = document.getElementById("register-password-input").value
  let image = document.getElementById("profile-image-input").files[0]
  const token = localStorage.getItem("token")

  let formData = new FormData()
  formData.append("username", username)
  formData.append("password", password)
  formData.append("name", name)
  formData.append("image", image)

  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  }
  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData, {
      headers: headers,
    })
    .then((response) => {
      toggleLoader(false)

      console.log(response)

      localStorage.setItem("token", response.data.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      const modal = document.getElementById("register")
      const BootstrapHide = bootstrap.Modal.getInstance(modal)
      BootstrapHide.hide()
      setupUI()
      // hide alert
      showAlert("تم تسجيل دخولك بنجاح")
    })
    .catch((error) => {
      const message = error.response.data.message
      showAlert(message, "danger")
    }).finally(() => {
      toggleLoader(false)
    })
}

function createNewPostClicked() {
  toggleLoader(true)
  let postId = document.getElementById("post-id-input").value
  let isCreate = postId == null || postId == ""

  let title = document.getElementById("create-title-input").value
  let body = document.getElementById("create-body-input").value
  let image = document.getElementById("create-image-input").files[0]
  const token = localStorage.getItem("token")

  let formData = new FormData()
  formData.append("body", body)
  formData.append("title", title)
  formData.append("image", image)

  let url = ``
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  }

  if (isCreate) {
    url = `https://tarmeezacademy.com/api/v1/posts`

    axios
      .post(url, formData, {
        headers: headers,
      })
      .then((response) => {
        toggleLoader(false)

        const modal = document.getElementById("addpost")
        const BootstrapHide = bootstrap.Modal.getInstance(modal)
        BootstrapHide.hide()
        showAlert(" تم انشاء البوست بنجاح ")
        getPost()
      })
      .catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
      })
  } else {
    formData.append("_method", "put")

    url = `https://tarmeezacademy.com/api/v1/posts/${postId}`

    axios
      .post(url, formData, {
        headers: headers,
      })
      .then((response) => {
        const modal = document.getElementById("addpost")
        const BootstrapHide = bootstrap.Modal.getInstance(modal)
        BootstrapHide.hide()
        showAlert(" تم انشاء البوست بنجاح ")
        getPost()
      })
      .catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
      }).finally(() => {
        toggleLoader(false)
      })
  }
}

window.onload = function() {
  setupUI();
}

function setupUI() {
  let token = localStorage.getItem("token");

  const loginDiv = document.getElementById("logged-in-div");
  const logoutDiv = document.getElementById("logout-div");
  const addPost = document.getElementById("add-post");

  if (token == null) {
    if (addPost != null) {
      addPost.style.setProperty("display", "none", "important");
    }

    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    if (addPost != null) {
      addPost.style.setProperty("display", "block", "important");
    }

    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");

    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.querySelector("#logout-div > img").src = user.profile_image || './img/1.jpg';
  }
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}


function creatComment() {
  let commentBody = document.getElementById("comment-input").value

  let params = {
    body: commentBody,
  }

  let token = localStorage.getItem("token")

  axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      showAlert("تم انشاء الكومنت بنجاح")
      location.reload()
    })
    .catch((error) => {
      const errorMassage = error.response.data.message
      showAlert(errorMassage, "danger")
    })
}

function btnEtidPost(postOpject) {
  let post = JSON.parse(decodeURIComponent(postOpject))
  console.log(post)

  document.getElementById("post-id-input").value = post.id
  document.getElementById("post-modal-title").innerHTML = "Edit Post"
  document.getElementById("Create-post").innerHTML = "Update"
  document.getElementById("create-title-input").value = post.title
  document.getElementById("create-body-input").value = post.body

  let postModle = new bootstrap.Modal(document.getElementById("addpost"), {})
  postModle.toggle()
}

function addPostClick() {
  document.getElementById("post-id-input").value = ""
  document.getElementById("post-modal-title").innerHTML = "Create A New Post"
  document.getElementById("Create-post").innerHTML = "Create"
  document.getElementById("create-title-input").value = ""
  document.getElementById("create-body-input").value = ""

  let postModle = new bootstrap.Modal(document.getElementById("addpost"), {})
  postModle.toggle()
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("تم تسجيل خروجك بنجاح");
  setupUI();
  getPost()
}


// function getCurrentUser() {
//   let user = null
//   const storageUser = localStorage.getItem("user")

//   if (storageUser != null) {
//     user = JSON.parse(storageUser)
//   }
//   return user
// }

function oneBtnDleatPost(postOpject) {
  let post = JSON.parse(decodeURIComponent(postOpject))


  document.getElementById("delete-post-id-input").value = post.id

  let postModle = new bootstrap.Modal(document.getElementById("deleta-Post-modal"), {})
  postModle.toggle()

}

function btnDleatPost() {

  let token = localStorage.getItem("token")
  let postId = document.getElementById("delete-post-id-input").value

  let url = `https://tarmeezacademy.com/api/v1/posts/${postId}`

  const headers = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`,
  }

  axios.delete(url, {
    headers: headers
  }).then((response) => {
    console.log(response)
    const modal = document.getElementById("deleta-Post-modal")
    const BootstrapHide = bootstrap.Modal.getInstance(modal)
    BootstrapHide.hide()
    showAlert(" تم حذف البوست بنجاح")
    getPost()

  })
    .catch((error) => {

      const message = error.response.data.message
      showAlert(message, "danger")
    })
}
// mostafaKhaled123


// خاص بصفحه البروفايل'

function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get("userid")
  return id
}


getUser()
function getUser() {
  const id = getCurrentUserId()
  axios.get(`https://tarmeezAcademy.com/api/v1/users/${id}`)
    .then((response) => {


      const user = response.data.data
      document.getElementById("main-info-email").innerHTML = user.email
      document.getElementById("main-info-name").innerHTML = user.name
      document.getElementById("main-info-username").innerHTML = user.username
      document.getElementById("posts-count").innerHTML = user.posts_count
      document.getElementById("comments-count").innerHTML = user.comments_count
      document.getElementById("name-post").innerHTML = `${user.username}'s`
      document.getElementById("header-img").src = user.profile_image

    })
}


getPostss()
function getPostss() {
  let id = getCurrentUserId()
  axios
    .get(`https://tarmeezAcademy.com/api/v1/users/${id}/posts`)
    .then((response) => {
      const posts = response.data.data




      document.getElementById("user-post").innerHTML = ""


      for (post of posts) {

        var profileImage = post.author.profile_image

        if (Object.keys(profileImage).length == 0) {
          profileImage = `./img/1.jpg`
        }


        let user = getCurrentUser()
        let isMyPost = user != null && post.author.id == user.id
        let editBtnContent = ``


        if (isMyPost) {
          editBtnContent = `
          
          <button id="btn-etit" class="btn btn-secondary" style=" margin-left: 8px; float: right;" onclick="btnEtidPost('${encodeURIComponent(
            JSON.stringify(post)
          )}')" >Edit</button>

          <span id="btn-delete" class="icon-trash c-danger" style="float: right;" onclick="oneBtnDleatPost('${encodeURIComponent(
            JSON.stringify(post)
          )}')"> </span>
          `
        }

        let content = ` 
            <div class="card shadow">
                <div class="card-header  ">
                  <img src="${profileImage}" style=" width: 40px; height: 40px; border-radius: 50%; box-shadow:0px 0px 3px 0px;"/>
                  <b>@${post.author.username}</b>
                 
                   ${editBtnContent}
       
                </div>
                <div class="card-body" onclick="clickOnPost(${post.id})" style="cursor: pointer;">
                  <img id="test-img" class="w-100" src="${post.image}" alt="" />
                  <h6 style="color: rgb(165, 164, 164)">${post.created_at}</h6>
                  <h5> ${post.title}  </h5>
                 <p>
                   ${post.body}
                 </p>
                  <hr />
                   <div">
                     <svg
                       xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"   viewBox="0 0 16 16" >   <path     d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" /> 
                     </svg>
                     <span> 
                        ${post.comments_count} Comments 
                      
                     </span>

                  </div>
                </div>
            </div>`
        document.getElementById("user-post").innerHTML = content
      }
    })
}



function userClick(userId) {

  window.location = `profile.html?userid=${userId}`
}


function profileClicked() {
  const user = getCurrentUser()
  const userId = user.id
  window.location = `profile.html?userid=${userId}`
}

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible"
  } else {
    document.getElementById("loader").style.visibility = "hidden"

  }
}
// ==================================================
