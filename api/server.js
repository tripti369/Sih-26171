async function sendToServer(task, sanitizedImage) {

    const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            task: task,
            image: sanitizedImage
        })
    });

    if (!response.ok) {
        throw new Error(
            `Server error: ${response.status}`
        );
    }

    return await response.json();
}