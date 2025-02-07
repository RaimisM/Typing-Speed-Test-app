export async function fetchPoem() {
    try {
        const response = await fetch("https://poetrydb.org/random/100");
        const data = await response.json();

        if (data.length > 0) {
            const poem = data[0];
            console.log(poem);

            const poemLines = poem.lines || [];

            if (poemLines.length < 10) {
                throw new Error("Poem must have at least 10 lines.");
            }

            const container = document.getElementById("text-container");
            const inputArea = document.getElementById("input-area");

            container.innerHTML = "";
            container.style.overflowX = "auto";
            container.style.overflowY = "hidden";
            container.style.whiteSpace = "nowrap";
            container.style.display = "block";

            // Function to update the poem display
            function updatePoemDisplay() {
                container.innerHTML = "";

                const fullPoem = poemLines.join("");
                const textElement = document.createElement("p");
                textElement.textContent = fullPoem;
                textElement.classList.add("poem-line");
                container.appendChild(textElement);
                container.scrollTop = container.scrollHeight;
            }

            function handleInput(event) {
                setTimeout(() => {
                    const lines = inputArea.value.split("\n");
                    const lastLine = lines[lines.length - 1];

                    if (lastLine) {
                        const tempSpan = document.createElement('span');
                        tempSpan.textContent = lastLine.slice(-1);
                        tempSpan.style.backgroundColor = 'red';
                        inputArea.appendChild(tempSpan);
                        const rect = tempSpan.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        inputArea.removeChild(tempSpan);

                        if (rect.right > containerRect.right) {
                        }
                    }
                }, 0);
            }

            inputArea.addEventListener("input", handleInput);

            updatePoemDisplay();
        } else {
            throw new Error("No poem found");
        }
    } catch (error) {
        console.error("Error fetching poem:", error);
    }
}
