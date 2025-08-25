async function loadRules() {
    try {
        const response = await fetch("assets/rules.json");
        const data = await response.json();
        return data.map(rule => {
            if (rule.start && rule.end) {
                const [startMonth, startDay] = rule.start.split("-").map(Number);
                const [endMonth, endDay] = rule.end.split("-").map(Number);
                rule.match = (m, d) => {
                    const current = m * 100 + d;
                    const start = startMonth * 100 + startDay;
                    const end = endMonth * 100 + endDay;
                    return current >= start && current <= end;
                };
            }
            return rule;
        });
    } catch (e) {
        console.error("Failed to load rules.json:", e);
        return [];
    }
}

function setTheme(theme) {
    document.getElementById("theme_stylesheet").setAttribute("href", `styles/themes/${theme}/theme.css`);
    document.getElementById("favicon").setAttribute("href", `styles/themes/${theme}/favicon.png`);
    localStorage.setItem("theme", theme);

    if (theme == "Arena") {
        document.getElementById("fighter-left-img").style.transform = "translateX(-200%) scale(-1, 1)";
        document.getElementById("fighter-right-img").style.transform = "translateX(200%) scale(1, 1)";
        document.getElementById("fighters").hidden = false;

        const hosts = [
            "brad",
            "casey",
            "jason",
            "kathy",
            "myke",
            "stephen"
        ]

        let leftHost = hosts[Math.floor(Math.random() * hosts.length)];
        let rightHost = leftHost;
        do {
            rightHost = hosts[Math.floor(Math.random() * hosts.length)];
        } while (rightHost === leftHost);

        setFighter("left", leftHost);
        setFighter("right", rightHost);
    } else {
        document.getElementById("fighters").hidden = true;
    }

    setTimeout(function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, 50); // It doesn't scroll sometimes for no reason I can discern, unless there is a very slight delay before scrolling ¯\_(ツ)_/¯
}

window.onload = function () {
    loadRules().then(rules => {
        const today = new Date();
        const month = today.getMonth() + 1; // Months are zero-indexed in JavaScript which is dumb and confusing so add one for clarity
        const day = today.getDate();

        let defaultAnswer = "It's basically September";
        let selectedAnswer = null;
        let selectedSubtitle = null;
        let selectedUpdate = null;

        for (const rule of rules) {
            if (rule.match(month, day)) {
                if (rule.answer) selectedAnswer = rule.answer;
                if (rule.subtitle) selectedSubtitle = rule.subtitle;
                if (rule.update) selectedUpdate = rule.update;
                break;
            }
        }

        document.getElementById("answer").innerHTML = selectedAnswer ?? defaultAnswer;
        if (selectedSubtitle) {
            document.getElementById("subtitle").innerHTML = selectedSubtitle;
        }
        if (selectedUpdate) {
            document.getElementById("update").innerHTML = selectedUpdate;
        }

        const defaultTheme = "Arena";

        let params = new URLSearchParams(document.location.search);
        let theme = params.get("theme") ?? localStorage.getItem("theme") ?? defaultTheme;

        const themePicker = document.getElementById("theme");
        themePicker.value = theme;
        setTheme(theme);

        themePicker.addEventListener("change", function () {
            const newTheme = themePicker.value;
            setTheme(newTheme);
        });
    });
};

Array.from(document.getElementsByClassName("fighter-img")).forEach(img => {
    let side = img.id.includes("left") ? "left" : "right";
    img.addEventListener("click", function () {
        img.style.transform = side == "left" ? "translateX(-200%) scale(-1, 1)" : "translateX(200%) scale(1, 1)";
        document.getElementById(`fighter-${side}-select`).hidden = false;
        setTimeout(function () {
            document.getElementById(`fighter-${side}-select`).style.transform = "translateX(0%)";
        }, 50);
    });
});

let gridItems = Array.from(document.getElementsByClassName("grid-item"));
function setFighter(side, name) {
    let oppositeSide = side == "left" ? "right" : "left";
    let oldName = null;
    let duplicatedCharacter = false;
    for (let item of gridItems) {
        if (item.classList.contains("selected")) {
            if (item.classList.contains(`${side}-grid-item`)) {
                item.classList.remove("selected");
                oldName = item.dataset.name;
            } else if (item.dataset.name == name) {
                duplicatedCharacter = true;
            }
        }
    }
    if (duplicatedCharacter) {
        document.getElementById(`fighter-${oppositeSide}-img`).style.transform = oppositeSide == "left" ? "translateX(-200%) scale(-1, 1)" : "translateX(200%) scale(1, 1)";
        setFighter(oppositeSide, oldName);
    }
    document.getElementById(`${side}-grid-item-${name}`).classList.add("selected");
    document.documentElement.style.setProperty(`--${side}-colour`, `var(--${name}-colour)`);

    setTimeout(function () {
        document.getElementById(`fighter-${side}-select`).style.transform = side == "left" ? "translateX(-500%)" : "translateX(500%)";
        setTimeout(function () {
            document.getElementById(`fighter-${side}-img`).src = `styles/themes/Arena/images/characters/fighting/${name}-fighting.png`;
            document.getElementById(`fighter-${side}-img`).style.transform = null;
        }, 400);
    }, 100);
}

gridItems.forEach(element => {
    let side = element.classList.contains("left-grid-item") ? "left" : "right";
    element.addEventListener("click", function () {
        setFighter(side, element.dataset.name);
    });
});
