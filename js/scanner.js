// Chandra — scanner.js (Webcam scan stream, Drag-drop Image Decoder, Results Actions, History Log)
(() => {
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    window.Chandra = window.Chandra || {};

    let html5QrcodeScanner = null;
    let cameraDevicesList = [];
    let isCameraRunning = false;
    let scanHistory = [];

    // Helper: Escape HTML strings safely
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Initialize scanner devices selector
    async function initCameraDevices() {
        const selector = $("#cameraDeviceSelector");
        if (!selector) return;

        selector.innerHTML = `<option value="">Detecting cameras...</option>`;

        try {
            // Retrieve cameras list using html5-qrcode
            // Note: browser triggers permission dialog here if not already granted
            cameraDevicesList = await Html5Qrcode.getCameras();
            
            selector.innerHTML = "";
            if (cameraDevicesList.length === 0) {
                selector.innerHTML = `<option value="">No cameras detected</option>`;
                return;
            }

            cameraDevicesList.forEach((device, index) => {
                const opt = document.createElement("option");
                opt.value = device.id;
                opt.textContent = device.label || `Camera ${index + 1}`;
                selector.appendChild(opt);
            });
        } catch (err) {
            console.warn("Camera enumeration failed.", err);
            selector.innerHTML = `<option value="">Permission Denied / No Camera</option>`;
        }
    }

    // Toggle live camera scan feed
    async function toggleCameraScanning() {
        window.Chandra.sounds?.play("click");
        
        const btn = $("#btnToggleCamera");
        const selector = $("#cameraDeviceSelector");
        const placeholder = $("#scannerPlaceholder");
        const laser = $("#scannerLaser");

        if (!btn || !selector) return;

        if (isCameraRunning) {
            // Stop scanning
            await stopCameraScanning();
            return;
        }

        const cameraId = selector.value;
        if (!cameraId) {
            window.Chandra.showToast("Please select a camera device first.", "error");
            return;
        }

        // Start scanning
        btn.innerHTML = `<i class="fa-solid fa-square-minus"></i> Stop Scanner`;
        btn.className = "btn small error";
        placeholder.hidden = true;
        laser.hidden = false;

        html5QrcodeScanner = new Html5Qrcode("scannerVideoViewport");

        try {
            isCameraRunning = true;
            await html5QrcodeScanner.start(
                cameraId,
                {
                    fps: 10,
                    qrbox: (width, height) => {
                        const size = Math.min(width, height) * 0.65;
                        return { width: size, height: size };
                    }
                },
                (decodedText) => {
                    // Success callback
                    handleScanSuccess(decodedText);
                    stopCameraScanning(); // stop to inspect result
                },
                () => {
                    // Silence errors (triggered constantly when code not found in frame)
                }
            );

            // Check if torch/flashlight is supported
            const state = html5QrcodeScanner.getState();
            const capabilities = html5QrcodeScanner.getRunningTrackCapabilities();
            const torchBtn = $("#btnToggleScannerTorch");
            if (torchBtn && capabilities.torch) {
                torchBtn.hidden = false;
            }
            
            window.Chandra.showToast("Camera scanner active!", "success");
        } catch (err) {
            console.error("Camera startup failed.", err);
            window.Chandra.showToast("Could not access camera feed.", "error");
            await stopCameraScanning();
        }
    }

    // Stop scanning stream cleanly
    async function stopCameraScanning() {
        const btn = $("#btnToggleCamera");
        const placeholder = $("#scannerPlaceholder");
        const laser = $("#scannerLaser");
        const torchBtn = $("#btnToggleScannerTorch");

        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-camera"></i> Start Scanner`;
            btn.className = "btn small primary";
        }
        if (placeholder) placeholder.hidden = false;
        if (laser) laser.hidden = true;
        if (torchBtn) torchBtn.hidden = true;

        if (html5QrcodeScanner && isCameraRunning) {
            try {
                await html5QrcodeScanner.stop();
            } catch (err) {
                console.warn("Error stopping scanner stream", err);
            }
            html5QrcodeScanner = null;
        }
        isCameraRunning = false;
    }

    // Flashlight toggle
    async function toggleFlashlight() {
        if (!html5QrcodeScanner || !isCameraRunning) return;
        window.Chandra.sounds?.play("click");
        
        try {
            const track = html5QrcodeScanner.getRunningTrackSettings();
            const currentTorch = track.torch || false;
            await html5QrcodeScanner.applyVideoConstraints({
                advanced: [{ torch: !currentTorch }]
            });
            window.Chandra.showToast(`Flashlight ${!currentTorch ? "enabled" : "disabled"}`, "info");
        } catch (err) {
            console.warn("Failed to toggle flashlight", err);
        }
    }

    // Dropzone upload decoding parser
    function setupDragDropScanner() {
        const zone = $("#scannerDragZone");
        const fileInput = $("#scannerUploadInput");
        
        if (!zone || !fileInput) return;

        zone.addEventListener("click", () => fileInput.click());

        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.classList.add("drag-active");
        });

        zone.addEventListener("dragleave", () => {
            zone.classList.remove("drag-active");
        });

        const decodeFile = async (file) => {
            if (!file) return;

            window.Chandra.sounds?.play("click");
            window.Chandra.showToast("Decoding uploaded image...", "info");

            const decoder = new Html5Qrcode("scannerVideoViewport");
            try {
                const decodedText = await decoder.scanFile(file, true);
                handleScanSuccess(decodedText);
            } catch (err) {
                console.error("Decoding failed", err);
                window.Chandra.sounds?.play("error");
                window.Chandra.showToast("Could not find any readable QR code in this image.", "error");
            }
        };

        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove("drag-active");
            if (e.dataTransfer.files.length) {
                decodeFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener("change", () => {
            if (fileInput.files.length) {
                decodeFile(fileInput.files[0]);
            }
        });

        // Clipboard paste image listener
        window.addEventListener("paste", (e) => {
            // Only listen to paste if Scanner Tab is active
            if (window.Chandra.state.activeTab !== "scanner-tab") return;

            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const blob = items[i].getAsFile();
                    decodeFile(blob);
                    break;
                }
            }
        });
    }

    // Success scan decoder result formatting
    function handleScanSuccess(text) {
        window.Chandra.sounds?.play("success");
        window.Chandra.showToast("QR code decoded successfully!", "success");

        // Reveal panel
        $("#scannerResultEmpty").hidden = true;
        $("#scannerResultReal").hidden = false;

        const resultText = $("#scannerResultText");
        const resultTypeBadge = $("#scannerResultType");
        const resultTime = $("#scannerResultTime");

        resultText.textContent = text;
        resultTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Parse types
        let type = "text";
        if (/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i.test(text) || text.startsWith("http")) {
            type = "url";
        } else if (text.startsWith("WIFI:")) {
            type = "wifi";
        } else if (text.startsWith("mailto:")) {
            type = "email";
        } else if (text.startsWith("tel:")) {
            type = "phone";
        } else if (text.startsWith("SMSTO:")) {
            type = "sms";
        } else if (text.startsWith("BEGIN:VCARD")) {
            type = "vcard";
        }

        resultTypeBadge.textContent = `Type: ${type.toUpperCase()}`;
        resultTypeBadge.className = `badge`;

        // Render Action buttons based on content
        const actionsPanel = $("#scannerActionsPanel");
        actionsPanel.innerHTML = "";

        // Standard Copy button
        const copyBtn = document.createElement("button");
        copyBtn.className = "btn small primary";
        copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy Text`;
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(text);
            window.Chandra.sounds?.play("success");
            window.Chandra.showToast("Text copied to clipboard", "success");
        });
        actionsPanel.appendChild(copyBtn);

        // Conditional actions
        if (type === "url") {
            const openBtn = document.createElement("button");
            openBtn.className = "btn small";
            openBtn.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> Open Link`;
            openBtn.addEventListener("click", () => {
                const formatted = text.startsWith("http") ? text : `http://${text}`;
                if (confirm(`Do you want to redirect to: ${formatted}?`)) {
                    window.open(formatted, "_blank");
                }
            });
            actionsPanel.appendChild(openBtn);
        } else if (type === "wifi") {
            const connBtn = document.createElement("button");
            connBtn.className = "btn small";
            connBtn.innerHTML = `<i class="fa-solid fa-wifi"></i> View WiFi Credentials`;
            connBtn.addEventListener("click", () => {
                const match = text.match(/WIFI:T:(\w+);S:([^;]*);P:([^;]*);H:([^;]*);;/);
                if (match) {
                    alert(`WiFi Network Details:\n\nSSID (Name): ${match[2]}\nPassword: ${match[3]}\nSecurity: ${match[1]}`);
                } else {
                    alert("Could not parse WiFi settings string: " + text);
                }
            });
            actionsPanel.appendChild(connBtn);
        } else if (type === "email") {
            const mailBtn = document.createElement("button");
            mailBtn.className = "btn small";
            mailBtn.innerHTML = `<i class="fa-solid fa-envelope"></i> Send Email`;
            mailBtn.addEventListener("click", () => {
                window.open(text, "_self");
            });
            actionsPanel.appendChild(mailBtn);
        } else if (type === "phone") {
            const dialBtn = document.createElement("button");
            dialBtn.className = "btn small";
            dialBtn.innerHTML = `<i class="fa-solid fa-phone"></i> Dial Number`;
            dialBtn.addEventListener("click", () => {
                window.open(text, "_self");
            });
            actionsPanel.appendChild(dialBtn);
        }

        // Import to Studio helper button
        const importBtn = document.createElement("button");
        importBtn.className = "btn small ghost";
        importBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Edit in Studio`;
        importBtn.addEventListener("click", () => {
            window.Chandra.sounds?.play("click");
            window.Chandra.showToast("Importing content to Studio...", "info");
            
            // Map text to Studio
            $("#qrTypeSelect").value = type;
            $("#qrTypeSelect").dispatchEvent(new Event("change"));
            window.Chandra.customization?.loadPayloadToTemplate(type, text);

            // Switch to studio tab
            $("#navStudio").click();
        });
        actionsPanel.appendChild(importBtn);

        // Append to local history list
        logScannedItem(text, type);
    }

    // Append items to scanned log list
    function logScannedItem(payload, type) {
        // Exclude duplicate inputs
        scanHistory = scanHistory.filter(item => item.payload !== payload);
        scanHistory.unshift({
            payload: payload,
            type: type,
            timestamp: Date.now()
        });

        if (scanHistory.length > 8) {
            scanHistory.pop();
        }

        renderScannedHistory();
    }

    function renderScannedHistory() {
        const logContainer = $("#scanHistoryLog");
        if (!logContainer) return;

        logContainer.innerHTML = "";
        if (scanHistory.length === 0) {
            logContainer.innerHTML = `<div class="hint text-center" style="padding: 10px 0;">No scanned items.</div>`;
            return;
        }

        scanHistory.forEach(item => {
            const div = document.createElement("div");
            div.className = "history-item";

            const txt = document.createElement("div");
            txt.className = "txt";
            txt.textContent = item.payload;
            txt.title = item.payload;

            const viewBtn = document.createElement("button");
            viewBtn.className = "btn small ghost";
            viewBtn.style.padding = "4px 8px";
            viewBtn.innerHTML = `<i class="fa-solid fa-eye"></i> View`;
            viewBtn.addEventListener("click", () => {
                handleScanSuccess(item.payload);
            });

            div.appendChild(txt);
            div.appendChild(viewBtn);
            logContainer.appendChild(div);
        });
    }

    // Public hook methods
    window.Chandra.scanner = {
        initScanner: () => {
            initCameraDevices();
        },
        stopScanner: () => {
            stopCameraScanning();
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        $("#btnToggleCamera")?.addEventListener("click", toggleCameraScanning);
        $("#btnToggleScannerTorch")?.addEventListener("click", toggleFlashlight);
        setupDragDropScanner();
        renderScannedHistory();
    });

})();
