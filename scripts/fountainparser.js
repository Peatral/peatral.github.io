function formatLine(text, regex, replace, open, close) {
  var count = (text.match(regex) || []).length;
  var replaced = 0;
  while (replaced < count && !(replaced === count - 1 && count % 2 === 1)) {
    if (replaced % 2 === 0) {
      text = text.replace(replace, open);
    } else {
      text = text.replace(replace, close);
    }
    replaced += 1;
  }
  return text;
}

window.onload = function () {
  var script = document
    .getElementById("script")
    .innerHTML.replaceAll("<p>", "")
    .replaceAll("</p>", "")
    .split("\n");
  document.getElementById("script").remove();

  var scene = document.getElementById("scene");

  var lastline = "empty";
  for (var i = 0; i < script.length; i++) {
    var line = script[i].trim();
    if (line.length > 0) {
      // extension of default markdown, _ also makes italic, therefore:
      // \_ = _ and \\\_ = \_, so basically escape everything once
      // means:
      // _ = italic
      // \_ = underlined
      // \\_ = \ + italic
      // \\\_ = _
      // yep, the right way to write _ is now \\\_

      // replace the _ with the underlined sections and let the \_ be
      var count = (line.match(/(?<!\\)_/g) || []).length;
      var replaced = 0;
      while (replaced < count && !(replaced === count - 1 && count % 2 === 1)) {
        if (replaced % 2 === 0) {
          line = line.replace(/(?<!\\)_/g, "<span class='underlined'>");
        } else {
          line = line.replace(/(?<!\\)_/g, "</span>");
        }
        replaced += 1;
      }
      line = line.replaceAll("\\_", "_");

      var elem = document.createElement("p");

      if (lastline === "empty") {
        // Title
        if (
          line.startsWith(".") ||
          /^(INT\.\/EXT|INT\/EXT|INT|EXT|EST|I\/E)[\. ]/i.test(line)
        ) {
          if (line.startsWith(".")) {
            line = line.substr(1);
          }
          elem = document.createElement("h1");
          elem.classList.add("sceneheading");
          lastline = "sceneheading";
          // Note
        } else if (line.startsWith("[[") && line.endsWith("]]")) {
          elem.classList.add("note");
          line = line.substr(2, line.length - 4);
          // no lastline because notes get skipped

          // Actor
        } else if (line.toUpperCase() == line && !line.startsWith("!")) {
          elem.classList.add("actor");
          lastline = "actor";
        } else {
          if (line.startsWith("!")) {
            line = line.substr(1);
          }
          elem.classList.add("action");
          lastline = "action";
        }
        // Title continuation (for some reason)
      } else if (lastline === "sceneheading") {
        elem.classList.add("sceneheading");
        lastline = "sceneheading";
        // Text after Actor or Text continuation
      } else if (lastline === "actor" || lastline === "text") {
        elem.classList.add("text");
        lastline = "text";
        // action after action
      } else if (lastline === "action") {
        elem.classList.add("action");
        lastline = "action";
      }

      elem.innerHTML = line;
      scene.appendChild(elem);
    } else {
      lastline = "empty";
    }
  }
};
