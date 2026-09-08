console.log("Privacy Vision Agent content script loaded");


// ======================================
// SENSITIVE FIELD DETECTION
// ======================================

function detectSensitiveFields() {

    const regions = [];

    const fields = document.querySelectorAll(
        "input, textarea, select"
    );

    fields.forEach((field) => {

        const rect = field.getBoundingClientRect();

        // Ignore invisible / tiny elements
        if (
            rect.width < 20 ||
            rect.height < 10
        ) {
            return;
        }

        if (
            rect.bottom < 0 ||
            rect.right < 0 ||
            rect.top > window.innerHeight ||
            rect.left > window.innerWidth
        ) {
            return;
        }


        const type =
            (field.type || "").toLowerCase();

        const name =
            (field.name || "").toLowerCase();

        const id =
            (field.id || "").toLowerCase();

        const placeholder =
            (field.placeholder || "").toLowerCase();

        const autocomplete =
            (field.autocomplete || "").toLowerCase();


        // Find associated label
        let labelText = "";

        if (field.id) {

            const label =
                document.querySelector(
                    `label[for="${CSS.escape(field.id)}"]`
                );

            if (label) {
                labelText =
                    label.innerText.toLowerCase();
            }
        }


        const combined =
            `${type} ${name} ${id} ${placeholder} ${autocomplete} ${labelText}`;


        // ==================================
        // SENSITIVE FIELD RULES
        // ==================================

        const sensitive =
            type === "password" ||

            combined.includes("email") ||

            combined.includes("phone") ||

            combined.includes("mobile") ||

            combined.includes("address") ||

            combined.includes("name") ||

            combined.includes("student") ||

            combined.includes("employee") ||

            combined.includes("id") ||

            combined.includes("dob") ||

            combined.includes("date of birth") ||

            combined.includes("passport") ||

            combined.includes("aadhaar") ||

            combined.includes("pan") ||

            combined.includes("social security");


        if (sensitive) {

            regions.push({

                // IMPORTANT:
                // captureVisibleTab captures the visible viewport,
                // so do NOT add window.scrollX / scrollY here.

                x: Math.round(
                    rect.left
                ),

                y: Math.round(
                    rect.top
                ),

                width: Math.round(
                    rect.width
                ),

                height: Math.round(
                    rect.height
                )

            });

        }

    });


    console.log(
        "Sensitive fields detected:",
        regions
    );


    return regions;
}


// ======================================
// MESSAGE LISTENER
// ======================================

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {


        // ==================================
        // DETECT SENSITIVE FIELDS
        // ==================================

        if (
            message.type ===
            "DETECT_SENSITIVE_FIELDS"
        ) {

            try {

                const regions =
                    detectSensitiveFields();


                console.log(
                    "Returning sensitive regions:",
                    regions
                );


                sendResponse({

                    success: true,

                    regions: regions,

                    viewportWidth:
                        window.innerWidth,

                    viewportHeight:
                        window.innerHeight

                });

            } catch (error) {

                console.error(
                    "Sensitive detection error:",
                    error
                );


                sendResponse({

                    success: false,

                    error:
                        error.message

                });

            }


            return true;
        }


        // ==================================
        // EXECUTE BROWSER ACTION
        // ==================================

        if (
            message.type ===
            "EXECUTE_ACTION"
        ) {

            console.log(
                "Action received:",
                message.action,
                message.target
            );


            if (
                message.action === "click" &&
                message.target === "submit"
            ) {

                const submitButton =
                    document.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );


                if (!submitButton) {

                    console.error(
                        "Submit button not found."
                    );


                    sendResponse({

                        success: false,

                        error:
                            "Submit button not found."

                    });

                    return true;
                }


                console.log(
                    "Submit button found."
                );


                submitButton.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                setTimeout(() => {

                    console.log(
                        "Clicking submit button..."
                    );

                    submitButton.click();

                }, 300);


                sendResponse({

                    success: true,

                    message:
                        "Submit button clicked."

                });


                return true;
            }


            sendResponse({

                success: false,

                error:
                    `Unsupported action: ${message.action}`

            });


            return true;
        }

    }
);