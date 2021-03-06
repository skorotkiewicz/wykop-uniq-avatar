// ==UserScript==
// @name         Wykop Uniq Avatar
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Avatars for the Wykop.pl generated from user nickname
// @author       skorotkiewicz
// @match        https://www.wykop.pl/wpis/*
// @match        https://www.wykop.pl/mikroblog/*
// @match        https://www.wykop.pl/link/*
// @match        https://www.wykop.pl/wiadomosc-prywatna/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wykop.pl
// @grant        none
// @downloadURL https://raw.githubusercontent.com/skorotkiewicz/wykop-uniq-avatar/main/Wykop.Avatars.user.js
// @updateURL   https://raw.githubusercontent.com/skorotkiewicz/wykop-uniq-avatar/main/Wykop.Avatars.user.js
// ==/UserScript==

(function () {
  "use strict";

  let observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const p = 2;
          const c = document.createElement("canvas");
          const x = c.getContext("2d");
          c.width = 18;
          c.height = 14;
          const s = entry.target.innerText;
          const r = 1;

          observer.unobserve(entry.target);

          if (s) {
            for (
              let s = entry.target.innerText, r = 1, i = 28 + s.length;
              i--;

            ) {
              // xorshift32
              (r ^= r << 13), (r ^= r >>> 17), (r ^= r << 5);
              const X = i & 3,
                Y = i >> 2;
              if (i >= 28) {
                // seed state
                r += s.charCodeAt(i - 28);
                x.fillStyle =
                  "#" + ((r >> 8) & 0xffffff).toString(16).padStart(0, 6);
              } else {
                // draw pixel
                if (r >>> 29 > (X * X) / 3 + Y / 2)
                  x.fillRect(p * 3 + p * X, p * Y, p, p),
                    x.fillRect(p * 3 - p * X, p * Y, p, p);
              }
            }
          }

          entry.target.prepend(c);
        } else {
          if (entry.target.firstChild.tagName === "CANVAS")
            entry.target.firstChild.remove();
        }
      });
    },
    { rootMargin: "0px 0px 0px 0px" }
  );

  document.querySelectorAll(".author a>b").forEach((user) => {
    observer.observe(user);
  });
})();
