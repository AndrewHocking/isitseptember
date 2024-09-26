window.onload = function () {
    let today = new Date();
    let month = today.getMonth();

    if (month != 8) {
        document.getElementById("answer").innerHTML = "It's basically September";
    } else if (month == 8) {
        let day = today.getDate();
        if (day < 23) {
            document.getElementById("answer").innerHTML = "It's barely September";
        } else {
            document.getElementById("answer").innerHTML = "It's thoroughly September";
        }
    }
}