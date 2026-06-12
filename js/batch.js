// Chandra — batch.js (Bulk QR List Creator, CSV Parser, ZIP package compressor)
(() => {
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    window.Chandra = window.Chandra || {};

    let compiledBatchCards = []; // stores canvas and filenames references

    // Helper: download helper
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2500);
    }

    // Parse uploaded CSV spreadsheet text
    function parseCsvToBatchList(text) {
        const lines = text.split(/\r?\n/);
        const results = [];
        
        lines.forEach((line, index) => {
            if (!line.trim()) return;
            
            // Simple split by comma (ignoring complex quotes for standard ease)
            const parts = line.split(",");
            let filename = `qr_item_${index + 1}`;
            let payload = line;

            if (parts.length >= 2) {
                filename = parts[0].trim().replace(/[^a-zA-Z0-9_-]/g, "_");
                payload = parts.slice(1).join(",").trim();
            }

            results.push({ filename, payload });
        });

        // Filter header row if present
        if (results.length > 0 && results[0].filename.toLowerCase() === "filename") {
            results.shift();
        }

        return results;
    }

    // Trigger CSV template download
    function downloadCsvTemplate() {
        window.Chandra.sounds?.play("click");
        const csvContent = "Filename,Payload\nGoogle_Home,https://google.com\nMyOfficeWiFi,WIFI:S:OfficeSSID;P:Pass123;;\nText_Label,Welcome to the event!";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        downloadBlob(blob, "chandra_batch_template.csv");
        window.Chandra.showToast("CSV Template downloaded", "success");
    }

    // Generate batch preview items list
    async function executeBatchGeneration() {
        window.Chandra.sounds?.play("click");

        const listArea = $("#batchInputArea");
        const grid = $("#batchPreviewGrid");
        const pBox = $("#batchProgressBarBox");
        const pFill = $("#batchProgressBarFill");
        const pText = $("#batchProgressBarText");
        const zipBtn = $("#btnDownloadBatchZip");

        if (!listArea || !grid || !pBox || !pFill || !pText || !zipBtn) return;

        // Parse list rows
        const rawText = listArea.value.trim();
        let items = [];

        if (rawText) {
            const lines = rawText.split("\n");
            lines.forEach((line, index) => {
                const val = line.trim();
                if (val) {
                    items.push({
                        filename: `qr_batch_${index + 1}`,
                        payload: val
                    });
                }
            });
        }

        if (items.length === 0) {
            window.Chandra.showToast("Please enter batch inputs or upload a CSV file.", "error");
            window.Chandra.sounds?.play("error");
            return;
        }

        // Limit inputs for safety
        if (items.length > 100) {
            window.Chandra.showToast("Batch size capped at 100 QRs per run for memory safety.", "warning");
            items = items.slice(0, 100);
        }

        // Reset display
        grid.innerHTML = "";
        compiledBatchCards = [];
        pBox.hidden = false;
        zipBtn.disabled = true;
        $("#batchCountBadge").textContent = "0";

        // Setup base styles
        const dotStyle = $("#batchDotStyle").value;
        const fgColor = $("#batchFgColor").value;

        // Render loop
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const percent = Math.round(((i + 1) / items.length) * 100);

            // Create Visual Preview Card elements
            const card = document.createElement("div");
            card.className = "batch-card";

            const qrThumb = document.createElement("div");
            qrThumb.className = "batch-card__qr";

            const title = document.createElement("span");
            title.className = "batch-card__label";
            title.textContent = item.filename;
            title.title = item.payload;

            const dlBtn = document.createElement("button");
            dlBtn.className = "btn small ghost";
            dlBtn.style.padding = "4px 8px";
            dlBtn.innerHTML = `<i class="fa-solid fa-download"></i> PNG`;

            card.appendChild(qrThumb);
            card.appendChild(title);
            card.appendChild(dlBtn);
            grid.appendChild(card);

            // Render miniature QR code styling instance
            const qrInstance = new QRCodeStyling({
                width: 180,
                height: 180,
                data: item.payload,
                margin: 4,
                dotsOptions: { type: dotStyle, color: fgColor },
                backgroundOptions: { color: "#ffffff" },
                cornersSquareOptions: { type: "square", color: fgColor },
                cornersDotOptions: { type: "square", color: fgColor }
            });
            
            qrInstance.append(qrThumb);

            // Wait slight frame paint tick
            await new Promise(r => setTimeout(r, 60));

            // Extract canvas element once rendered
            const renderedCanvas = qrThumb.querySelector("canvas");
            if (renderedCanvas) {
                compiledBatchCards.push({
                    filename: item.filename,
                    canvas: renderedCanvas
                });

                // Attach direct download PNG listener
                dlBtn.addEventListener("click", () => {
                    renderedCanvas.toBlob((blob) => {
                        downloadBlob(blob, `${item.filename}.png`);
                        window.Chandra.showToast(`${item.filename} downloaded!`, "success");
                    });
                });
            }

            // Update Progress Bar indicators
            pFill.style.width = `${percent}%`;
            pText.textContent = `Generating ${percent}% (${i + 1} of ${items.length})`;
            $("#batchCountBadge").textContent = i + 1;
        }

        // Complete state triggers
        pText.textContent = `Batch compilation complete! ${items.length} items ready.`;
        zipBtn.disabled = false;
        window.Chandra.sounds?.play("success");
        window.Chandra.showToast("Batch QRs generated successfully!", "success");
    }

    // Export batch files compiled as a ZIP package
    function downloadZipBatchPackage() {
        if (compiledBatchCards.length === 0) return;
        window.Chandra.sounds?.play("click");
        window.Chandra.showToast("Creating ZIP archive package...", "info");

        // Initialize JSZip instance
        const zip = new JSZip();

        compiledBatchCards.forEach(item => {
            const dataUrl = item.canvas.toDataURL("image/png");
            // Extract base64 segment from URI header
            const base64Data = dataUrl.split(",")[1];
            zip.file(`${item.filename}.png`, base64Data, { base64: true });
        });

        // Compress
        zip.generateAsync({ type: "blob" }).then((content) => {
            downloadBlob(content, "chandra_batch_pack.zip");
            window.Chandra.sounds?.play("success");
            window.Chandra.showToast("ZIP File package downloaded!", "success");
        }).catch(err => {
            console.error(err);
            window.Chandra.showToast("ZIP Compression failed.", "error");
        });
    }

    // Bind file import change listener
    function bindBatchFileUploader() {
        const uploader = $("#batchCsvUpload");
        if (!uploader) return;

        uploader.addEventListener("change", () => {
            const file = uploader.files[0];
            if (!file) return;

            window.Chandra.showToast(`Loading: ${file.name}`, "info");

            const reader = new FileReader();
            reader.onload = (e) => {
                const parsed = parseCsvToBatchList(e.target.result);
                if (parsed.length === 0) {
                    window.Chandra.showToast("No valid rows found in CSV.", "error");
                    return;
                }

                // Format parsed elements back to textarea view
                const textLines = parsed.map(item => item.payload);
                $("#batchInputArea").value = textLines.join("\n");
                
                window.Chandra.sounds?.play("success");
                window.Chandra.showToast(`Imported ${parsed.length} rows from CSV!`, "success");
            };
            reader.readAsText(file);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        $("#btnGenerateBatch")?.addEventListener("click", executeBatchGeneration);
        $("#btnDownloadBatchZip")?.addEventListener("click", downloadZipBatchPackage);
        $("#btnDownloadCsvTemplate")?.addEventListener("click", downloadCsvTemplate);
        bindBatchFileUploader();
    });

})();
