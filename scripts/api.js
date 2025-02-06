export async function fetchPoem() {
    try {
        const response = await fetch("https://poetrydb.org/random");
        const data = await response.json();
        if (data.length > 0) {
            const poem = data[0];
            return poem.lines.join("\n");
        } else {
            return "No poem found.";
        }
    } catch (error) {
        console.error("Error fetching poem:", error);
    }
}

