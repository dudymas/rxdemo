// Modified from markdown.js from Hakim to handle external html files
(function () {
    /*jslint loopfunc: true, browser: true*/
    /*globals alert*/
    'use strict';

    var codeMirror = window.CodeMirror;
    var console = window.console;
    var handleCode = window.eval;

    var setupCodeMirror = function setupCodeMirror() {
        var keymap = {};
        keymap['Ctrl-Enter'] = function (cm) { handleCode(cm.getDoc().getValue()); };
        var opts = {mode: 'javascript', theme: 'lesser-dark', extraKeys: keymap};
        var myTextArea = document.querySelector('textarea.CodeMirror');
        if (myTextArea) {
            opts.value = myTextArea.value;
            codeMirror(function (elt) {
                myTextArea.parentNode.replaceChild(elt, myTextArea);
            }, opts);
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
