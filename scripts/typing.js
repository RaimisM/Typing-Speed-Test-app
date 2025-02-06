export function typingChecker() {
    const textContainer = document.getElementById("text-container");
    const inputArea = document.getElementById("input-area");

    if (!textContainer || !inputArea) {
        console.error("Missing text container or input area");
        return;
    }

    const originalText = textContainer.innerText.trim();
    textContainer.innerHTML = "";

    originalText.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        textContainer.appendChild(span);
    });

    const spans = textContainer.querySelectorAll("span");

    inputArea.addEventListener("input", () => {
        const typedText = inputArea.value;
        spans.forEach((span, index) => {
            if (index < typedText.length) {
                if (typedText[index] === originalText[index]) {
                    span.style.backgroundColor = "lightgreen";
                    span.style.color = "white";
                } else {
                    span.style.backgroundColor = "lightcoral";
                    span.style.color = "white";
                }
            } else {
                span.style.backgroundColor = "transparent";
                span.style.color = "black";
            }
        });
    });
}
