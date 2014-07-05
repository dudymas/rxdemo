// Modified from markdown.js from Hakim to handle external html files
(function () {
    /*jslint loopfunc: true, browser: true*/
    /*globals alert*/
    'use strict';

    var codeMirror = window.CodeMirror;
    var handleCode = function (cm) { window.eval(cm.getDoc().getValue()); };

    var setupCodeMirror = function setupCodeMirror() {
        var keymap = {};
        keymap['Ctrl-Enter'] = handleCode;
        var opts = {mode: 'javascript', theme: 'lesser-dark', extraKeys: keymap};
        var myTextArea = document.querySelector('textarea.CodeMirror');
        if (myTextArea) {
            opts.value = myTextArea.value;
            var cm = codeMirror(function (elt) {
                myTextArea.parentNode.replaceChild(elt, myTextArea);
            }, opts);
            setTimeout(function () { cm.refresh(); handleCode(cm); }, 0);
        }
    };

    var querySlidingHtml = function () {
        var sections = document.querySelectorAll('[data-html]'),
            section, j, jlen;

        for (j = 0, jlen = sections.length; j < jlen; j++) {
            section = sections[j];

            if (section.getAttribute('data-html').length) {

                var xhr = new XMLHttpRequest(),
                    url = section.getAttribute('data-html'),
                    cb = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                section.innerHTML = xhr.responseText;
                                setupCodeMirror();
                            } else {
                                section.outerHTML = '<section data-state="alert">ERROR: The attempt to fetch ' + url + ' failed with the HTTP status ' + xhr.status + '. Check your browser\'s JavaScript console for more details.</p></section>';
                            }
                        }
                    };

                xhr.onreadystatechange = cb;

                xhr.open('GET', url, false);
                try {
                    xhr.send();
                } catch (e) {
                    alert('Failed to get file' + url + '.' + e);
                }
            }
        }
    };

    querySlidingHtml();
})();
