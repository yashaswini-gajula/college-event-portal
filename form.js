function submitEvent() {
    const eventData = {
        clubName: document.getElementById("clubName").value,
        eventName: document.getElementById("eventName").value,
        clubDesc: document.getElementById("clubDesc").value,
        eventDesc: document.getElementById("eventDesc").value,
        venue: document.getElementById("venue").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        regLink: document.getElementById("regLink").value
    };
    if (!eventData.eventName || !eventData.venue || !eventData.date || !eventData.time) {
        alert("Please fill all required fields ❌");
        return;
    }

    fetch("http://localhost:3000/addEvent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        window.location.href = "clubDashboard.html";
    }).catch(err => {
        console.error(err);
        alert("Error submitting event");
    });
}
