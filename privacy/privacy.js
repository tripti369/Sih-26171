console.log("Privacy filter loaded");

function sanitizeImage(imageUrl, sensitiveRegions) {

    return new Promise((resolve, reject) => {

        const image = new Image();

        image.onload = () => {

            const canvas = document.createElement("canvas");

            canvas.width = image.width;
            canvas.height = image.height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(image, 0, 0);

            sensitiveRegions.forEach((region) => {

                ctx.fillStyle = "#000000";

                ctx.fillRect(
                    region.x,
                    region.y,
                    region.width,
                    region.height
                );

            });

            resolve(
                canvas.toDataURL("image/png")
            );
        };

        image.onerror = () => {
            reject(
                new Error("Could not load screenshot")
            );
        };

        image.src = imageUrl;
    });
}