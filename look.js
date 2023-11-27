const modul = document.querySelector(".modul");
const modalOverlay = document.querySelector(".ovarley");
const createPost = document.querySelector("#postCreate");
const cancelModul = document.querySelector(".Cancel");
const saveModul = document.querySelector(".Save");
const allPostSection = document.querySelector(".allPostss");
const catchAllItems = document.querySelector(".catchAllItems");
const addingPost = document.querySelector(".addingPost");

const saveNewPost = document.querySelector(".Save");
const form = document.querySelector("form");
const newTitle = document.querySelector(".newTitle");
const newText = document.querySelector("#data");
let changerEdit = null;
let newObjData;
console.log(form);

function openModal() {
  modalOverlay.style.display = "flex"; // Display the overlay
  modul.style.display = "block"; // Display the modal content
  allPostSection.style.filter = "blur(2px)"; // section blur
}

// Function to close the modal
function closeModal() {
  modalOverlay.style.display = "none"; // Hide the overlay
  modul.style.display = "none"; // Hide the modal content
  allPostSection.style.filter = "blur(0px)"; // hide blur
}

// Json url

const Base_url = "http://localhost:3000/";

createPost.addEventListener("click", (e) => {
  openModal();
  //modul.style.display = "block";
   //allPostSection.style.filter = "blur(2px)";
  //modalOverlay.style.display="block"
  newObjData = null;
  catchInfo(newObjData);

  addingPost.textContent = "Add Post";
  newTitle.value = "";
  newText.value = "";
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target.classList[0] === "ovarley") {
    closeModal();
  }
  console.log(e.target.classList[0]);
});

async function getPosts() {
  const data = await fetch(`${Base_url}posts`);
  const responcePosts = await data.json();

  // console.log(responcePosts);
  return responcePosts;
}

// getPosts()

async function createPosts() {
  const newposts = await getPosts();

  if (newposts.length > 0) {
    newposts.forEach((post) => {
      catchAllItems.innerHTML += `<div class="catchItem" data-post-id="${
        post.id
      }">
                    <div class="topTitle">
                        <h2 class="postTitleHead">${post.title} </h2>
                        <span>${post.date} </span>
                    </div>
                    <div class="middleInfo">
                        <p class="postText" style=" max-height: 66px;" >${
                          post.message
                        }</p> <span class="seeMore">... see more</span>
                    </div>
    
                    <div class="reactPost">
                        <div class="like react ${
                          post.isLiked == "true" ? "active" : ""
                        } " data-id ="${post.isLiked}">
                            <span class="material-symbols-outlined"> thumb_up</span>
    
                            <span>Like</span>
                        </div>
                        <div class="edit react">
                            <span class="material-symbols-outlined">
                                edit_square
                            </span>
                            <span>Edit</span>
                        </div>
                        <div class="delete react">
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                            <span>Delete</span>
                        </div>
                    </div>
                </div>`;
    });

    // See More start
    const seeMores = document.querySelectorAll(".seeMore");

    seeMores.forEach((elm) => {
      console.log("sad", elm.parentElement.querySelector(".postText").innerHTML.length)
      if(elm.parentElement.querySelector(".postText").innerHTML.length>=180){
        elm.style.display="block"
      }
      elm.addEventListener("click", (e) => {
        let parentEnhance = elm.parentElement.parentElement;
        let enhanceInfo = elm.parentElement.querySelector(".postText");
        
        


      //  console.log(enhanceInfo.innerHTML)
        if (enhanceInfo.style.maxHeight == "66px") {
          enhanceInfo.style.maxHeight = "inherit";
          parentEnhance.style.height = "inherit";
          elm.textContent = "...see less";
          elm.style.color="blue"
        } else {
          enhanceInfo.style.maxHeight = "66px";
          parentEnhance.style.height = "285px";
          elm.textContent = "...see more";
          elm.style.color="#585C60"
        }
        // console.log(enhanceInfo);
        // console.log(parentEnhance);
      });
    });

    // See More End

    // Edit Process start
    const editButton = document.querySelectorAll(".edit");

    editButton.forEach((elm) => {
      elm.addEventListener("click", async (e) => {
        // modul.style.display = "block";
        // allPostSection.style.filter = "blur(2px)";
        openModal();
        const parentEditElm = e.target.closest(".catchItem");
        const postTitleHeadElement =
          parentEditElm.querySelector("h2.postTitleHead");
        const postText = parentEditElm.querySelector("p.postText");
        const postTextelm = postText.textContent.trim();

        changerEdit = parentEditElm.dataset.postId;
        catchInfo(changerEdit);
        // console.log("sending", changerEdit);
        // console.log(postTextelm)
        addingPost.textContent = "Changer";
        newTitle.value = postTitleHeadElement.innerHTML;
        newText.value = postTextelm;
      });
    });

    // Edit Process end

    // Delete process

    const deleteButton = document.querySelectorAll(".delete");

    deleteButton.forEach((del) => {
      del.addEventListener("click", async (e) => {
        const parentElm = e.target.closest(".catchItem");
        let changerId = parentElm.dataset.postId;
        let sureInfo = confirm("Are you sure you want to delete this card?");
        if (sureInfo) {
          await deletePost(changerId);
        }

        console.log(changerId);
      });
    });

    // Delete process End
  }
  const likes = document.querySelectorAll(".like");
  console.log("dasa", likes);
  likebutton(likes);
}
createPosts();

