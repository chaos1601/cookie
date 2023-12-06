'use strict';
import { onEvent, getElement, select, selectAll } from "./utility.js";
import { openPopup, loadPopupContent } from "./popup.js";

// Check if cookies are enabled
function areCookiesEnabled() {
    let cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
    }
    return cookieEnabled;
}

function showConsentDialogInPopup() {
    const cookieConsentDialog = getElement('cookieConsentDialog');
    const content = cookieConsentDialog.innerHTML;
    
    const popupWindow = openPopup("", "Cookie Consent", 400, 300);
    loadPopupContent(popupWindow, content);

    onEvent('click', popupWindow.getElement('acceptAllBtn'), acceptAllCookies);
    onEvent('click', popupWindow.getElement('settingsBtn'), showSettingsDialogInPopup);
}

// Function to get a cookie by name
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }
    return undefined;
}

// Set cookie with expiration time
function setCookie(name, value, seconds) {
    const date = new Date();
    date.setSeconds(date.getSeconds() + 20);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Function to show consent dialog if cookies are not enabled or no cookies are stored
function showConsentDialog() {
    const cookieConsentDialog = getElement('cookieConsentDialog');
    cookieConsentDialog.style.display = 'block';

    onEvent('click', getElement('acceptAllBtn'), acceptAllCookies);
    onEvent('click', getElement('settingsBtn'), showSettingsDialog);
}

// Function to accept all cookies
function acceptAllCookies() {
    setCookie('allCookiesAccepted', 'true', 20); // Store all cookies for 20 seconds
    hideDialog('cookieConsentDialog');
}

// Function to show settings dialog
function showSettingsDialog() {
    const settingsDialog = getElement('settingsDialog');
    settingsDialog.style.display = 'block';

    onEvent('click', getElement('saveSettingsBtn'), saveSettings);
}

// Function to save user-selected settings
function saveSettings() {
    const storeBrowser = select('[name="storeBrowserInfo"]').checked;
    const storeOS = select('[name="storeOSInfo"]').checked;
    const storeScreen = select('[name="storeScreenInfo"]').checked;

    if (!(storeBrowser || storeOS || storeScreen)) {
        // If user rejects all options, set a cookie indicating rejection
        setCookie('allCookiesRejected', 'true', 20); // Reject all cookies for 20 seconds
    } else {
        // Store selected options as cookies
        if (storeBrowser) setCookie('storeBrowserInfo', 'true', 20);
        if (storeOS) setCookie('storeOSInfo', 'true', 20);
        if (storeScreen) setCookie('storeScreenInfo', 'true', 20);
    }

    hideDialog('settingsDialog');
}

// Function to hide dialogs
function hideDialog(dialogId) {
    const dialog = getElement(dialogId);
    dialog.style.display = 'none';
}
// Function to show consent dialog in a popup window
function showConsentDialogInPopup() {
    const cookieConsentDialog = getElement('cookieConsentDialog');
    const content = cookieConsentDialog.innerHTML;
    
    const popupWindow = openPopup("", "Cookie Consent", 400, 300);
    loadPopupContent(popupWindow, content);

    onEvent('click', popupWindow.document.getElementById('acceptAllBtn'), acceptAllCookies);
    onEvent('click', popupWindow.document.getElementById('settingsBtn'), showSettingsDialogInPopup);
}

// Function to show settings dialog in a popup window
function showSettingsDialogInPopup() {
    const settingsDialog = getElement('settingsDialog');
    const content = settingsDialog.innerHTML;
    
    const popupWindow = openPopup("", "Cookie Settings", 400, 300);
    loadPopupContent(popupWindow, content);

    onEvent('click', popupWindow.document.getElementById('saveSettingsBtn'), saveSettings);
}

// Function to check if cookies are already set and act accordingly
function checkCookiesAndShowDialogs() {
    if (!areCookiesEnabled() || getCookie('allCookiesAccepted') === undefined) {
        setTimeout(showConsentDialogInPopup, 2000); // Delay to display the dialog after 2 seconds
    }
}

// Run on page load
window.addEventListener('load', checkCookiesAndShowDialogs);