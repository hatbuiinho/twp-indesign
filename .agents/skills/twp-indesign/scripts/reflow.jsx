// Included by prepare.py. twpJob is supplied by the generated runner.
(function (job) {
    var log = File(job.work + "/" + job.name + ".log");
    log.encoding = "UTF-8";
    if (!log.open("w")) throw Error("Cannot start job log.");
    var interaction = app.scriptPreferences.userInteractionLevel;
    var units = app.scriptPreferences.measurementUnit;
    var priorPdf = app.pdfExportPreferences.properties;
    var source, doc;

    function note(message) { log.writeln(message); }

    function uniqueSource(spread, options) {
        var frames = spread.textFrames.everyItem().getElements();
        var hits = [];
        for (var i = 0; i < frames.length; i++) {
            var frame = frames[i];
            if (!frame.parentPage || frame.parentPage.name !== String(options.sourcePage)) continue;
            if (options.label && frame.label !== options.label) continue;
            var text = options.take === "story" ? frame.parentStory.contents : frame.contents;
            text = String(text).replace(/^\s+/, "");
            if (!text || (options.prefix && text.indexOf(options.prefix) !== 0)) continue;
            hits.push(frame);
        }
        if (hits.length !== 1) {
            throw Error("Expected one frame on page " + options.sourcePage + ", found " + hits.length + "; select by label or prefix.");
        }
        return hits[0];
    }

    function addText(original, options, page, layer, name, none) {
        var frame = page.textFrames.add(layer, {geometricBounds: options.boundsPt, label: name});
        frame.applyObjectStyle(doc.objectStyles[0], true, true);
        var prefs = frame.textFramePreferences;
        var origin = original.textFramePreferences;
        prefs.insetSpacing = origin.insetSpacing;
        prefs.firstBaselineOffset = origin.firstBaselineOffset;
        prefs.minimumFirstBaselineOffset = origin.minimumFirstBaselineOffset;
        prefs.ignoreWrap = false;
        var story = original.parentStory;
        var selected = story.texts[0];
        if (options.take === "frame" && story.textContainers.length > 1) {
            var count = original.characters.length;
            if (!count) throw Error("Source frame is empty: " + name);
            selected = story.characters.itemByRange(original.characters[0].index, original.characters[count - 1].index);
            if (String(selected.contents) !== String(original.contents)) {
                throw Error("Cannot isolate this threaded text frame faithfully: " + name);
            }
        }
        var expected = String(selected.contents);
        selected.duplicate(LocationOptions.AT_BEGINNING, frame.parentStory.insertionPoints[0]);
        if (String(frame.parentStory.contents) !== expected) throw Error("Copied story differs: " + name);
        var keepTogether = options.keepTogether || [];
        for (var k = 0; k < keepTogether.length; k++) {
            var phrase = keepTogether[k];
            var index = expected.lastIndexOf(phrase);
            if (!phrase || index < 0) throw Error("Requested phrase not found: " + phrase);
            frame.parentStory.characters.itemByRange(index, index + phrase.length - 1).noBreak = true;
        }
        frame.strokeWeight = 0;
        frame.strokeColor = none;
        return frame;
    }

    function addFolio(page, options, layer, number, none) {
        var font = app.fonts.itemByName(options.font);
        if (!font.isValid || font.status !== FontStatus.INSTALLED) throw Error("Unavailable folio font: " + options.font);
        var frame = page.textFrames.add(layer, {
            geometricBounds: options.boundsPt, contents: String(number), label: "Folio " + number
        });
        frame.applyObjectStyle(doc.objectStyles[0], true, true);
        frame.textFramePreferences.insetSpacing = 0;
        frame.textFramePreferences.ignoreWrap = true;
        frame.fillColor = doc.swatches.itemByName(options.paperFill === false ? "None" : "Paper");
        frame.strokeWeight = 0;
        frame.strokeColor = none;
        var text = frame.parentStory.texts[0];
        text.appliedFont = font;
        text.pointSize = options.sizePt;
        text.justification = Justification.CENTER_ALIGN;
        return frame;
    }

    function addWrap(spread, layer, path, inward, label, none) {
        if (path.length < 4) return null;
        var item = spread.polygons.add(layer, {fillColor: none, strokeColor: none, nonprinting: true, label: label});
        item.paths[0].entirePath = path;
        item.textWrapPreferences.textWrapMode = TextWrapModes.CONTOUR;
        item.textWrapPreferences.textWrapSide = inward;
        item.textWrapPreferences.textWrapOffset = [0, 0, 0, 0];
        return item;
    }

    function printLines(frame) {
        var lines = frame.lines.everyItem().getElements();
        var values = [];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            values.push([line.baseline.toFixed(2), line.horizontalOffset.toFixed(2), line.endHorizontalOffset.toFixed(2)].join(","));
        }
        return values.join(";");
    }

    function file(ext) { return File(job.output + "/" + job.name + "." + ext); }

    try {
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        app.scriptPreferences.measurementUnit = MeasurementUnits.POINTS;
        var formats = ["indd", "idml", "pdf"];
        for (var x = 0; x < formats.length; x++) {
            if (file(formats[x]).exists) throw Error("Output already exists: " + file(formats[x]).fsName);
        }
        var input = File(job.source);
        var openDocs = app.documents.everyItem().getElements();
        for (var d = 0; d < openDocs.length; d++) {
            var opened = openDocs[d];
            if (opened.saved && opened.fullName && opened.fullName.fsName === input.fsName) {
                throw Error("Source is open. Use a saved copy as the input.");
            }
        }
        source = app.open(input, false);
        var sourcePage = source.pages.itemByName(String(job.pages[0]));
        if (!sourcePage.isValid) throw Error("Source page not found: " + job.pages[0]);
        var sourceSpread = sourcePage.parent;
        if (sourceSpread.pages.length !== 2 ||
            sourceSpread.pages[0].name !== String(job.pages[0]) ||
            sourceSpread.pages[1].name !== String(job.pages[1])) throw Error("Input pages must form one facing spread.");

        var width = job.pageSizePt[0], height = job.pageSizePt[1];
        for (var q = 0; q < 2; q++) {
            var b = sourceSpread.pages[q].bounds;
            if (Math.abs(b[3] - b[1] - width) > 0.75 || Math.abs(b[2] - b[0] - height) > 0.75) {
               throw Error("Configured page size differs from source.");
            }
        }

        doc = app.documents.add(job.showWindow);
        var docPrefs = doc.documentPreferences;
        docPrefs.pageWidth = width;
        docPrefs.pageHeight = height;
        docPrefs.facingPages = true;
        docPrefs.pagesPerDocument = 2;
        doc.sections[0].continueNumbering = false;
        doc.sections[0].pageNumberStart = job.pages[0];
        doc.viewPreferences.rulerOrigin = RulerOrigin.SPREAD_ORIGIN;
        doc.zeroPoint = [0, 0];
        if (doc.spreads.length !== 1 || doc.spreads[0].pages.length !== 2) throw Error("Expected one output spread.");
        var spread = doc.spreads[0];
        var artLayer = doc.layers[0];
        artLayer.name = "Tranh";
        var typeLayer = doc.layers.add({name: "Chữ"});
        var wrapLayer = doc.layers.add({name: "Đường bao reflow"});
        var none = doc.swatches[0];

        var art = spread.rectangles.add(artLayer, {
            geometricBounds: [0, 0, height, width * 2], fillColor: none, strokeColor: none, label: "Outline"
        });
        art.textWrapPreferences.textWrapMode = TextWrapModes.NONE;
        art.place(File(job.artwork));
        art.fit(FitOptions.FILL_PROPORTIONALLY);
        art.fit(FitOptions.CENTER_CONTENT);

        var frames = [], folios = [];
        for (var i = 0; i < 2; i++) {
            var options = job.columns[i];
            var original = uniqueSource(sourceSpread, options);
            frames[i] = addText(original, options, doc.pages[i], typeLayer, "Nội dung trang " + job.pages[i], none);
            if (job.folios && job.folios.length) {
                folios[i] = addFolio(doc.pages[i], job.folios[i], typeLayer, job.pages[i], none);
            }
        }

        doc.recompose();
        var originalLines = [printLines(frames[0]), printLines(frames[1])];
        var wraps = [null, null], selected;
        for (var c = 0; c < job.candidates.length; c++) {
            var candidate = job.candidates[c];
            for (var side = 0; side < 2; side++) {
                if (wraps[side]) wraps[side].remove();
                var inward = side ? TextWrapSideOptions.LEFT_SIDE : TextWrapSideOptions.RIGHT_SIDE;
                wraps[side] = addWrap(spread, wrapLayer, candidate.paths[side], inward, "Đường bao trang " + job.pages[side], none);
            }
            doc.recompose();
            var fits = !frames[0].overflows && !frames[1].overflows;
            note("shiftPt=" + candidate.shift + " overset=" + frames[0].overflows + "," + frames[1].overflows);
            if (fits) {
                selected = candidate;
                break;
            }
        }
        if (!selected) throw Error("Text does not fit any contour. Review artwork and text frames, keeping font and leading.");
        art.move(undefined, [0, selected.shift]);
        doc.recompose();
        var typesetFrames = frames.concat(folios);
        for (var n = 0; n < typesetFrames.length; n++) {
            var frame = typesetFrames[n];
            frame.strokeWeight = 0;
            frame.strokeColor = none;
            if (frame.overflows) throw Error("Overset: " + frame.label);
        }
        if (doc.links.length !== 1) throw Error("Expected one art link.");
        doc.links[0].unlink();
        for (var j = 0; j < frames.length; j++) {
            var runs = frames[j].parentStory.textStyleRanges.everyItem().getElements();
            for (var r = 0; r < runs.length; r++) {
                var font = runs[r].appliedFont;
                if (font && font.status !== FontStatus.INSTALLED) throw Error("Unavailable body font: " + font.name);
            }
            var actualLines = printLines(frames[j]);
            note("page " + job.pages[j] + " nativeWrap=" + Boolean(wraps[j]) +
                " reflow=" + (actualLines !== originalLines[j]) + " lines=" + actualLines);
        }

        doc.save(file("indd"));
        doc.exportFile(ExportFormat.INDESIGN_MARKUP, file("idml"));
        app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
        app.pdfExportPreferences.exportReaderSpreads = true;
        app.pdfExportPreferences.exportGuidesAndGrids = false;
        app.pdfExportPreferences.exportNonprintingObjects = false;
        doc.exportFile(ExportFormat.PDF_TYPE, file("pdf"));
        note("SUCCESS");
    } catch (error) {
        note("ERROR " + error + " line=" + error.line);
    } finally {
        if (source && source.isValid) source.close(SaveOptions.NO);
        if (!job.showWindow && doc && doc.isValid) doc.close(SaveOptions.NO);
        try { app.pdfExportPreferences.properties = priorPdf; } catch (restoreError) { note("PDF settings: " + restoreError); }
        app.scriptPreferences.measurementUnit = units;
        app.scriptPreferences.userInteractionLevel = interaction;
        log.close();
    }
})(twpJob);
