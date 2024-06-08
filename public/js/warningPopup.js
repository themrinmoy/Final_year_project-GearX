// In warningPopup.js
document.addEventListener('DOMContentLoaded', function () {
    // Function to display a popup message
    function displayPopup(message) {
        const popupContainer = document.getElementById('popup-container');
        const warningContainer = popupContainer.querySelector('.warning-container');
        warningContainer.innerHTML = `<strong>Warning:</strong> ${message}`;
        warningContainer.style.display = 'block';

        // Optionally, you can add a timeout to hide the popup after a certain duration
        setTimeout(() => {
            warningContainer.style.display = 'none';
        }, 7000); // Hide the popup after 5 seconds (5000 milliseconds)
    }

    // Display the warning message if it exists
    if (warningMessage && warningMessage.trim()) {
        displayPopup(warningMessage);
    }
});
