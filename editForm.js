// Load existing event data
let index = localStorage.getItem("editIndex");

fetch("https://college-event-portal-hrt9.onrender.com/getEvents")
.then(res => res.json())
.then(events => {
    let event = events[index];

    if(event){
        document.getElementById("editTitle").innerText =
        "Editing: " + (event.eventName || "Unnamed Event");
        document.getElementById("clubName").value = event.clubName ;
    document.getElementById("eventName").value = event.eventName ;
    document.getElementById("clubDesc").value = event.clubDesc ;
    document.getElementById("eventDesc").value = event.eventDesc;
        document.getElementById("Venue").value = event.venue;
        document.getElementById("Date").value = event.date;
        document.getElementById("Time").value = event.time;
        document.getElementById("link").value = event.link ;
    }
});

// Update event
function updateEvent() {
    let index = localStorage.getItem("editIndex");

    const updatedEvent = {
        clubName: document.getElementById("clubName").value,
        eventName: document.getElementById("eventName").value,
        clubDesc: document.getElementById("clubDesc").value,
        eventDesc: document.getElementById("eventDesc").value,
        venue: document.getElementById("Venue").value,
        date: document.getElementById("Date").value,
        time:document.getElementById("Time").value,
        link: document.getElementById("link").value
    
    };

    fetch(`https://college-event-portal-hrt9.onrender.com/updateEvent/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        window.location.href = "/updateEvent.html";
    })
    .catch(err => {
        console.log(err);
        alert("Error updating event ❌");
    });
}
