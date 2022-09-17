//alert("hello")
// curd

let cl = console.log;

const postInfo = document.getElementById("postInfo");
const postForm = document.getElementById("postForm");
const title = document.getElementById("title");
const info = document.getElementById("info");
const updateBtn = document.getElementById("updateBtn");
const submitBtn = document.getElementById("submitBtn");



let baseUrl = 'https://jsonplaceholder.typicode.com/posts';


function makeNetworkCall(methodName, url, body) {

    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();

        xhr.open(methodName, url);

        xhr.onload = function () {

            if (xhr.status === 200 || xhr.status === 201) {
                cl(xhr.response);

                resolve(xhr.response)
            }
            else {
                reject("Something went wrong");
            }
        };

        xhr.send(body);
    });
}
makeNetworkCall("GET", baseUrl)
    .then(res => {
        postArray = JSON.parse(res);
        templating(postArray)
    })
    .catch(cl);

const onEditHandler = (ele) => {
    //cl(ele)

    let getId = +(ele.dataset.id);

    localStorage.setItem('setUpdateId', getId);

    let obj = postArray.find(post => post.id === getId);
    cl(obj);

    title.value = obj.title;
    info.value = obj.body;
    updateBtn.classList.remove('d-none')
    submitBtn.classList.add('d-none')
}

const onDeleteHandler = (ele) => {
    //cl(ele)
    let getDeleteId = +ele.dataset.id;
    let deleteUrl = `${baseUrl}/${getDeleteId}`;
    makeNetworkCall(`DELETE`, deleteUrl);
    postArray = postArray.filter(post => post.id != getDeleteId);
    templating(postArray);
}

function templating(arr) {
    let result = "";
    arr.forEach((ele, i) => {
        result += `
        <tr>
            <td>${i + 1}</td>
            <td>${ele.userId}</td>
            <td>${ele.title}</td>
            <td>${ele.body}</td>
            <td><button data-id='${ele.id}' class='btn btn-info' onclick="onEditHandler(this)">Edit</button></td>
            <td><button data-id='${ele.id}' class='btn btn-danger' onclick="onDeleteHandler(this)">Delete</button></td>
        </tr>
        `;
    });
    postInfo.innerHTML = result;
}


const onsubmitHandler = (eve) => {
    eve.preventDefault();
    cl('submit')
    let obj = {
        title: title.value,
        body: info.value,
        userId: Math.floor(Math.random() * 10) + 1
    };
    makeNetworkCall('post', baseUrl, JSON.stringify(obj))
        .then (res => {
            obj.id = JSON.parse(res).id;
            postArray.push(obj);
            templating(postArray);
            cl(obj)
        })
        .catch(cl);
    eve.target.reset();
};

const onupdateHandler = () => {
    let getId = +localStorage.getItem('setUpdateId');
    postArray.forEach(obj => {
        if (obj.id === getId) {
            obj.title = title.value;
            obj.body = info.value;
        }
    })
    templating(postArray);
    let updateObj = {
        title: title.value,
        body: info.value
    }
    let updateUrl = `${baseUrl}/${getId}`
    makeNetworkCall('PATCH', updateUrl, JSON.stringify(updateObj))
    postForm.reset();
    updateBtn.classList.add('d-none');
    submitBtn.classList.remove('d-none');

}

postForm.addEventListener('submit', onsubmitHandler);
postForm.addEventListener('click', onupdateHandler);