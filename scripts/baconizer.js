const baconalphabet = "abcdefghijklmnopqrstuvwxyz !-.?,";
var rawbacontext = "";

window.onload = function(){
    const hiddentext = document.getElementById("hiddentext");
    const rawbacon = document.getElementById("rawbacon");
    const messagetext = document.getElementById("messagetext");
    const bacon = document.getElementById("bacon");

    const encryptedtext = document.getElementById("encryptedtext");
    const decryptedtext = document.getElementById("decryptedtext");    

    const updateHiddenText = function (event) {
        var plain = hiddentext.value.toLowerCase();
        rawbacontext = ""
        for (const c of plain) {
            var idx = baconalphabet.indexOf(c);
            if (idx != -1) {
                rawbacontext +=`${idx.toString(2).padStart(5, '0')}`;
            }
        }
        rawbacon.innerHTML = rawbacontext.replace(/(.{5})/g, '$1 ').trim();

        updateMessageText();
    }

    const updateMessageText = function (event) {
        var baconidx = 0;
        var bacontext = "";
        var message = messagetext.value;
        
        for (var i = 0; i < message.length; i++) {
            var notValid = message.charAt(i).match(/[^A-Za-z]/);
        
            if (rawbacontext.charAt(baconidx) == "1" && !notValid) {
                // Math A sans = U+1D5A0 = 120224
                // latin A = U+0041 = 65
                var offsetCapital = 120224-65
                var offsetLowercase = 120224-65-6
                var charcodeLower = message.codePointAt(i) >= 65+26+6;

                bacontext += String.fromCodePoint(message.codePointAt(i) + (charcodeLower ? offsetLowercase : offsetCapital));
            } else {
                bacontext += message.charAt(i);
            }
            if (!notValid) {
                baconidx++;
            }
        }

        var validLength = 0
        if (message != "") {
            validLength = message.match(/[A-Za-z]/g).length;
        }
        if (validLength < rawbacontext.length) {
            bacontext += rawbacontext.substr(validLength, rawbacontext.length-validLength);
        }

        bacon.innerHTML = bacontext;
    }

    const updateDecrypedText = function (event) { 
        var encrypted = encryptedtext.value;
        var decrypted = "";
        for (const c of encrypted) {
            
            if (c.match(/[A-Za-z]/)) {
                decrypted += 0;
                // Mathematical sans-serif not latin !!!
            } else if (c.codePointAt(0) >= 120224 && c.codePointAt(0) < 120224 + 26*2) {
                decrypted += 1;
            }
        }
        var decryptedString = "";
        var groups = decrypted.match(/.{1,5}/g);
        for (const group of groups) {
            if (group.length == 5) {
                var idx = parseInt(group, 2);
                decryptedString += baconalphabet[idx];
            }
        }

        decryptedtext.innerHTML = decryptedString;
    }

    hiddentext.addEventListener("input", updateHiddenText);
    hiddentext.addEventListener("propertychange", updateHiddenText);
    messagetext.addEventListener("input", updateMessageText);
    messagetext.addEventListener("propertychange", updateMessageText);

    encryptedtext.addEventListener("input", updateDecrypedText);
    encryptedtext.addEventListener("propertychange", updateDecrypedText);

    updateHiddenText();
}
