window.onload = function () {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();

    if (month < 5 || month > 9) { // November - May
        document.getElementById("answer").innerHTML = "It's basically September";
    } else if (month < 6) { // June
        document.getElementById("answer").innerHTML = "It's basically almost September";
    } else if (month < 7) { // July
        if (day < 15) {
            document.getElementById("answer").innerHTML = "It's almost September";
        } else {
            document.getElementById("answer").innerHTML = "It's almost nearly September";
        }
    } else if (month < 8) { // August
        if (day < 15) {
            document.getElementById("answer").innerHTML = "It's nearly September";
        } else {
            document.getElementById("answer").innerHTML = "It's nearly actually September";
        }
    } else if (month == 8) { // September
        if (day == 1) {
            document.getElementById("answer").innerHTML = "It's actually September";
        } else if (day < 23) {
            document.getElementById("answer").innerHTML = "It's barely September";
        } else if (day < 27) {
            document.getElementById("answer").innerHTML = "It's thoroughly September";
        } else {
            document.getElementById("answer").innerHTML = "It's still September";
        }

        if (day == 12) {
            document.getElementById("subtitle").innerHTML = "It's also my birthday! &#129395;";
        }
    } else if (month == 9) { // October
        if (day < 5) {
            document.getElementById("answer").innerHTML = "It's basically still September";
        } else if (day == 6) {
            document.getElementById("answer").innerHTML = "It's almost basically September";
        } else {
            document.getElementById("answer").innerHTML = "It's basically September";
        }
    }
}