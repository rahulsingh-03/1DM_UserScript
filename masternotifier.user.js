// ==UserScript==
// @name         Unified Privacy & Utility Notifier (Sequential Queue)
// @namespace    https://git.apps2sd.info/idm/userscripts
// @version      1.0.0
// @description  Shared floating toast notification system that only initializes and runs when a message is triggered.
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const CONTAINER_ID = '__1dm_toast_container_tr';
    
    // Global queue and active flags
    window.__1dmToastQueue = window.__1dmToastQueue || [];
    window.__1dmIsToastActive = window.__1dmIsToastActive || false;
    window.__1dmSeenMessages = window.__1dmSeenMessages || new Set();

    function getContainer() {
        let container = document.getElementById(CONTAINER_ID);
        if (!container && document.body) {
            container = document.createElement('div');
            container.id = CONTAINER_ID;
            container.style.position = 'fixed';
            container.style.top = '16px';
            container.style.right = '16px';
            container.style.zIndex = '999999';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'flex-end';
            container.style.pointerEvents = 'none';
            document.body.appendChild(container);
        }
        return container;
    }

    function processQueue() {
        if (window.__1dmIsToastActive || window.__1dmToastQueue.length === 0) {
            return;
        }

        window.__1dmIsToastActive = true;
        const message = window.__1dmToastQueue.shift();

        const checkAndShow = () => {
            const container = getContainer();
            if (!container) {
                setTimeout(checkAndShow, 50);
                return;
            }

            const toast = document.createElement('div');
            toast.textContent = message;

            // Sleek glassmorphism style card
            toast.style.backgroundColor = 'rgba(31, 41, 55, 0.92)';
            toast.style.backdropFilter = 'blur(10px)';
            toast.style.color = '#ffffff';
            toast.style.padding = '12px 16px';
            toast.style.borderRadius = '10px';
            toast.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
            toast.style.fontSize = '13px';
            toast.style.fontWeight = '500';
            toast.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            toast.style.lineHeight = '1.4';
            toast.style.textAlign = 'left';
            toast.style.whiteSpace = 'nowrap';
            toast.style.pointerEvents = 'auto';

            // Hidden entry state
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-15px) scale(0.95)';
            toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';

            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0) scale(1)';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px) scale(0.95)';
                
                setTimeout(() => {
                    toast.remove();
                    window.__1dmIsToastActive = false;
                    processQueue();
                }, 350);
            }, 2200);
        };

        checkAndShow();
    }

    // Public function exposed to all scripts. 
    // It will only execute DOM changes when called by your tracking/cookie/redirect scripts.
    window.show1DMPopup = function (message) {
        if (window.__1dmSeenMessages.has(message)) {
            return;
        }
        window.__1dmSeenMessages.add(message);

        window.__1dmToastQueue.push(message);
        processQueue();
    };
})();
