document.addEventListener("DOMContentLoaded", async () => {

    const data = await chrome.storage.local.get([
        "sanitizedImage",
        "task",
        "action",
        "target",
        "confidence",
        "sensitiveCount",
        "tabId"
    ]);

    const image = document.getElementById("sanitizedImage");
    const task = document.getElementById("task");
    const privacyInfo = document.getElementById("privacyInfo");
    const actionBox = document.getElementById("action");
    const executeButton = document.getElementById("execute");
    const status = document.getElementById("status");


    // IMAGE
    if (data.sanitizedImage) {
        image.src = data.sanitizedImage;
    } else {
        image.alt = "Sanitized screenshot unavailable";
    }


    // TASK
    task.innerText =
        data.task || "Unknown task";


    // PRIVACY
    privacyInfo.innerText =
        `${data.sensitiveCount || 0} sensitive region(s) sanitized locally before server processing.`;


    // ACTION
    actionBox.innerHTML = `
        <b>Action:</b> ${data.action || "Unknown"}
        <br>
        <b>Target:</b> ${data.target || "Unknown"}
        <br>
        <b>Confidence:</b> ${data.confidence ?? "N/A"}
    `;


    // EXECUTE
    executeButton.addEventListener("click", async () => {

        executeButton.disabled = true;

        status.innerText =
            "⚙ Executing browser action...";

        try {

            if (!data.tabId) {
                throw new Error(
                    "Original browser tab not found."
                );
            }


            const response = await sendMessage({

                type: "BACKEND_ACTION",

                tabId: data.tabId,

                action: data.action,

                target: data.target

            });


            console.log(
                "Action execution response:",
                response
            );


            if (!response || !response.success) {

                throw new Error(
                    response?.error ||
                    "Action execution failed."
                );

            }


            status.innerText =
                "✓ Action executed successfully.";

            executeButton.innerText =
                "✓ Action Executed";


            // WAIT FOR FORM SUBMISSION
            setTimeout(async () => {

                try {

                    // Find current result page
                    const currentTabs =
                        await chrome.tabs.query({
                            active: true,
                            currentWindow: true
                        });


                    // Activate original page
                    await chrome.tabs.update(
                        data.tabId,
                        {
                            active: true
                        }
                    );


                    // Focus its window
                    const originalTab =
                        await chrome.tabs.get(
                            data.tabId
                        );

                    await chrome.windows.update(
                        originalTab.windowId,
                        {
                            focused: true
                        }
                    );


                    // Close result page
                    if (
                        currentTabs.length > 0 &&
                        currentTabs[0].id
                    ) {

                        await chrome.tabs.remove(
                            currentTabs[0].id
                        );

                    }

                } catch (error) {

                    console.error(
                        "Return navigation error:",
                        error
                    );

                }

            }, 1000);


        } catch (error) {

            console.error(
                "Execution error:",
                error
            );

            status.innerText =
                "❌ " + error.message;

            executeButton.disabled =
                false;

        }

    });

});


// ======================================
// MESSAGE HELPER
// ======================================

function sendMessage(message) {

    return new Promise((resolve, reject) => {

        chrome.runtime.sendMessage(
            message,
            response => {

                if (chrome.runtime.lastError) {

                    reject(
                        new Error(
                            chrome.runtime.lastError.message
                        )
                    );

                    return;
                }

                resolve(response);

            }
        );

    });

}