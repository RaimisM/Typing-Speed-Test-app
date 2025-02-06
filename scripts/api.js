export async function fetchPoem() {
    try {
        const response = await fetch("https://poetrydb.org/random");
        const data = await response.json();
        if (data.length > 0) {
            const poem = data[0];
            const poemText = poem.lines.join("\n");
            const poemLines = poemText.split("\n");
            let currentIndent = 0;

            const container = document.getElementById("text-container");

            function nextTypingText() {
                const typingText = poemLines.slice(currentIndent, currentIndent + 1).join("\n");
                currentIndent++;

                const textElement = document.createElement("div");
                textElement.textContent = typingText;
                container.appendChild(textElement);

                if (currentIndent < poemLines.length) {
                    showMoreButton.style.display = "block";
                } else {
                    showMoreButton.style.display = "none";
                }
            }

            const showMoreButton = document.createElement("button");
            showMoreButton.textContent = "Show more";
            showMoreButton.style.display = "none";

            showMoreButton.addEventListener("click", () => {
                nextTypingText();

                if (currentIndent >= poemLines.length) {
                    showMoreButton.disabled = true;
                }
            });

            container.appendChild(showMoreButton);
            nextTypingText();
        } else {
            throw new Error("No poem found");
        }
    } catch (error) {
        console.error("Error fetching poem:", error);
    }
}
