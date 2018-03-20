/**
 * Created by pidoi on 18/03/2018.
 */
function request(url) {
    return new Promise((resolve, reject)=>{
        const xhr= new XMLHttpRequest();
        xhr.open('GET',url,true);
        xhr.send();
        xhr.onreadystatechange=()=> {
            if(xhr.readyState != 4) return;
            if(xhr.status==200) return resolve(xhr.responseText);
            else return reject();
        };
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let articleID = getParameterByName("postId");
let userID=getParameterByName("userId");

const gettingComments=(id, data)=>{
    request("https://jsonplaceholder.typicode.com/posts/"+id+"/comments")
        .then((result)=>{
            document.body.innerHTML="";
            let div=document.createElement("div");
            div.innerHTML+="<div><h1>"+data.title+"</h1><p>"+data.body+"</p></div>";
            document.body.appendChild(div);
            JSON.parse(result).map((item, index)=>div.innerHTML+="<ul><h2>Comment №"+parseInt(index+1)+"</h2><li><h4>heading:</h4>"+item.name+"</li><li><h4>user:</h4>"+item.email+"</li><li><h4>comment:</h4>"+item.body+"</li></ul>");
        })
        .catch(()=>console.log("error"))};

const gettingArticles=()=>{
    request("https://jsonplaceholder.typicode.com/posts")
        .then((result)=>{
            JSON.parse(result).map(item=>document.body.innerHTML+="<div>"+"<h1>"+item.title+"</h1>"+"<p>"+item.body+"</p>"+"<button class='commentsRequest' data-id="+item.id+" data-title='"+item.title+"' data-body='"+item.body+"'>More about this post</button>" +"</div>");
        })
        .then(()=>Array.from(document.getElementsByClassName("commentsRequest"))
            .map(element=>element.onclick=()=>{
                let data={
                    title:element.dataset.title,
                    body:element.dataset.body
                };
                gettingComments(element.dataset.id, data);
            }))
        .catch(()=>console.log("error"));

};

const gettingUser=(userID)=>{
    request("https://jsonplaceholder.typicode.com/posts?userId="+userID)
        .then(result=>{
            document.body.innerHTML="";
            JSON.parse(result).map((item, index)=>document.body.innerHTML+="<ul><h2>Comment №"+parseInt(index+1)+"</h2><li>"+item.title+"</li><li>"+item.body+"</li></ul>");
        })
        .catch(()=>console.log("error"))
};

if(!articleID&&!userID){
    gettingArticles();
}
else if(articleID){
    gettingComments(articleID);
}
else if(userID){
    gettingUser(userID);
}