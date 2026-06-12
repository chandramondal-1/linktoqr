// Chandra — download.js (PNG, JPEG, WebP, SVG, PDF exporters, Clipboard copiers, Print formatting)
(() => {
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    window.Chandra = window.Chandra || {};

    // Helper: download from a Blob
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
    }

    // High resolution canvas compiler that draws the QR code and any frames/text labels
    async function compileHighResQRCanvas(format = "png") {
        const coreOpts = window.Chandra.qr.getFinalOptions();
        const frameStyle = $("#frameStyleSelect").value;
        
        // Define high-res size (1000px base for crisp output)
        const qrSize = 1000;
        let canvasW = qrSize;
        let canvasH = qrSize;

        // Adjust canvas dimension based on frame styles
        let frameOffsetTop = 0;
        let frameOffsetBottom = 0;
        let framePadding = 40;

        if (frameStyle === "bottom-banner") {
            frameOffsetBottom = 160;
        } else if (frameStyle === "top-border") {
            frameOffsetTop = 60;
            frameOffsetBottom = 60;
        } else if (frameStyle === "balloon") {
            frameOffsetBottom = 140;
            canvasH += 40;
        } else if (frameStyle === "phone") {
            frameOffsetTop = 180;
            frameOffsetBottom = 120;
            canvasW += 120;
            canvasH += 120;
        } else if (frameStyle === "card") {
            frameOffsetTop = 100;
            frameOffsetBottom = 140;
            canvasW += 160;
            canvasH += 160;
        }

        // Draw temporary qr-code-styling canvas at high res (1000px)
        const renderOpts = { ...coreOpts, width: qrSize, height: qrSize, type: "canvas" };
        
        // Temporarily clear bg color from QR inner options if frame or transparent is set
        if (frameStyle !== "none") {
            renderOpts.backgroundOptions = { color: "rgba(0,0,0,0)" };
        }

        const tempQR = new QRCodeStyling(renderOpts);
        const tempDiv = document.createElement("div");
        tempQR.append(tempDiv);

        // Wait a slight tick for canvas generation
        await new Promise(r => setTimeout(r, 450));
        const qrCanvas = tempDiv.querySelector("canvas");
        if (!qrCanvas) throw new Error("Failed to compile QR matrix canvas.");

        // Create main output compilation canvas
        const outCanvas = document.createElement("canvas");
        outCanvas.width = canvasW;
        outCanvas.height = canvasH;
        const ctx = outCanvas.getContext("2d");

        // 1. Paint background colors / gradients
        const bgMode = $("#bgColorMode").value;
        const bgColor1 = $("#bgColor1").value;
        const bgColor2 = $("#bgColor2").value;
        const bgGradAngle = Number($("#bgGradAngle").value);

        if (bgMode === "transparent" && format === "png") {
            ctx.clearRect(0, 0, canvasW, canvasH);
        } else {
            // Paint solid or gradient backings
            if (bgMode === "linear") {
                const angleRad = (bgGradAngle * Math.PI) / 180;
                // Linear gradient endpoints calculations
                const x2 = canvasW * Math.cos(angleRad);
                const y2 = canvasH * Math.sin(angleRad);
                const grad = ctx.createLinearGradient(0, 0, x2, y2);
                grad.addColorStop(0, bgColor1);
                grad.addColorStop(1, bgColor2);
                ctx.fillStyle = grad;
            } else if (bgMode === "radial") {
                const grad = ctx.createRadialGradient(canvasW/2, canvasH/2, 10, canvasW/2, canvasH/2, canvasW/1.2);
                grad.addColorStop(0, bgColor1);
                grad.addColorStop(1, bgColor2);
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = bgColor1; // "solid" fallback or "transparent" fallback for non-PNG formats
            }
            ctx.fillRect(0, 0, canvasW, canvasH);
        }

        // 2. Draw Frame structures
        const frameColor = $("#frameBgColor").value;
        const frameText = $("#frameTextInput").value;
        const fontName = $("#frameFontFamily").value;
        const textColor = $("#frameTextColor").value;
        const fontSize = Number($("#frameFontSize").value) * 2.8; // scale slider font size

        if (frameStyle === "bottom-banner") {
            ctx.fillStyle = frameColor;
            ctx.fillRect(0, canvasH - frameOffsetBottom, canvasW, frameOffsetBottom);
        } else if (frameStyle === "top-border") {
            ctx.fillStyle = frameColor;
            ctx.fillRect(0, 0, canvasW, frameOffsetTop);
            ctx.fillRect(0, canvasH - frameOffsetBottom, canvasW, frameOffsetBottom);
        } else if (frameStyle === "balloon") {
            // Rounded speech bubble balloon frame
            ctx.fillStyle = frameColor;
            const radius = 50;
            const bx = 40;
            const by = 40;
            const bw = canvasW - 80;
            const bh = canvasH - 180;

            ctx.beginPath();
            ctx.moveTo(bx + radius, by);
            ctx.arcTo(bx + bw, by, bx + bw, by + bh, radius);
            ctx.arcTo(bx + bw, by + bh, bx, by + bh, radius);
            ctx.arcTo(bx, by + bh, bx, by, radius);
            ctx.arcTo(bx, by, bx + bw, by, radius);
            ctx.closePath();
            ctx.fill();

            // Speech pointer triangle shape
            ctx.beginPath();
            ctx.moveTo(canvasW/2 - 30, by + bh);
            ctx.lineTo(canvasW/2, by + bh + 40);
            ctx.lineTo(canvasW/2 + 30, by + bh);
            ctx.closePath();
            ctx.fill();
        } else if (frameStyle === "phone") {
            // Mobile border overlay frame
            ctx.fillStyle = "#1e293b";
            const rx = 30;
            const ry = 30;
            const rw = canvasW - 60;
            const rh = canvasH - 60;
            const rd = 45;

            ctx.beginPath();
            ctx.moveTo(rx + rd, ry);
            ctx.arcTo(rx + rw, ry, rx + rw, ry + rh, rd);
            ctx.arcTo(rx + rw, ry + rh, rx, ry + rh, rd);
            ctx.arcTo(rx, ry + rh, rx, ry, rd);
            ctx.arcTo(rx, ry, rx + rw, ry, rd);
            ctx.closePath();
            ctx.fill();

            // Screen viewport inner fill
            ctx.fillStyle = bgColor1;
            ctx.fillRect(rx + 20, ry + 120, rw - 40, rh - 200);
        } else if (frameStyle === "card") {
            // Card outline shadow borders
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = varColorHex("--border-color", "#e2e8f0");
            ctx.lineWidth = 8;
            
            const cx = 40;
            const cy = 40;
            const cw = canvasW - 80;
            const ch = canvasH - 80;
            const cr = 35;

            ctx.beginPath();
            ctx.moveTo(cx + cr, cy);
            ctx.arcTo(cx + cw, cy, cx + cw, cy + ch, cr);
            ctx.arcTo(cx + cw, cy + ch, cx, cy + ch, cr);
            ctx.arcTo(cx, cy + ch, cx, cy, cr);
            ctx.arcTo(cx, cy, cx + cw, cy, cr);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Helper: retrieve actual RGB values from theme variables
        function varColorHex(varName, fallback) {
            const temp = document.createElement("div");
            temp.style.color = `var(${varName})`;
            document.body.appendChild(temp);
            const rgb = getComputedStyle(temp).color;
            document.body.removeChild(temp);
            return rgb || fallback;
        }

        // 3. Render high-res QR code onto compiled canvas
        const qrX = (canvasW - qrSize) / 2;
        const qrY = (canvasH - qrSize) / 2 + (frameOffsetTop - frameOffsetBottom) / 2;
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

        // 4. Write Frame Text Label values
        if (frameStyle !== "none" && frameText) {
            ctx.fillStyle = textColor;
            ctx.font = `bold ${fontSize}px "${fontName}"`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let textY = canvasH - frameOffsetBottom / 2;
            if (frameStyle === "top-border") {
                textY = canvasH - frameOffsetBottom / 2;
                ctx.fillText(frameText, canvasW / 2, textY);
                // Top header label text
                ctx.fillText("SCAN ME", canvasW / 2, frameOffsetTop / 2);
            } else if (frameStyle === "phone") {
                textY = canvasH - 75;
                ctx.fillStyle = "#cbd5e1";
                ctx.fillText(frameText, canvasW / 2, textY);
                // Top status bar
                ctx.font = `bold 28px "${fontName}"`;
                ctx.fillText("Chandra Studio Connect", canvasW / 2, 85);
            } else if (frameStyle === "card") {
                ctx.fillStyle = "#0f172a";
                ctx.font = `800 ${fontSize}px "${fontName}"`;
                ctx.fillText(frameText, canvasW / 2, canvasH - 85);
                
                ctx.fillStyle = "#64748b";
                ctx.font = `bold 26px "${fontName}"`;
                ctx.fillText("Scan with Camera App", canvasW / 2, 80);
            } else {
                ctx.fillText(frameText, canvasW / 2, textY);
            }
        }

        return outCanvas;
    }

    // Trigger high-res PNG export download
    async function downloadPNG() {
        window.Chandra.sounds?.play("click");
        try {
            const canvas = await compileHighResQRCanvas("png");
            canvas.toBlob((blob) => {
                downloadBlob(blob, "chandra_studio.png");
                window.Chandra.sounds?.play("success");
                window.Chandra.showToast("PNG Downloaded!", "success");
            }, "image/png");
        } catch (e) {
            console.error(e);
            window.Chandra.showToast("PNG generation failed.", "error");
        }
    }

    // Trigger high-res JPG export download
    async function downloadJPG() {
        window.Chandra.sounds?.play("click");
        try {
            const canvas = await compileHighResQRCanvas("jpg");
            canvas.toBlob((blob) => {
                downloadBlob(blob, "chandra_studio.jpg");
                window.Chandra.sounds?.play("success");
                window.Chandra.showToast("JPEG Downloaded!", "success");
            }, "image/jpeg", 0.95);
        } catch (e) {
            console.error(e);
            window.Chandra.showToast("JPEG generation failed.", "error");
        }
    }

    // Trigger high-res WebP export download
    async function downloadWebP() {
        window.Chandra.sounds?.play("click");
        try {
            const canvas = await compileHighResQRCanvas("webp");
            canvas.toBlob((blob) => {
                downloadBlob(blob, "chandra_studio.webp");
                window.Chandra.sounds?.play("success");
                window.Chandra.showToast("WebP Downloaded!", "success");
            }, "image/webp", 0.9);
        } catch (e) {
            console.error(e);
            window.Chandra.showToast("WebP generation failed.", "error");
        }
    }

    // Vector SVG download using native qr-code-styling download method
    function downloadSVG() {
        window.Chandra.sounds?.play("click");
        const qrInstance = window.Chandra.qr.getQRStylingInstance();
        if (qrInstance) {
            // download uses promise internally
            qrInstance.download({
                name: "chandra_vector",
                extension: "svg"
            }).then(() => {
                window.Chandra.sounds?.play("success");
                window.Chandra.showToast("Vector SVG Downloaded!", "success");
            });
        } else {
            window.Chandra.showToast("No active QR instance to download.", "error");
        }
    }

    // Printable PDF download utilizing jsPDF
    async function downloadPDF() {
        window.Chandra.sounds?.play("click");
        window.Chandra.showToast("Compiling printable document...", "info");
        
        try {
            const canvas = await compileHighResQRCanvas("png");
            const imgData = canvas.toDataURL("image/png");

            // Initialize jsPDF (A4 standard dimensions: 210mm x 297mm)
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");

            // Header labels
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(22);
            pdf.setTextColor(0, 114, 255);
            pdf.text("Chandra Studio Suite", 105, 30, { align: "center" });

            pdf.setFontSize(10);
            pdf.setFont("Helvetica", "normal");
            pdf.setTextColor(100, 116, 139);
            pdf.text("Free Vector Quality High ECC Print layout", 105, 36, { align: "center" });

            // Draw card frame borders
            pdf.setDrawColor(226, 232, 240);
            pdf.setLineWidth(0.5);
            pdf.roundedRect(25, 48, 160, 200, 5, 5, "D");

            // Place high-res QR image centered
            const w = 120;
            const h = 120;
            const x = (210 - w) / 2;
            const y = 65;
            pdf.addImage(imgData, "PNG", x, y, w, h);

            // Print crop crop lines/instructions
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(11);
            pdf.setTextColor(15, 23, 42);
            pdf.text("PRINTING SPECIFICATIONS", 35, 205);
            
            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(100, 116, 139);
            pdf.text([
                "- Cut along the boundary lines for display standard cards.",
                "- Verify contrast levels before scaling onto massive signage borders.",
                "- Short Dynamic URLs can be redirected instantly via the tracking dashboard."
            ], 35, 214);

            // Footer branding
            pdf.setFontSize(8);
            pdf.text("Generated at: https://chandra.studio • Print size: 12.0 cm x 12.0 cm", 105, 275, { align: "center" });

            pdf.save("chandra_print_package.pdf");
            
            window.Chandra.sounds?.play("success");
            window.Chandra.showToast("PDF Document generated!", "success");
        } catch (e) {
            console.error(e);
            window.Chandra.showToast("PDF generation failed.", "error");
        }
    }

    // Copy png image directly to system clipboard
    async function copyImageToClipboard() {
        window.Chandra.sounds?.play("click");
        try {
            const canvas = await compileHighResQRCanvas("png");
            canvas.toBlob(async (blob) => {
                try {
                    const item = new ClipboardItem({ "image/png": blob });
                    await navigator.clipboard.write([item]);
                    window.Chandra.sounds?.play("success");
                    window.Chandra.showToast("QR PNG copied to clipboard!", "success");
                } catch (err) {
                    console.error(err);
                    window.Chandra.showToast("Clipboard copy failed. Try download option.", "error");
                }
            });
        } catch (e) {
            console.error(e);
            window.Chandra.showToast("Compilation failed.", "error");
        }
    }

    // Copy raw SVG code text to system clipboard
    async function copySVGMarkupToClipboard() {
        window.Chandra.sounds?.play("click");
        try {
            const finalOpts = window.Chandra.qr.getFinalOptions();
            
            // Render to a temp SVG container to pull XML
            const tempOpts = { ...finalOpts, type: "svg", width: 400, height: 400 };
            const tempQR = new QRCodeStyling(tempOpts);
            const tempDiv = document.createElement("div");
            tempQR.append(tempDiv);

            // Wait a slight tick for SVG parser
            await new Promise(r => setTimeout(r, 450));
            const svgNode = tempDiv.querySelector("svg");
            
            if (svgNode) {
                const svgText = new XMLSerializer().serializeToString(svgNode);
                await navigator.clipboard.writeText(svgText);
                window.Chandra.sounds?.play("success");
                window.Chandra.showToast("Raw SVG code copied to clipboard!", "success");
            } else {
                window.Chandra.showToast("SVG parsing failed.", "error");
            }
        } catch (e) {
            console.error(e);
            window.Chandra.showToast("Copy failed.", "error");
        }
    }

    // Print layouts formatting triggers
    function triggerPrintDialog() {
        window.Chandra.sounds?.play("click");
        window.print();
    }

    // Bind UI actions
    function bindDownloadControls() {
        $("#btnDownloadPNG")?.addEventListener("click", downloadPNG);
        $("#btnDownloadSVG")?.addEventListener("click", downloadSVG);
        $("#btnDownloadPDF")?.addEventListener("click", downloadPDF);
        $("#btnDownloadJPG")?.addEventListener("click", downloadJPG);
        $("#btnDownloadWebP")?.addEventListener("click", downloadWebP);
        
        $("#btnCopyImage")?.addEventListener("click", copyImageToClipboard);
        $("#btnCopySVG")?.addEventListener("click", copySVGMarkupToClipboard);
        
        $("#btnPrintQR")?.addEventListener("click", triggerPrintDialog);
        
        // Share button using native Web Share API where supported
        $("#btnShareQR")?.addEventListener("click", async () => {
            window.Chandra.sounds?.play("click");
            const payload = window.Chandra.customization?.getActivePayload() || "";
            
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "My QR Code from Chandra Studio",
                        text: `Payload: ${payload}`,
                        url: window.location.href
                    });
                } catch (e) {
                    console.warn("Share aborted.");
                }
            } else {
                // Clipboard fallback
                try {
                    await navigator.clipboard.writeText(payload);
                    window.Chandra.sounds?.play("success");
                    window.Chandra.showToast("QR Payload text copied to clipboard!", "success");
                } catch (err) {
                    window.Chandra.showToast("Web Sharing not supported.", "error");
                }
            }
        });
    }

    // Expose download helpers
    window.Chandra.download = {
        compileHighRes: compileHighResQRCanvas,
        download: (kind) => {
            if (kind === "png") downloadPNG();
            if (kind === "svg") downloadSVG();
        }
    };

    document.addEventListener("DOMContentLoaded", bindDownloadControls);

})();
