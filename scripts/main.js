import { fetchPoem } from "./api.js";
import { typingChecker } from "./typing.js";

async function init() {
    await fetchPoem();
    typingChecker();
}

document.addEventListener("DOMContentLoaded", init);