function likebutton(posts) {
  posts.forEach((post) => {
    post.addEventListener("click", (e) => {
      const parentElementID = e.target.closest(".catchItem").dataset.postId;
      const clickeedPost = post.dataset.id;
      console.log("likes:", clickeedPost);

      if (clickeedPost == "false") {
        let objLike = {
          isLiked: "true",
        };
        likeData(objLike, parentElementID)
        console.log("obj", objLike)
      } else {
        let objLike = {
          isLiked: "false",
        };
        likeData(objLike, parentElementID)
        console.log("objFal", objLike)
      }

    });
  });

  console.log("posts:", posts);
}

//? Like Data 
async function likeData(likeUser,id) {
  await fetch(`${Base_url}posts/${id}`, {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(likeUser)
  })
}


async function catchLike(minorObj) {
  console.log("minor", minorObj);
  await updateLike(minorObj);
}

function catchInfo(newData) {
  newObjData = newData;
  console.log("catchinfo", newObjData);
  // Form
  // return newObjData
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  //console.log("post");
  console.log("catchinfo Form", newObjData);

  if (e.submitter.value === "Save" && newObjData === null) {
    let currentTime = new Date();

    let obj = {
      title: newTitle.value,
      message: newText.value,
      date: `${currentTime.getDate()}/${
        currentTime.getMonth() + 1
      }/${currentTime.getFullYear()}`,
    };

    console.log(newTitle.value.length);
    if (newTitle.value.length > 0 || newText.value.length > 0) {
      await postUser(obj);
      console.log("Posted");
    } else {
      alert("Please fill in the information");
    }
  } else if (e.submitter.value === "Cancel") {
    closeModal();
    // modul.style.display = "none";
    // allPostSection.style.filter = "blur(0px)";
  }

  if (e.submitter.value === "Save" && newObjData !== null) {
    let currentTime = new Date();
    let obj = {
      id: newObjData,
      date: `${currentTime.getDate()}/${
        currentTime.getMonth() + 1
      }/${currentTime.getFullYear()}`,
      body: {
        title: newTitle.value,
        message: newText.value,
      },
    };

    console.log("updated");
    await updateUser(obj);
  }
});
// Post new Post

async function postUser(user) {
  await fetch(`${Base_url}posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}

// Delete Post
async function deletePost(id) {
  await fetch(`${Base_url}posts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Upadate a user
async function updateUser(userInfo) {
  console.log("updated");
  await fetch(`${Base_url}posts/${userInfo.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo.body),
  });
}
