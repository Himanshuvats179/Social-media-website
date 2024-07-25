const params=window.location.search
const _token=new URLSearchParams(params).get('token');
const _userID=new URLSearchParams(params).get('userID');
const _image=new URLSearchParams(params).get('image');
const _email=new URLSearchParams(params).get('email');
const _name=new URLSearchParams(params).get('name');
// console.log(_token);

if(_token){
    localStorage.setItem('token',_token);
    localStorage.setItem('name',_name);
    localStorage.setItem('email',_email);
    localStorage.setItem('image',_image);
    localStorage.setItem('userId',_userID);
}


const image=document.querySelector('.profilePic');
const container=document.querySelector('.container');
const prev=document.querySelector('.prev');
const next=document.querySelector('.next');
image.src=localStorage.getItem('image');
const profile=document.querySelector('.profile');

document.querySelector('.blogSearch').value="";
document.querySelector('.userSearch').value="";
let topics="",page=1,searchname="";




const getBlogs=async (userID)=>{
    let queryString="";
    queryString+='topics='+topics+"&page="+page;
    if(userID)
    queryString+='&userID='+userID;
    // console.log(userID);
    // console.log(queryString);
    try {
        const token=localStorage.getItem('token');
        // console.log(token);
        const {data:{blogs}}=await axios.get('/api/v1/blogs?'+queryString,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        // console.log(blogs);
       
      
        if(blogs.length==0)
        {
            container.innerHTML+="<h1 style='text-align:center'>No posts here</h1>";
            next.style.visibility='hidden';
        }
        else if(blogs.length==10)next.style.visibility='visible';
        blogs.forEach(blog => {
            let {topics,textContent,createdBy,name,image,_id:blogID}=blog;
           
            container.innerHTML+=`<div class="blog">
            <div class="brief">
                <img src="${image}" alt="profile-picture" class="othersProfiles">
                <a href="javascript:void(0)"class="name" onclick="profileOpen('${createdBy}')">${name}</a>
            </div>
            <a href="javascript:void(0)" class="topics" onclick="getSingleBlog('${blogID}')">${topics}</a>
            <p class="textContent">${textContent}</p>
        </div>`
        });
      
        const posts=document.querySelector('.userProfile .posts');
        if(posts)
        posts.innerHTML='Total Posts='+blogs.length;
    } catch (error) {
        // console.log('hi');
        container.innerHTML='<div class="error"><a class="register" href="home.html">You are not authorized, click here to login/register</a></div>'
    }
}

getBlogs();

async function getUsers(){
    document.querySelector('.next').style.visibility="hidden";
    document.querySelector('.prev').style.visibility="hidden";
    let queryString="";
    if(searchname!="")
    queryString="name="+searchname;
    const token=localStorage.getItem('token');
    try {
        const {data:{users}}=await axios.get('/api/v1/auth?'+queryString,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        next.style.visibility='hidden';
        prev.style.visibility='hidden';
        container.innerHTML="";
        if(users.length==0)
        {
            container.innerHTML="<h1 style='text-align:center'>No Such users exist</h1>";
            
        }

        users.forEach(user=>{
            const {name,image,_id:userID}=user;
            container.innerHTML+=`<div class="user">
            <div class="details">
                <img src="${image}" alt="profile-picture" class="othersProfilesuser">
                <a href="javascript:void(0)"class="username" onclick="profileOpen('${userID}')">${name}</a>
            </div>
        </div>`
        })

    } catch (error) {
        container.innerHTML='<h1> No such users exists</h1>'
    }
}


function changePage(x){
    
     page+=x;
     if(page===1)
     prev.style.visibility='hidden';
     else prev.style.visibility='visible';
     next.style.visibility='visible';
     container.innerHTML='';
     getBlogs();
}

function topicSearch(str){
    container.innerHTML="";
    topics=str;
    getBlogs();
}

function userSearch(str){
    container.innerHTML="";
    searchname=str;
    getUsers();
}

async function profileOpen(id){
    // console.log(id);
    // console.log(document.querySelector('.next'));
    document.querySelector('.next').style.visibility="hidden";
    document.querySelector('.prev').style.visibility="hidden";
    const token=localStorage.getItem('token');
    try {
        const {data:{users}}=await axios.get('/api/v1/auth?userID='+id,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        const user=users[0];
        const {name,image,email}=user;
        container.innerHTML="";
        container.innerHTML=`<div class="userProfile">
        
        <a href="javascript:void(0)" class="signOut" onclick="signOut()">Sign Out</a>
        <a href="javascript:void(0)" class="edit" onclick="editUser('${name}','${email}')">Edit Profile</a>
            <img src="${image}" alt="profile-pic" class="profileImage">
        
        <div class="briefDetails">
                <h1 class="profileName">${name}</h1>
                <h2 class="email">${email}</h2>
                <h3 class="posts">Posts</h3>
        </div>
        <a href="javascript:void(0)" class="makeBlog" onclick="blogForm()">make a post</a>
       </div>`
       const ID=localStorage.getItem('userId');
    //    console.log(ID);
       if(ID==id)
       {
        document.querySelector('.edit').style.visibility='visible'
        document.querySelector('.makeBlog').style.visibility='visible'
        document.querySelector('.signOut').style.visibility='visible'
       }
    //    console.log(id);
    //    console.log('bye');
      const posts= getBlogs(id);

    } catch (error) {
        container.innerHTML="<h1>No Such User Exist</h1>"
    }
}

async function editUser(name,email){
    
    console.log('hi');
    container.innerHTML=` <form  class="Form">
    <div class="profileForm">
        <label  class="custom-file-upload">Change DP</label>
            <input type="file" id="image" accept="image/*" oninput="imageUpload()">
          
        
        <div class="briefDetails">
            <label  class="profileNamelabel" style="display: block">
                New-Username</label>
                <input type="text" class="profileName"Value="${name}">
             
            
            <label class="emaillabel" style="display: block;">
                newEmail</label>
                <input type="text" class="email" value="${email}">
                
            
            <label class="passwordlabel" style="display: block">
                New-Password
            </label>
                <input type="password" class="password">
            <p class="errorUser"></p>
            
           
        </div>
    </div>
    <button class="submit" onclick="updateInfo()">Submit</button>
   </form>`

}
const defaultImage=localStorage.getItem('image');
let currImage=localStorage.getItem('image');

async function imageUpload(){
    const imageFile=event.target.files[0];
    const formData=new FormData();
    formData.append('image',imageFile);
    
    const token=localStorage.getItem('token');
    try {
        document.querySelector('.errorUser').innerHTML='image uploading....';
        const {data:{image:{src}}}=await axios.post('/api/v1/auth/upload',formData,{
            headers:{
                Authorization:`Bearer ${token}`,
                'Content-Type':'multipart/form-data'
            }
        })
        currImage=src;
        document.querySelector('.errorUser').innerHTML='image uploaded..';
        // console.log(src);
    } catch (error) {
        currImage=defaultImage;
        document.querySelector('.errorUser').innerHTML=error.response.data.msg;
    }
    
}

async function updateInfo(){
    event.preventDefault();
    const nameEdit=document.querySelector('.Form .profileName');
    const emailEdit=document.querySelector('.Form .email');
    const passwordEdit=document.querySelector('.Form .password');
    const newName=nameEdit.value;
    const newEmail=emailEdit.value;
    const newPassword=passwordEdit.value;
    const userID=localStorage.getItem('userId');
    const body={};
    if(!newName){
        body.name=newName
    }
    if(!newEmail){
        body.email=newEmail
    }
    if(newPassword!=""){
        body.password=newPassword
    }
    body.image=currImage;
    body.user={};
    // console.log(body);
    body.user.userID=userID;
    // console.log(body);
    const token_=localStorage.getItem('token');
    try {
        const {data:{user:{name,email,image},token}}=await axios.patch('/api/v1/auth/update',body,{
            headers:{
                Authorization:`Bearer ${token_}`
            }
        })
        localStorage.setItem('name',name);
        localStorage.setItem('email',email);
        localStorage.setItem('image',image);
        localStorage.setItem('token',token);
        window.location.reload();
    } catch (error) {
        document.querySelector('.errorUser').innerHTML=error.response.data.msg;
    }
}

profile.addEventListener('click',(event)=>{
    event.preventDefault();
    profileOpen(localStorage.getItem('userId'));
});

function blogForm(){
    event.preventDefault();
    container.innerHTML=`<form class=blogForm>
    <label for="topicsBlog"class="topicsLabel" >The topics the post deals with</label><br>
    <textarea name="topicsBlog"class='topicsBlog' rows="2" cols='40' placeholder="Describe Briefly what's on your mind" ></textarea>
    <label class="detailsLabel">Enter main content</label><br>
    <textarea class='detailsBlog' rows="20" cols='40' placeholder="Describe what's on your mind" ></textarea>
    <h5 class='errorBlog'></h5>
    <button class="submitBlog" onclick="makeBlog()">Submit</button>
  </form>`
}

async function makeBlog(){
    event.preventDefault();
    document.querySelector('.next').style.visibility="hidden";
    document.querySelector('.prev').style.visibility="hidden";
    const token=localStorage.getItem('token');
    const userID=localStorage.getItem('userId');
    const image=localStorage.getItem('image');
    const name=localStorage.getItem('name');
    const topics=document.querySelector('.topicsBlog').value;
    const textContent=document.querySelector('.detailsBlog').value;
    try {
        const {data:{blog}}=await axios.post('/api/v1/blogs',{
            name,image,topics,textContent,
        },{ headers:{
            Authorization:`Bearer ${token}`
        }},{user:{userID}})
        // console.log(blog);
        window.location.reload();
    } catch (error) {
        document.querySelector('.errorBlog').innerHTML=error.response.data.msg;
    }
}

async function getSingleBlog(str){
    event.preventDefault();
    const token=localStorage.getItem('token');
    try {
        const {data:{blog}}=await axios.get(`/api/v1/blogs/${str}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        const {name,topics,textContent,_id:blogID,image,createdBy}=blog;
        // console.log(blogID);
        container.innerHTML=`<div class="blog">
            <a href="javascript:void(0)" class="deleteSymbol" onclick="deleteBlog('${blogID}','${createdBy}')">delete</a>
            <div class="brief">
                <img src="${image}" alt="profile-picture" class="othersProfiles">
                <a href="javascript:void(0)"class="name" onclick="profileOpen('${createdBy}')">${name}</a>
            </div>
            <a href="javascript:void(0)" class="topics" onclick="getSingleBlog('${blogID}')">${topics}</a>
            <p class="textContent">${textContent}</p>
            <a href="javascript:void(0)" class="editSymbol" onclick="editBlog('${blogID}','${createdBy}','${textContent}','${topics}')">edit</a>
        </div>`
        const currUser=localStorage.getItem('userId');
        if(currUser!=createdBy)
        {
            document.querySelector('.deleteSymbol').style.visibility='hidden';
            document.querySelector('.editSymbol').style.visibility='hidden';
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteBlog(blogID,createdBy){
    try {
        const userID=localStorage.getItem('userId');
        const token =localStorage.getItem('token');
        // console.log(blogID);
        // console.log(createdBy);
        // console.log(token);
        await axios.delete(`/api/v1/blogs/${createdBy}/${blogID}`,{ 
            headers:{
            Authorization:`Bearer ${token}`
        }},{user:{userID}});
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

function editBlog(blogID,createdBy,textContent,topics){
    console.log(blogID,createdBy,textContent);
    container.innerHTML=`<form class=editBlogForm>
    <label for="topicsBlog"class="topicsLabel" >The topics the post deals with</label><br>
    <textarea name="topicsBlog"class='topicsBlog' rows="2" cols='40' placeholder="Describe Briefly what's on your mind" >${topics}</textarea>
    <label class="detailsLabel">Enter main content</label><br>
    <textarea class='detailsBlog' rows="20" cols='40' placeholder="Describe what's on your mind" >${textContent}</textarea>
    <h5 class='errorBlog'></h5>
    <button class="submitBlog" onclick="makeNewBlog('${blogID}','${createdBy}')">Submit</button>
  </form>`

}

async function makeNewBlog(blogID,createdBy){
    event.preventDefault();
    const token=localStorage.getItem('token');
    const userID=localStorage.getItem('userId');
    const topics=document.querySelector('.topicsBlog').value;
    const textContent=document.querySelector('.detailsBlog').value;
    try {
        // console.log(blogID);
        // console.log(createdBy);
        // console.log(token);
        const blog=await axios.patch(`/api/v1/blogs/${createdBy}/${blogID}`,{
            topics,textContent
        },{ 
            headers:{
            Authorization:`Bearer ${token}`
        }},{user:{userID}});
        console.log(blog);
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

function signOut(){
    localStorage.clear();
    window.location.reload();
}