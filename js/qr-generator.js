// Chandra — qr-generator.js (QRCodeStyling wrapper, inputs binder, contrast checker)
(() => {
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    window.Chandra = window.Chandra || {};

    let qrStylingInstance = null;
    let debounceTimer = null;

    // Helper: Hex to RGB Converter
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Helper: Relative Luminance (WCAG formula)
    function getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    // WCAG Color Contrast Ratio calculator
    function getContrastRatio(hex1, hex2) {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        if (!rgb1 || !rgb2) return 1;

        const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    // Perform contrast evaluations to assert scannability
    function checkContrastScannability(fgColor1, fgColor2, bgColor, useGrad) {
        const badge = $("#contrastBadge");
        if (!badge) return;

        let ratio1 = getContrastRatio(fgColor1, bgColor);
        let ratio2 = useGrad ? getContrastRatio(fgColor2, bgColor) : ratio1;
        let worstRatio = Math.min(ratio1, ratio2);

        badge.classList.remove("success", "warning", "danger");

        if (worstRatio >= 4.5) {
            badge.className = "contrast-badge success";
            badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Scannable (Contrast: ${worstRatio.toFixed(1)}:1)`;
        } else if (worstRatio >= 2.5) {
            badge.className = "contrast-badge warning";
            badge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Skew Scan Warning (${worstRatio.toFixed(1)}:1)`;
        } else {
            badge.className = "contrast-badge danger";
            badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Low Contrast Warning (${worstRatio.toFixed(1)}:1)`;
            // Throttle toaster warnings so they don't spam
            if (!window.Chandra.lastContrastWarn || Date.now() - window.Chandra.lastContrastWarn > 5000) {
                window.Chandra.showToast("Contrast ratio is very low. Scanning may fail!", "error");
                window.Chandra.lastContrastWarn = Date.now();
            }
        }
    }

    // Build the configuration options object for qr-code-styling
    function buildQRStylingOptions() {
        const payload = window.Chandra.customization?.getActivePayload() || "https://chandra.studio";
        
        // Modules
        const dotStyle = $("#dotStyle").value;
        const cornerStyle = $("#cornerStyle").value;
        const cornerDotStyle = $("#cornerDotStyle").value;
        
        // Colors & Gradient setup
        const fgMode = $("#foreColorMode").value;
        const fgColor1 = $("#fgColor1").value;
        const fgColor2 = $("#fgColor2").value;
        const fgGradAngle = Number($("#fgGradAngle").value);
        
        const bgMode = $("#bgColorMode").value;
        const bgColor1 = $("#bgColor1").value;
        const bgColor2 = $("#bgColor2").value;
        const bgGradAngle = Number($("#bgGradAngle").value);

        // Custom Eyes colors
        const customEyes = $("#customEyesToggle").checked;
        const eyeFrameColor = $("#eyeFrameColor").value;
        const eyeBallColor = $("#eyeBallColor").value;

        // Error correction ECC
        let ecc = $("#qrEcc").value;

        // Logo overlay elements
        let logoSrc = null;
        let logoSize = 0.2;
        let logoMargin = 6;
        let logoRadius = 8;
        let eraseBg = true;

        if (window.Chandra.state.logoDataUrl) {
            logoSrc = window.Chandra.state.logoDataUrl;
            logoSize = Number($("#logoSizeSlider").value) / 100;
            logoMargin = Number($("#logoMarginSlider").value);
            logoRadius = Number($("#logoRadiusSlider").value);
            eraseBg = $("#logoBackgroundEraser").checked;

            // Automatically promote ECC to Q/H if large logo is loaded to secure readability
            if (logoSize > 0.15 && ecc !== "H" && ecc !== "Q") {
                ecc = "H";
                $("#qrEcc").value = "H";
                window.Chandra.showToast("ECC promoted to High (H) to support larger logo overlay.", "info");
            }
        }

        // Contrast Checks
        checkContrastScannability(
            fgColor1, 
            fgColor2, 
            bgMode === "transparent" ? "#ffffff" : bgColor1, 
            fgMode !== "solid"
        );

        // Set layout variables
        const size = 300; // Preview standard size
        const margin = 10;

        // Format qr-code-styling configuration payload
        const options = {
            width: size,
            height: size,
            type: "canvas",
            data: payload,
            margin: margin,
            qrOptions: {
                typeNumber: 0, // Auto
                mode: "Byte",
                errorCorrectionLevel: ecc
            },
            dotsOptions: {
                type: dotStyle
            },
            backgroundOptions: {
                color: bgMode === "transparent" ? "rgba(0,0,0,0)" : bgColor1
            },
            cornersSquareOptions: {
                type: cornerStyle
            },
            cornersDotOptions: {
                type: cornerDotStyle
            }
        };

        // Inject Foreground Gradient or Solid
        if (fgMode === "solid") {
            options.dotsOptions.color = fgColor1;
            options.cornersSquareOptions.color = fgColor1;
            options.cornersDotOptions.color = fgColor1;
        } else {
            const angleRad = (fgGradAngle * Math.PI) / 180;
            const gradConfig = {
                type: fgMode, // "linear" or "radial"
                colorStops: [
                    { offset: 0, color: fgColor1 },
                    { offset: 1, color: fgColor2 }
                ]
            };
            
            if (fgMode === "linear") {
                // Approximate vector coordinate directions using angle
                gradConfig.rotation = angleRad;
            }
            
            options.dotsOptions.gradient = gradConfig;
            options.cornersSquareOptions.gradient = gradConfig;
            options.cornersDotOptions.gradient = gradConfig;
        }

        // Inject Background Gradient
        if (bgMode === "linear" || bgMode === "radial") {
            const angleRad = (bgGradAngle * Math.PI) / 180;
            options.backgroundOptions.gradient = {
                type: bgMode,
                colorStops: [
                    { offset: 0, color: bgColor1 },
                    { offset: 1, color: bgColor2 }
                ],
                rotation: bgMode === "linear" ? angleRad : 0
            };
        }

        // Custom individual Eyes colors override
        if (customEyes) {
            options.cornersSquareOptions.color = eyeFrameColor;
            options.cornersDotOptions.color = eyeBallColor;
            // Clear eye gradients if custom colors are activated
            delete options.cornersSquareOptions.gradient;
            delete options.cornersDotOptions.gradient;
        }

        // Add logo configurations
        if (logoSrc) {
            options.image = logoSrc;
            options.imageOptions = {
                crossOrigin: "anonymous",
                hideBackgroundDots: eraseBg,
                imageSize: logoSize,
                margin: logoMargin
            };
        }

        // Metadata counters updates
        updateMetadataBadges(payload, ecc);

        return options;
    }

    // Update payload information stats
    function updateMetadataBadges(payload, ecc) {
        const charBadge = $("#qrRawCharacterCount");
        const versionBadge = $("#qrMatrixSizeBadge");
        if (!charBadge || !versionBadge) return;

        const len = payload.length;
        charBadge.textContent = `Payload: ${len} characters`;

        // Estimate module grid sizing based on standard QR version charts
        let modulesCount = 21;
        if (len > 180) modulesCount = 61; // approx version 10
        else if (len > 120) modulesCount = 49; // approx version 8
        else if (len > 70) modulesCount = 37; // approx version 5
        else if (len > 30) modulesCount = 29; // approx version 3
        
        versionBadge.textContent = `Grid size: ${modulesCount}x${modulesCount} modules`;
    }

    // Trigger debounced rendering loop
    function triggerGeneratorRender(immediate = false) {
        const spinner = $("#qrLoadingSpinner");
        if (spinner) spinner.hidden = false;

        const delay = immediate ? 0 : 220;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const options = buildQRStylingOptions();
            
            // Retain styling configuration state for exports
            window.Chandra.state.studioConfig = options;

            const holder = $("#studioQRHolder");
            if (holder) {
                holder.innerHTML = "";
                
                // Initialize library object or re-draw
                qrStylingInstance = new QRCodeStyling(options);
                qrStylingInstance.append(holder);

                // Add scan line sweep trigger
                const scanLine = $("#scanLine");
                if (scanLine) {
                    scanLine.style.animation = "none";
                    void scanLine.offsetWidth; // trigger reflow
                    scanLine.style.animation = "scannerSweep 2s ease-in-out forwards";
                }
            }

            if (spinner) spinner.hidden = true;

            // Log item configuration to history list (debounced after user stops typing)
            logToHistoryDebounced(options.data);

        }, delay);
    }

    // Debounced history entries logger
    let historySaveTimer = null;
    function logToHistoryDebounced(payload) {
        if (!payload || payload.length < 4) return;
        
        clearTimeout(historySaveTimer);
        historySaveTimer = setTimeout(() => {
            // Render a mini base64 thumbnail of the QR to show in history
            const miniOptions = { ...window.Chandra.state.studioConfig, width: 80, height: 80, margin: 4 };
            const tempQR = new QRCodeStyling(miniOptions);
            
            // Use local promise resolver to draw on canvas
            const tempDiv = document.createElement("div");
            tempQR.append(tempDiv);
            
            setTimeout(() => {
                const canvas = tempDiv.querySelector("canvas");
                const thumbUrl = canvas ? canvas.toDataURL("image/png") : null;
                
                const type = $("#qrTypeSelect").value;
                
                window.Chandra.history.save({
                    id: "chandra_" + Date.now(),
                    payload: payload,
                    type: type,
                    timestamp: Date.now(),
                    thumbUrl: thumbUrl,
                    config: JSON.stringify(window.Chandra.state.studioConfig)
                });
            }, 300);

        }, 3500); // Wait 3.5s after user halts changes
    }

    // Load full configs from saved items
    function loadFromSavedConfig(item) {
        if (!item || !item.type) return;

        // Restore type selection
        $("#qrTypeSelect").value = item.type;
        $("#qrTypeSelect").dispatchEvent(new Event("change"));

        // Let the dynamic template parsers set input fields
        window.Chandra.customization?.loadPayloadToTemplate(item.type, item.payload);

        // Load custom styling if present in config JSON
        try {
            if (item.config) {
                const conf = JSON.parse(item.config);
                
                // Map form elements back
                $("#dotStyle").value = conf.dotsOptions?.type || "square";
                $("#cornerStyle").value = conf.cornersSquareOptions?.type || "square";
                $("#cornerDotStyle").value = conf.cornersDotOptions?.type || "square";
                $("#qrEcc").value = conf.qrOptions?.errorCorrectionLevel || "M";

                // Colors
                if (conf.dotsOptions?.gradient) {
                    const grad = conf.dotsOptions.gradient;
                    $("#foreColorMode").value = grad.type;
                    $("#fgColor1").value = grad.colorStops[0].color;
                    $("#fgColor2").value = grad.colorStops[1].color;
                    if (grad.rotation) {
                        $("#fgGradAngle").value = Math.round((grad.rotation * 180) / Math.PI);
                    }
                } else {
                    $("#foreColorMode").value = "solid";
                    $("#fgColor1").value = conf.dotsOptions?.color || "#05070d";
                }

                // Bg Colors
                const bgType = conf.backgroundOptions?.color === "rgba(0,0,0,0)" ? "transparent" : "solid";
                if (bgType === "transparent") {
                    $("#bgColorMode").value = "transparent";
                } else if (conf.backgroundOptions?.gradient) {
                    const bgGrad = conf.backgroundOptions.gradient;
                    $("#bgColorMode").value = bgGrad.type;
                    $("#bgColor1").value = bgGrad.colorStops[0].color;
                    $("#bgColor2").value = bgGrad.colorStops[1].color;
                } else {
                    $("#bgColorMode").value = "solid";
                    $("#bgColor1").value = conf.backgroundOptions?.color || "#ffffff";
                }

                // Custom Eyes toggle
                const customEyes = conf.cornersSquareOptions?.color !== conf.dotsOptions?.color;
                $("#customEyesToggle").checked = customEyes;
                if (customEyes) {
                    $("#eyeFrameColor").value = conf.cornersSquareOptions?.color || "#05070d";
                    $("#eyeBallColor").value = conf.cornersDotOptions?.color || "#0072ff";
                }

                // Triggers DOM visibility updates
                $("#foreColorMode").dispatchEvent(new Event("change"));
                $("#bgColorMode").dispatchEvent(new Event("change"));
                $("#customEyesToggle").dispatchEvent(new Event("change"));
            }
        } catch (e) {
            console.error("Failed to restore branding configs.", e);
        }

        triggerGeneratorRender(true);
    }

    // Toggle fields visibility on mode select change
    function updateColorsInputsVisibility() {
        const fgMode = $("#foreColorMode").value;
        const bgMode = $("#bgColorMode").value;

        // Foreground visibility
        if (fgMode === "solid") {
            $$(".gradient-only").forEach(el => el.hidden = true);
            $("#fgColor1Label").textContent = "Color Primary";
        } else {
            $$(".gradient-only").forEach(el => el.hidden = false);
            $("#fgColor1Label").textContent = "Grad Color 1";
            if (fgMode === "radial") {
                $$(".linear-only").forEach(el => el.hidden = true);
            } else {
                $$(".linear-only").forEach(el => el.hidden = false);
            }
        }

        // Background visibility
        if (bgMode === "solid") {
            $$(".bg-gradient-only").forEach(el => el.hidden = true);
            $(".bg-colors-row").hidden = false;
            $("#bgColor1Label").textContent = "Bg Color";
        } else if (bgMode === "transparent") {
            $$(".bg-gradient-only").forEach(el => el.hidden = true);
            $(".bg-colors-row").hidden = true;
        } else {
            $$(".bg-gradient-only").forEach(el => el.hidden = false);
            $(".bg-colors-row").hidden = false;
            $("#bgColor1Label").textContent = "Bg Color 1";
            if (bgMode === "radial") {
                $$(".bg-linear-only").forEach(el => el.hidden = true);
            } else {
                $$(".bg-linear-only").forEach(el => el.hidden = false);
            }
        }
    }

    // Setup input listeners to trigger realtime updates
    function bindStudioUIListeners() {
        // Dropdown, selections elements
        const inputSelectors = [
            "#dotStyle", "#cornerStyle", "#cornerDotStyle", "#qrEcc", 
            "#foreColorMode", "#bgColorMode", "#frameStyleSelect", "#frameFontFamily"
        ];
        inputSelectors.forEach(sel => {
            $(sel)?.addEventListener("change", () => {
                updateColorsInputsVisibility();
                triggerGeneratorRender();
            });
        });

        // Color input changes
        const colorSelectors = [
            "#fgColor1", "#fgColor2", "#bgColor1", "#bgColor2", 
            "#eyeFrameColor", "#eyeBallColor", "#frameTextColor", "#frameBgColor"
        ];
        colorSelectors.forEach(sel => {
            $(sel)?.addEventListener("input", () => triggerGeneratorRender());
        });

        // Range inputs sliders
        const rangeSelectors = [
            "#fgGradAngle", "#bgGradAngle", "#logoSizeSlider", 
            "#logoMarginSlider", "#logoRadiusSlider", "#frameFontSize"
        ];
        rangeSelectors.forEach(sel => {
            $(sel)?.addEventListener("input", (e) => {
                const valSpan = $(`${sel}Val`);
                if (valSpan) {
                    const suffix = sel.includes("Angle") ? "°" : "px";
                    const val = sel.includes("Size") ? `${e.target.value}%` : `${e.target.value}${suffix}`;
                    valSpan.textContent = val;
                }
                triggerGeneratorRender();
            });
        });

        // Toggles toggles
        $("#customEyesToggle")?.addEventListener("change", (e) => {
            $("#customEyeColorsContainer").hidden = !e.target.checked;
            triggerGeneratorRender();
        });

        $("#logoBackgroundEraser")?.addEventListener("change", () => triggerGeneratorRender());

        // Frame text inputs
        $("#frameTextInput")?.addEventListener("input", () => triggerGeneratorRender());

        // Select logo presetter
        $$(".logo-preset-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const brand = btn.getAttribute("data-brand");
                window.Chandra.customization?.loadPresetLogoBrand?.(brand);
            });
        });

        // Reset studio inputs btn
        $("#btnResetAllStudio")?.addEventListener("click", () => {
            window.Chandra.customization?.resetStudioInputs?.();
            triggerGeneratorRender(true);
        });

        // 3D Card Hover Tilt Micro-interaction
        const card = $("#qrPreviewCard");
        const wrapper = $(".tilt-stage-wrapper");

        if (card && wrapper) {
            wrapper.addEventListener("mousemove", (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Limit range to max 12 deg
                const rotateX = -(y / (rect.height / 2)) * 12;
                const rotateY = (x / (rect.width / 2)) * 12;

                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            wrapper.addEventListener("mouseleave", () => {
                card.style.transform = "rotateX(0deg) rotateY(0deg)";
            });
        }
    }

    // Expose Public generator interface
    window.Chandra.qr = {
        triggerRender: triggerGeneratorRender,
        loadFromSavedConfig: loadFromSavedConfig,
        getQRStylingInstance: () => qrStylingInstance,
        getFinalOptions: buildQRStylingOptions
    };

    // Initial binding
    document.addEventListener("DOMContentLoaded", () => {
        bindStudioUIListeners();
        updateColorsInputsVisibility();
        // Wait a slight tick for content payload templates to bind
        setTimeout(() => triggerGeneratorRender(true), 250);
    });

})();
