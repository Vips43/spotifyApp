function isMobile() {
    return ('ontouchstart' in document.documentElement);
}

if (isMobile()) {
    console.log("This device supports touch events (likely mobile/tablet).");
} else {
    console.log("This device likely does not support touch events (likely laptop/desktop).");
}
function isMobileDevice() {
    // Check for coarse pointer (touch-based device)
    const isTouchDevice = window.matchMedia("(any-pointer: coarse)").matches;

    // Optionally, combine with a max-width check for smaller screens
    const isSmallScreen = window.matchMedia("only screen and (max-width: 760px)").matches;

    return isTouchDevice || isSmallScreen;
}

if (isMobileDevice()) {
    console.log("This is likely a mobile device.");
} else {
    console.log("This is likely a laptop/desktop device.");
}

// if it is mobile specific device
function isMobileByUserAgent() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Look for common mobile indicators
    if (/android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)) {
        return true;
    }
    return false;
}
const mobile = document.querySelectorAll(".mobile")
const desktop = document.querySelectorAll(".desktop")

if (isMobileByUserAgent()) {
    console.log("User agent indicates a mobile device.");
    toggleClass(mobile, 'hidden')
} else {
    console.log("User agent indicates a laptop/desktop device.");
    toggleClass(desktop, 'hidden')
}

function toggleClass(el, cls) {
    el.forEach(e => {
        e.classList.remove(`${cls}`)
    })
}