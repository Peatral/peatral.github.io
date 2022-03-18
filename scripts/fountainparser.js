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
  if (window.location.search.match(/raw/gi)) {
    return;
  }
  var scriptElement = document.getElementById("script");
  if (scriptElement == undefined) {
    return;
  }
  var script = scriptElement.innerHTML;

  script = script.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
  script = script.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  script = script.replace(/\*(.*?)\*/g, "<em>$1</em>");
  script = script.replace(/_(.*?)_/g, "<span class='underlined'>$1</span>");
  script = script.replace(/\[\[(.*?)\]\]/gm, '<span class="note">$1</span>\n');

  var scriptLines = script.split("\n");
  scriptElement.remove();

  var scene = document.getElementById("scene");

  //script = script.replace(/[\r\n]{2,}/g, "\n\n");
  // Title
  //(after an empty lines)(captures everything after . or after vv)(captures scene number inbetween ##)
  //script = script.replace(
  //  /^(?:(?:\.(.*?))|((?:INT\.\/EXT|INT\/EXT|INT|EXT|EST|I\/E)[\. ].*?))(?:#([A-Za-z0-9\.-]+)#)?$/gim,
  //  '<h1 class="sceneheading">$1$2<strong>$3</strong></h1>\n'
  //);

  //Actor
  //script = script.replace(
  //  /^[\n\r]^(?<!\!)([A-Z -]+)[\n\r](?![\n\r]+)/gm,
  //  '<p class="actor">$1</p>\n'
  //);

  //script = script.replace(
  ///(?<=^<p class="actor">.*?<\/p>[\n\r]?)([\w ,.äüö;:!?]+$)/gm,
  //  '<p class="text">$1</p>'
  //);

  //script = script.replace(/<p class="text"><\/p>/g, "");

  //script = script.replace(
  //  /^(?!<p>|<h1>)(?:!(.+)|(.+))(?!<\/p>|<\/h1>)$/gm,
  //  '<p class="action">$1</p\n>'
  //);
  //scene.innerHTML = script;

  var lastline = "empty";
  for (var i = 0; i < scriptLines.length; i++) {
    var line = scriptLines[i].trim();
    if (line.length > 0) {
      var elem = document.createElement("p");

      if (lastline === "empty") {
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
