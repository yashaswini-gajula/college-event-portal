/* ---------------- WELCOME NAME ---------------- */

const name = localStorage.getItem("studentName");

if(name){
document.getElementById("welcome").innerText = "Welcome " + name + " 🎓";
}

/* ---------------- LOAD EVENTS ---------------- */

fetch("https://college-event-portal-hrt9.onrender.com/getEvents")

.then(res => res.json())

.then(events => {

let list = document.getElementById("eventList");

list.innerHTML = "";

events.forEach(event => {

let li = document.createElement("li");

li.innerHTML = `

<strong>${event.eventName}</strong><br>

Club: ${event.clubName}<br>

Venue: ${event.venue}<br>

Date: ${event.date}<br>

Time: ${event.time}<br>

<p id="count-${event._id}"></p><button onclick="registerEvent('${event._id}')">
Register Here
</button><hr>`;

list.appendChild(li);

/* load student count */

loadCount(event._id);

});

});

/* ---------------- REGISTER EVENT ---------------- */

function registerEvent(eventId){

let studentEmail = localStorage.getItem("studentEmail");

fetch("https://college-event-portal-hrt9.onrender.com/registerEvent",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
studentEmail:studentEmail,
eventId:eventId
})

})

.then(res=>res.json())

.then(data=>{

alert(data.message);

/* refresh count */

loadCount(eventId);

/* refresh my events */

loadMyEvents();

});

}

/* ---------------- LOAD REGISTRATION COUNT ---------------- */

function loadCount(eventId){

fetch("https://college-event-portal-hrt9.onrender.com/eventCount/"+eventId)

.then(res=>res.json())

.then(data=>{

document.getElementById("count-"+eventId).innerHTML =
data.count + " students registered";

});

}

/* ---------------- LOAD MY REGISTERED EVENTS ---------------- */

function loadMyEvents(){

let email = localStorage.getItem("studentEmail");

fetch("https://college-event-portal-hrt9.onrender.com/myEvents/"+email)

.then(res=>res.json())

.then(events=>{

let myList = document.getElementById("myEvents");

myList.innerHTML="";

if(events.length === 0){

myList.innerHTML="<p>No registrations yet</p>";
return;

}

events.forEach(event=>{

let li=document.createElement("li");

li.innerHTML=`
<strong>${event.eventName}</strong><br>
Club: ${event.clubName}<br>
Date: ${event.date}<br>
Venue: ${event.venue}

<hr>
`;myList.appendChild(li);

});

});

}

/* ---------------- CALL WHEN PAGE LOADS ---------------- */

loadMyEvents();
