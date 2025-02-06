import { fetchPoem } from "./api.js";

function init() {
    const textContainer = document.getElementById("text-container");
    fetchPoem(textContainer);
}

init();