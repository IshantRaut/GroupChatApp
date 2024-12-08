const ORIGIN = window.location.origin;
const STORED_CHATS_LENGTH = 10;
let CURRENT_GROUP_ID = null;

const token = localStorage.getItem('token');
const decodedToken = parseJwt(token);
const USERNAME = decodedToken.username;
const USER_ID = decodedToken.userId;
const EMAIL = decodedToken.email;

// Navbar
const usernameNav = document.getElementById('usernameNav');
// Chats
const chatList = document.getElementById('chatList');
const messageInput = document.getElementById('sendMessage');
const sendBtn = document.getElementById('sendBtn');
// Groups
const createGroupBtn = document.getElementById('createGroupBtn');
const groupNameInput = document.getElementById('groupName');
const createGroupSubmitBtn = document.getElementById('createGroupSubmitBtn');
const closeCreateGroupFormBtn = document.getElementById('closeCreateGroupFormBtn');
const createGroupContainer = document.getElementById('createGroupContainer');
const groupsContainer = document.getElementById('groupsContainer');
const leaveGroupBtn = document.getElementById('leaveGroupBtn');
// Group members
const groupMembersContainer = document.getElementById('groupMembersContainer');
const groupMembersOuterContainer = document.getElementById('groupMembersOuterContainer');
const showGroupMembersBtn = document.getElementById('showGroupMembersBtn');
const closeGroupMembersBtn = document.getElementById('closeGroupMembersBtn');
// Request
const receivedRequestsBtn = document.getElementById('receivedRequestsBtn');
const closeReceivedRequestsBtn = document.getElementById('closeReceivedRequestsBtn');
const sendRequestContainer = document.getElementById('sendRequestContainer');
const sendRequestBtn = document.getElementById('sendRequestBtn');
const closeSendRequestFormBtn = document.getElementById('closeSendRequestFormBtn');
const sendRequestSubmitBtn = document.getElementById('sendRequestSubmitBtn');
const requestEmailInput = document.getElementById('requestEmail');
const receivedRequestsContainer = document.getElementById('receivedRequestsContainer');
const receivedRequestsOuterContainer = document.getElementById('receivedRequestsOuterContainer');
const showRequestHistoryBtn = document.getElementById('showRequestHistoryBtn');
const closeRequestHistoryBtn = document.getElementById('closeRequestHistoryBtn');
const requestHistoryContainer = document.getElementById('requestHistoryContainer');
const receivedRequestsTableBody =  document.getElementById('receivedRequestsTableBody');
const sentRequestsTableBody = document.getElementById('sentRequestsTableBody');
// Error/Success/Logout
const errorMsg = document.getElementById('errMsg');
const successMsg = document.getElementById('successMsg');
const logoutBtn = document.getElementById('logoutBtn');

//user info
function showUserInfoInDOM(){
    usernameNav.innerText = USERNAME.charAt(0).toUpperCase() + USERNAME.slice(1);
}

