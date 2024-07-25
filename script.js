// Get the canvas element and its context
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

// Create image objects for the background and overlay
const backgroundImage = new Image();
const overlayImage = new Image();
const pinImage = new Image();

// Set the source of the images
backgroundImage.src = 'Sky Ranch Tagaytay Map.png';
overlayImage.src = 'asset-01.png';
pinImage.src = 'pin.png'; // Set the source for the pin image


// Variables to store the overlay image position and dimensions
const overlayX = 69;
const overlayY = 222;
const overlayWidth = 129;
const overlayHeight = 138;

// Variables to control the beating animation
let scale = 1;
let growing = true;

// Variables to control the pin beating animation
let pinScale = 1;
let pinGrowing = true;


// Flag to indicate if we are hovering over the overlay image
let isHovering = false;

// Variable to store the pin position
let pinX = null;
let pinY = null;


// Draw the images on the canvas once they are fully loaded
backgroundImage.onload = function () {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    overlayImage.onload = function () {
        context.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);
    };
};
// Function to draw the canvas
function drawCanvas() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the background image
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // Save the current context state
    context.save();
    // Apply highlight effect if hovering
    if (isHovering) {
        context.filter = 'brightness(1.5)'; // Increase brightness for highlight effect
    } else {
        context.filter = 'none'; // Reset filter
    }
    // Calculate the center position for the beating effect
    const centerX = overlayX + overlayWidth / 2;
    const centerY = overlayY + overlayHeight / 2;
    context.translate(centerX, centerY);
    context.scale(scale, scale);
    context.translate(-centerX, -centerY);
    // Draw the overlay image
    context.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);
    // Restore the context to its original state
    context.restore();
    // Draw the pin image if it has been placed
    if (pinX !== null && pinY !== null) {
        context.save();
        const pinCenterX = pinX + 15; // Assuming pin image width is 30
        const pinCenterY = pinY + 15; // Assuming pin image height is 30
        context.translate(pinCenterX, pinCenterY);
        context.scale(pinScale, pinScale);
        context.translate(-pinCenterX, -pinCenterY);
        context.drawImage(pinImage, pinX, pinY, 30, 30); // Adjust the size of the pin image as needed
        context.restore();
    }
}

// Function to update the scale for the beating animation
function updateScale() {
    if (growing) {
        scale += 0.001;
        if (scale >= 1.03) {
            growing = false;
        }
    } else {
        scale -= 0.001;
        if (scale <= 1) {
            growing = true;
        }
    }
    drawCanvas();
    if (isHovering) {
        requestAnimationFrame(updateScale);
    }
}

// Add mousemove event listener to the canvas
canvas.addEventListener('mousemove', function (event) {
    // Get the mouse position
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if the mouse is over the overlay image
    if (x >= overlayX && x <= overlayX + overlayWidth && y >= overlayY && y <= overlayY + overlayHeight) {
        if (!isHovering) {
            isHovering = true;
            requestAnimationFrame(updateScale);
        }
        // Change the cursor to a pointer
        canvas.style.cursor = 'pointer';
    } else {
        isHovering = false;
        drawCanvas(); // Ensure canvas is drawn without hover effect when not hovering
        // Reset the cursor
        canvas.style.cursor = 'default';
    }
});

// Add click event listener to the canvas
canvas.addEventListener('click', function (event) {
    // Get the mouse click position
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if the click is inside the overlay image
    if (x >= overlayX && x <= overlayX + overlayWidth && y >= overlayY && y <= overlayY + overlayHeight) {
        // Set the position of the pin image
        pinX = x - 15; // Adjust the position to center the pin image
        pinY = y - 15; // Adjust the position to center the pin image
        drawCanvas();
        popup.style.display = 'block'; // Show the popup
        // alert('Overlay image clicked!');
    }
});

// Add click event listener to the close button
closeButton.addEventListener('click', function () {
    pinX = null;
    pinY = null;
    drawCanvas();
    popup.style.display = 'none'; // Hide the popup
});

// Function to update the scale for the pin beating animation
function updatePinScale() {
    if (pinGrowing) {
        pinScale += 0.01;
        if (pinScale >= 1.2) {
            pinGrowing = false;
        }
    } else {
        pinScale -= 0.01;
        if (pinScale <= 1) {
            pinGrowing = true;
        }
    }
    drawCanvas();
    requestAnimationFrame(updatePinScale);
}


// Start the pin beating animation loop
requestAnimationFrame(updatePinScale);