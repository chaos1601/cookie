'use strict';

function openPopup(url, title, width, height) {
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popupWindow = window.open(url, title, `width=${width},height=${height},left=${left},top=${top}`);
    return popupWindow;
}

function loadPopupContent(popupWindow, content) {
    popupWindow.document.open();
    popupWindow.document.write(content);
    popupWindow.document.close();
}

export { openPopup, loadPopupContent };