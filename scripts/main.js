import { fetchPoem } from "./api.js";

async function displayPoem() {
    const poem = await fetchPoem();
    console.log(poem);
}

displayPoem();