var input = document.querySelector(".input-box")
var output = document.querySelector(".output-box")
var button = document.querySelector(".translate-btn")
var url = "https://api.funtranslations.com/translate/ferb-latin.json"

button.addEventListener("click", eventHandler);

function constructURL(text) {
    return url + "?text=" + encodeURI(text);
}

function setLoading(isLoading) {
    button.disabled = isLoading;
    button.style.opacity = isLoading ? "0.7" : "1";
    button.textContent = isLoading ? "Translating..." : "Translate";
    input.disabled = isLoading;
    output.disabled = true;
}

function handleError(error) {
    if (error.response && error.response.status === 429) {
        alert("Too many translations! Please wait a minute and try again (API limit: 10 requests per hour).");
    } else {
        alert("Oops! Something went wrong. Please try again.");
    }
}

async function eventHandler() {
    const text = input.value.trim();
    
    if (!text) {
        alert("Please enter some text to translate!");
        return;
    }

    setLoading(true);
    output.value = "Translating...";

    try {
        const response = await fetch(constructURL(text));
        const data = await response.json();
        
        if (data.error) {
            throw { response: { status: data.error.code, message: data.error.message } };
        }
        
        output.value = data.contents.translated;
    } catch (error) {
        handleError(error);
        output.value = "";
    } finally {
        setLoading(false);
    }
}