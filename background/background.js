// ======================================
// PRIVACY VISION AGENT
// BACKGROUND SERVICE WORKER
// ======================================


// ======================================
// MESSAGE LISTENER
// ======================================

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {


        // ==================================
        // CAPTURE SCREEN
        // ==================================

        if (message.type === "CAPTURE_SCREEN") {

            chrome.tabs.captureVisibleTab(
                message.windowId,
                {
                    format: "png"
                },
                screenshotUrl => {

                    if (chrome.runtime.lastError) {

                        console.error(
                            "Screenshot error:",
                            chrome.runtime.lastError.message
                        );

                        sendResponse({
                            success: false,
                            error:
                                chrome.runtime.lastError.message
                        });

                        return;
                    }


                    console.log(
                        "Screenshot captured successfully."
                    );


                    sendResponse({

                        success: true,

                        screenshot:
                            screenshotUrl

                    });

                }
            );


            return true;
        }


        // ==================================
        // EXECUTE BROWSER ACTION
        // ==================================

        if (message.type === "BACKEND_ACTION") {

            console.log(
                "Executing backend action:",
                message.action,
                message.target
            );


            if (!message.tabId) {

                sendResponse({

                    success: false,

                    error:
                        "Target tab ID missing."

                });

                return true;
            }


            chrome.tabs.sendMessage(

                message.tabId,

                {

                    type:
                        "EXECUTE_ACTION",

                    action:
                        message.action,

                    target:
                        message.target

                },

                response => {

                    if (chrome.runtime.lastError) {

                        console.error(
                            "Content script error:",
                            chrome.runtime.lastError.message
                        );

                        sendResponse({

                            success: false,

                            error:
                                chrome.runtime.lastError.message

                        });

                        return;
                    }


                    console.log(
                        "Content script response:",
                        response
                    );


                    sendResponse({

                        success:
                            response?.success !== false,

                        message:
                            response?.message ||
                            "Browser action executed."

                    });

                }

            );


            return true;
        }

    }
);