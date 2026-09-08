const runButton = document.getElementById("runTask");
const taskInput = document.getElementById("task");
const status = document.getElementById("status");
const screenshot = document.getElementById("screenshot");
const resultBox = document.getElementById("result");


runButton.addEventListener("click", async () => {

    const task = taskInput.value.trim();

    if (!task) {
        status.innerText = "Please enter a task.";
        return;
    }

    runButton.disabled = true;

    try {

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tab || !tab.id) {
            throw new Error("Active tab not found.");
        }


        // ==========================================
        // 1. LOCAL SENSITIVE FIELD DETECTION
        // ==========================================

        status.innerText =
            "🔍 Detecting sensitive fields locally...";

        const detection = await sendToTab(
            tab.id,
            {
                type: "DETECT_SENSITIVE_FIELDS"
            }
        );

        if (!detection || !detection.success) {
            throw new Error(
                "Sensitive field detection failed."
            );
        }

        const regions =
            Array.isArray(detection.regions)
                ? detection.regions
                : [];


        // NEW:
        // Get webpage viewport dimensions
        const viewportWidth =
            detection.viewportWidth;

        const viewportHeight =
            detection.viewportHeight;


        console.log(
            "Sensitive regions detected:",
            regions
        );

        console.log(
            "Viewport:",
            viewportWidth,
            viewportHeight
        );


        // ==========================================
        // 2. CAPTURE SCREEN
        // ==========================================

        status.innerText =
            "📸 Capturing screen...";

        const capture =
            await sendRuntimeMessage({
                type: "CAPTURE_SCREEN",
                windowId: tab.windowId
            });

        if (!capture || !capture.success) {
            throw new Error(
                capture?.error ||
                "Screenshot failed."
            );
        }


        // ==========================================
        // 3. LOCAL SANITIZATION
        // ==========================================

        status.innerText =
            "🔒 Sanitizing sensitive information locally...";

        const sanitized =
            await sanitizeImage(
                capture.screenshot,
                regions,
                viewportWidth,
                viewportHeight
            );

        console.log(
            "Sanitized screenshot generated."
        );


        // SHOW SANITIZED SCREENSHOT
        screenshot.src = sanitized;
        screenshot.style.display = "block";


        status.innerText =
            `✓ ${regions.length} sensitive region(s) sanitized locally.`;


        // ==========================================
        // 4. SEND ONLY SANITIZED IMAGE TO BACKEND
        // ==========================================

        status.innerText =
            "☁ Sending sanitized screenshot to server...";

        const serverResponse =
            await fetch(
                "http://127.0.0.1:8000/analyze",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        task: task,
                        image: sanitized
                    })
                }
            );


        if (!serverResponse.ok) {

            throw new Error(
                `Server returned ${serverResponse.status}`
            );
        }


        const result =
            await serverResponse.json();

        console.log(
            "Backend response:",
            result
        );


        // ==========================================
        // 5. DISPLAY BACKEND RESULT
        // ==========================================

        resultBox.innerHTML = `
            <b>Agent Response</b><br><br>

            Action:
            <strong>${result.action || "unknown"}</strong>
            <br>

            Target:
            <strong>${result.target || "unknown"}</strong>
            <br>

            Confidence:
            <strong>${result.confidence ?? "N/A"}</strong>
        `;

        resultBox.style.display = "block";


        // ==========================================
        // 6. SAVE RESULT
        // ==========================================

        if (
            chrome.storage &&
            chrome.storage.local
        ) {

            await chrome.storage.local.set({

                sanitizedImage: sanitized,

                task: task,

                action:
                    result.action || "unknown",

                target:
                    result.target || "unknown",

                confidence:
                    result.confidence ?? 0,

                sensitiveCount:
                    regions.length,

                tabId:
                    tab.id
            });

            console.log(
                "Result saved to chrome.storage.local"
            );

        } else {

            console.warn(
                "chrome.storage.local unavailable."
            );
        }


        // ==========================================
        // 7. OPEN RESULT PAGE
        // ==========================================

        status.innerText =
            "✓ Analysis complete. Opening review...";


        await chrome.tabs.create({

            url: chrome.runtime.getURL(
                "popup/result.html"
            )
        });


        // ==========================================
        // IMPORTANT
        // DO NOT SUBMIT FORM HERE
        // ==========================================

        console.log(
            "Waiting for user review before action."
        );

    }

    catch (error) {

        console.error(
            "Workflow error:",
            error
        );

        status.innerText =
            "❌ " + error.message;

    }

    finally {

        runButton.disabled = false;
    }

});


// ==================================================
// SEND MESSAGE TO BACKGROUND
// ==================================================

function sendRuntimeMessage(message) {

    return new Promise((resolve, reject) => {

        chrome.runtime.sendMessage(
            message,
            (response) => {

                if (chrome.runtime.lastError) {

                    reject(
                        new Error(
                            chrome.runtime
                                .lastError
                                .message
                        )
                    );

                    return;
                }

                resolve(response);
            }
        );
    });
}


// ==================================================
// SEND MESSAGE TO CONTENT SCRIPT
// ==================================================

function sendToTab(tabId, message) {

    return new Promise((resolve, reject) => {

        chrome.tabs.sendMessage(
            tabId,
            message,
            (response) => {

                if (chrome.runtime.lastError) {

                    reject(
                        new Error(
                            chrome.runtime
                                .lastError
                                .message
                        )
                    );

                    return;
                }

                resolve(response);
            }
        );
    });
}


// ==================================================
// SANITIZE IMAGE
// ==================================================

function sanitizeImage(
    imageUrl,
    regions,
    viewportWidth,
    viewportHeight
) {

    return new Promise((resolve, reject) => {

        const image = new Image();

        image.onload = () => {

            const canvas =
                document.createElement("canvas");

            canvas.width =
                image.width;

            canvas.height =
                image.height;


            const ctx =
                canvas.getContext("2d");

            ctx.drawImage(
                image,
                0,
                0
            );


            // ==================================
            // IMPORTANT COORDINATE MAPPING
            // ==================================

            const scaleX =
                image.width /
                viewportWidth;

            const scaleY =
                image.height /
                viewportHeight;


            console.log(
                "Screenshot dimensions:",
                image.width,
                image.height
            );

            console.log(
                "Viewport dimensions:",
                viewportWidth,
                viewportHeight
            );

            console.log(
                "Sanitization scale:",
                scaleX,
                scaleY
            );


            regions.forEach(region => {

                const x =
                    region.x * scaleX;

                const y =
                    region.y * scaleY;

                const width =
                    region.width * scaleX;

                const height =
                    region.height * scaleY;


                console.log(
                    "Sanitizing region:",
                    {
                        x,
                        y,
                        width,
                        height
                    }
                );


                ctx.fillStyle =
                    "black";

                ctx.fillRect(

                    x,

                    y,

                    width,

                    height

                );

            });


            resolve(
                canvas.toDataURL(
                    "image/png"
                )
            );
        };


        image.onerror = () => {

            reject(
                new Error(
                    "Could not load screenshot."
                )
            );
        };


        image.src = imageUrl;

    });
}