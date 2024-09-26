window.onload = function () {
    const today = new Date();
    const month = today.getMonth();

    if (month != 8) {
        document.getElementById("answer").innerHTML = "It's basically September";
    } else if (month == 8) {
        const day = today.getDate();
        if (day < 23) {
            document.getElementById("answer").innerHTML = "It's barely September";
        } else {
            document.getElementById("answer").innerHTML = "It's thoroughly September";
        }

        if (day == 12) {
            const subtitle = document.createElement("small");
            subtitle.innerHTML = "It's also my birthday! &#129395;";
            subtitle.id = "subtitle";
            document.getElementById("container-text").appendChild(subtitle);
        }
    }
}