//group members
function deleteGroupMember(memberEmail, memberDiv){
    axios.delete(`${ORIGIN}/group/admin/removeGroupMember?groupId=${CURRENT_GROUP_ID}&email=${memberEmail}`, 
    { headers: {Authorization: token} })
    .then((res) => {
        const msg = res.data.msg;
        showSuccessInDOM(msg, 5000);
        groupMembersContainer.removeChild(memberDiv);
    })
    .catch((err) => {
        let msg = "Could not delete group member :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

function addGroupMemberInDOM(member, admin){
    const div = document.createElement('div');
    div.className = 'p-1';

    if(member.email === admin.email){
        div.innerText = member.username + ' : Admin';
    }else{
        div.innerText = member.username;
    }

    if(EMAIL === admin.email && EMAIL !== member.email){
        const removeMemberBtn = document.createElement('button');
        removeMemberBtn.innerText = 'Remove';
        removeMemberBtn.className = 'btn btn-sm btn-danger ms-2';

        div.appendChild(removeMemberBtn);

        removeMemberBtn.addEventListener('click', () => deleteGroupMember(member.email, div));
    }

    groupMembersContainer.appendChild(div);
}

function getGroupMembers(){
    if(!CURRENT_GROUP_ID){
        showErrorInDOM('Please select a group!');
        return;
    }

    axios.get(`${ORIGIN}/group/members?groupId=${CURRENT_GROUP_ID}`, { headers: {Authorization: token} })
    .then((res) => {
        const members = res.data.members;
        const admin = res.data.admin.user;
        groupMembersOuterContainer.style.display = 'block';
        groupMembersContainer.innerText = '';
        members.forEach((member) => addGroupMemberInDOM(member, admin));
    })
    .catch((err) => {
        let msg = "Could not fetch group members :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

//groups
function addGroupInDOM(group){
    const groupBtn = document.createElement('button');
    groupBtn.innerText = group.groupName;
    groupBtn.id = group.id;
    groupBtn.className = 'btn btn-sm btn-outline-primary me-1';

    groupBtn.addEventListener('click', (e) => {
        groupMembersOuterContainer.style.display = 'none'
        const groupBtnClicked = e.target;
        CURRENT_GROUP_ID = groupBtnClicked.id;
        const groupBtns = groupsContainer.children;
        for(gb of groupBtns){
            gb.classList.remove('active');
        }
        groupBtnClicked.classList.add('active');

        getGroupChats(groupBtnClicked.id);
    });

    groupsContainer.appendChild(groupBtn);
}

function getGroups(){
    axios.get(`${ORIGIN}/user/groups`, { headers: {Authorization: token} })
    .then((res) => {
        const groups = res.data;

        groupsContainer.innerText = '';
        groups.forEach((group) => addGroupInDOM(group));
    })
    .catch((err) => {
        let msg = "Could not fetch user's groups :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

function createGroup(e){
    e.preventDefault();

    if(groupNameInput.value === ''){
        showErrorInDOM('Enter group name!');
        showErrorInInputFieldInDOM(groupNameInput);
        return;
    }

    const group = {
        groupName: groupNameInput.value
    };
    
    axios.post(`${ORIGIN}/user/createGroup`, group, { headers: {Authorization: token} })
    .then((res) => {
        const group = res.data;
        addGroupInDOM(group);
        showSuccessInDOM('Group Created!');
        groupNameInput.value = '';
        createGroupContainer.style.display = 'none';
    })
    .catch((err) => {
        let msg = "Could not create group :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

function leaveGroup(){
    if(!CURRENT_GROUP_ID){
        showErrorInDOM('Please select a group!');
        return;
    }

    axios.delete(`${ORIGIN}/group/leaveGroup?groupId=${CURRENT_GROUP_ID}`, { headers: {Authorization: token} })
    .then((res) => {
        const msg = res.data.msg;
        showSuccessInDOM(msg, 5000);
    })
    .catch((err) => {
        let msg = "Could not leave group :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

//chats
function addChatInDOM(chat){
    const message = chat.message;
    const dateTime = chat.createdAt;
    const username = chat.user.username;

    const div = document.createElement('div');
    const div2 = document.createElement('div');

    const sub = document.createElement('sub');
    sub.innerText = convertToTime(dateTime, 'HHMM');
    sub.className = 'ms-1';

    if(USERNAME === username){
        div2.innerText = `${message}`;
        div.className = 'd-flex flex-row-reverse my-1';
        div2.className = 'rounded bg-success text-light px-2 py-1';
    }else{
        div2.innerText = `${username}: ${message}`;
        div.className = 'd-flex flex-row my-1';
        div2.className = 'rounded bg-secondary text-light px-2 py-1';
    }

    div2.appendChild(sub);
    div.appendChild(div2);
    chatList.appendChild(div);
}

function getGroupChats(groupId){
    const storedChatsArr = localStorage.getItem('storedChatsArr') ? JSON.parse(localStorage.getItem('storedChatsArr')) : [];
    const oldGroupChatsObjArr = storedChatsArr.filter((oldGroupChatObj) => oldGroupChatObj.groupId === groupId);
    const oldGroupChatsObj =  oldGroupChatsObjArr.length > 0 ? oldGroupChatsObjArr[0] : { groupId , chats: [] };
    if(oldGroupChatsObjArr.length === 0){
        storedChatsArr.push(oldGroupChatsObj);
    }
    const oldGroupChats = oldGroupChatsObj.chats;
    const lastMessageId = oldGroupChats.length > 0 ? oldGroupChats[oldGroupChats.length-1].id : -1;

    axios.get(`${ORIGIN}/group/chats?groupId=${groupId}&lastmsgid=${lastMessageId}`, { headers: {Authorization: token} })
    .then((res) => {
        const newGroupChats = res.data;

        const totalGroupChats = [...oldGroupChats, ...newGroupChats];
        const latestGroupChats = totalGroupChats.length > STORED_CHATS_LENGTH ? 
            totalGroupChats.slice(totalGroupChats.length - STORED_CHATS_LENGTH) : totalGroupChats;
        storedChatsArr.forEach((oldGroupChatObj) => {
            if(oldGroupChatObj.groupId === groupId){
                oldGroupChatObj.chats = latestGroupChats;
            }
        });
        localStorage.setItem('storedChatsArr', JSON.stringify(storedChatsArr));

        chatList.innerText = '';
        latestGroupChats.forEach((chat) => addChatInDOM(chat));
    })
    .catch((err) => {
        let msg = "Could not fetch group chats :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

function createChatInGroup(){
    if(CURRENT_GROUP_ID == null){
        showErrorInDOM('Please select a group!');
        return;
    }

    if(messageInput.value === ''){
        showErrorInDOM('Please enter message!');
        showErrorInInputFieldInDOM(messageInput);
        return;
    }

    const chat = {
        message: messageInput.value
    };

    axios.post(`${ORIGIN}/group/addChat?groupId=${CURRENT_GROUP_ID}`, chat, { headers: {Authorization: token} })
    .then((res) => {
        const message = res.data.message;
        const timeStamp = res.data.createdAt;

        const chat = {
            message,
            createdAt: timeStamp,
            user: { username: USERNAME }
        };

        addChatInDOM(chat);

        messageInput.value = '';
    })
    .catch((err) => {
        let msg = "Could not add chat :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

// Requests
function sendRequest(e){
    e.preventDefault();

    if(CURRENT_GROUP_ID == null){
        showErrorInDOM('Please select a group');
        return;
    }

    if(requestEmailInput.value === ''){
        showErrorInDOM('Enter receiver email!');
        showErrorInInputFieldInDOM(requestEmailInput);
        return;
    }

    const request = {
        email: requestEmailInput.value
    };

    axios.post(`${ORIGIN}/group/generateRequest?groupId=${CURRENT_GROUP_ID}`, request, { headers: {Authorization: token} })
    .then((res) => {
        const request = res.data;
        showSuccessInDOM('Request sent!');
        requestEmailInput.value = '';
        sendRequestContainer.style.display = 'none';
    })
    .catch((err) => {
        let msg = "Could not send group request :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

function confirmRequest(groupId, status, RequestDiv){
    const confirmation = {
        status
    };
    
    axios.post(`${ORIGIN}/user/confirmGroupRequest?groupId=${groupId}`, confirmation, { headers: {Authorization: token} })
    .then((res) => {
        const status = res.data.msg;
        if(status === 'accepted'){
            showSuccessInDOM('Request accepted!');
        }else{
            showSuccessInDOM('Request rejected!');
        }
        receivedRequestsContainer.removeChild(RequestDiv);
    })
    .catch((err) => {
        let msg = "Could not confirm request :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

function addRequestInDOM(request){
    const groupId = request.group.id;
    const groupName = request.group.groupName;
    const username = request.user.username;

    const div = document.createElement('div');
    div.innerText = `Accept the request to join the group "${groupName}" sent by user "${username}" ?`;
    div.id= groupId;

    const acceptRequestBtn = document.createElement('button');
    acceptRequestBtn.innerText = 'Accept';
    acceptRequestBtn.className = 'btn btn-sm btn-outline-success mx-1';
    acceptRequestBtn.addEventListener('click', () => confirmRequest(groupId, 'accepted', div));

    const rejectRequestBtn = document.createElement('button');
    rejectRequestBtn.innerText = 'Reject';
    rejectRequestBtn.className = 'btn btn-sm btn-outline-danger mx-1';
    rejectRequestBtn.addEventListener('click', () => confirmRequest(groupId, 'rejected', div));

    div.appendChild(acceptRequestBtn);
    div.appendChild(rejectRequestBtn);
    receivedRequestsContainer.appendChild(div);
}

function getPendingRequests(){
    axios.get(`${ORIGIN}/user/pendingGroupRequests`, { headers: {Authorization: token} })
    .then((res) => {
        const requests = res.data;
        receivedRequestsContainer.innerText = '';
        if(requests.length === 0){
            receivedRequestsContainer.innerText = 'No received requests';
            return;
        }
        requests.forEach((request) => addRequestInDOM(request));
    })
    .catch((err) => {
        let msg = "Could not fetch group requests :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

function addReceivedRequestHistoryInDOM(request){
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${request.user.username}</td>
        <td>${request.user.email}</td>
        <td>${request.group.groupName}</td>
        <td>${request.status}</td>
        <td>${convertToDate(request.createdAt)}</td>
        <td>${convertToTime(request.createdAt)}</td>
    `;

    receivedRequestsTableBody.appendChild(tr);
}

function addSentRequestHistoryInDOM(request){
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${request.email}</td>
        <td>${request.group.groupName}</td>
        <td>${request.status}</td>
        <td>${convertToDate(request.createdAt)}</td>
        <td>${convertToTime(request.createdAt)}</td>
    `;

    sentRequestsTableBody.appendChild(tr);
}

function getRequestHistory(){
    axios.get(`${ORIGIN}/user/requestHistory`, { headers: {Authorization: token} })
    .then((res) => {
        const { receivedRequests, sentRequests} = res.data;
        receivedRequestsTableBody.innerText = '';
        if(receivedRequests){
            receivedRequests.forEach((receivedRequest) => addReceivedRequestHistoryInDOM(receivedRequest));
        }
        sentRequestsTableBody.innerText = '';
        if(sentRequests){
            sentRequests.forEach((sentRequest) => addSentRequestHistoryInDOM(sentRequest));
        }
    })
    .catch((err) => {
        let msg = "Could not fetch request history :(";
        if(err.response && err.response.data && err.response.data.msg){
            msg = err.response.data.msg;
        }
        showErrorInDOM(msg);
    });
}

// Basic
function convertToDate(dateTime){
    const dateArr = (new Date(dateTime)).toDateString().split(' ');
    return `${dateArr[2]}-${dateArr[1]}-${dateArr[3]}`; //DD-mon-YYYY
}

function convertToTime(dateTime, mode='HHMMSS'){
    const timeArr = (new Date(dateTime)).toTimeString().split(' ');
    if(mode === 'HHMM'){
        const timeArr2 = timeArr[0].split(':');
        return `${timeArr2[0]}:${timeArr2[1]}`; //HH:MM
    }
    return timeArr[0]; //HH:MM:SS
}

function logout(){
    if(confirm('Are you sure you want to logout ?')){
        localStorage.clear();
        window.location.href = '/';
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showSuccessInDOM(msg, time=3000){
    successMsg.innerText = msg;
    setTimeout(() => successMsg.innerText = '', time);
}

function showErrorInDOM(msg, time=3000){
    errorMsg.innerText = msg;
    setTimeout(() => errorMsg.innerText = '', time);
}

function showErrorInInputFieldInDOM(inputField){
    const oldBorderColor = inputField.style.borderColor;
    inputField.style.borderColor = 'red';
    setTimeout(() => inputField.style.borderColor = oldBorderColor, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
    showUserInfoInDOM();
    getGroups();
    // Logout
    logoutBtn.addEventListener('click', logout);
    // Chats
    sendBtn.addEventListener('click', createChatInGroup);
    // Groups
    createGroupBtn.addEventListener('click', () => createGroupContainer.style.display = 'block');
    closeCreateGroupFormBtn.addEventListener('click', () => createGroupContainer.style.display = 'none');
    createGroupSubmitBtn.addEventListener('click', createGroup);
    leaveGroupBtn.addEventListener('click', leaveGroup);
    // Group Members
    showGroupMembersBtn.addEventListener('click', getGroupMembers);
    closeGroupMembersBtn.addEventListener('click', () => groupMembersOuterContainer.style.display = 'none');
    // Requests
    receivedRequestsBtn.addEventListener('click', () => {
        getPendingRequests();
        receivedRequestsOuterContainer.style.display = 'block';
    });
    closeReceivedRequestsBtn.addEventListener('click', () => receivedRequestsOuterContainer.style.display = 'none');
    sendRequestBtn.addEventListener('click', () => sendRequestContainer.style.display = 'block');
    closeSendRequestFormBtn.addEventListener('click', () => sendRequestContainer.style.display = 'none');
    sendRequestSubmitBtn.addEventListener('click', sendRequest);
    showRequestHistoryBtn.addEventListener('click', () => {
        requestHistoryContainer.style.display = 'block';
        getRequestHistory();
    });
    closeRequestHistoryBtn.addEventListener('click', () => requestHistoryContainer.style.display = 'none');
});