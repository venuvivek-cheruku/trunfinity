function createCarousel(e, t, n, s, o) {
  const r = document.querySelector(e),
    i = Array.from(document.querySelectorAll(t)),
    c = document.querySelector(n),
    a = document.querySelector(s);
  let l,
    u,
    d,
    f,
    v = 0,
    h = !1,
    p = i.length,
    y = !1;
  r &&
    ((d = window.getComputedStyle(r)),
    (f = parseFloat(d.gap) > 0 ? parseFloat(d.gap) : 0));
  const {
    endless: m = !1,
    autoplay: L = !1,
    arrowButtons: E = !1,
    touchSwipe: g = !1,
    keyboardKeys: w = !1,
    autoplaySpeed: S = 3e3,
    cursorArrows: X = !1,
    mouseDrag: x = !1,
    hoverSwipe: C = !1,
    dynamicDots: k = !1,
    autoplayPauseOnHover: b = !1,
    resetOnInteraction: q = !0,
    sliderVertical: A = !1,
  } = o;
  function B() {
    E &&
      (c || a) &&
      (0 !== v || m
        ? ((c.style.opacity = 1), (c.style.cursor = "pointer"))
        : ((c.style.opacity = 0.5), (c.style.cursor = "not-allowed")),
      y && !m
        ? ((a.style.opacity = 0.5), (a.style.cursor = "not-allowed"))
        : ((a.style.opacity = 1), (a.style.cursor = "pointer")));
  }
  function I() {
    if (!r || !i || 0 === i.length) return !1;
    const e = i.length - 1,
      t = i[e],
      n = r.getBoundingClientRect(),
      s = t.getBoundingClientRect();
    return (y = A ? s.top <= n.bottom + f : s.left <= n.right + f);
  }
  function R() {
    if (!m && 0 === v) return void B();
    if (((y = !1), p <= 1 || h)) return;
    (h = !0), (l = v);
    const e = i[(v = (v - 1 + p) % p)].offsetWidth + f;
    if (r) {
      if (A) {
        const e = i[v].offsetHeight + f;
        r.style.transform = `translateY(-${e}px)`;
      } else r.style.transform = `translateX(-${e}px)`;
      r.insertBefore(i[v], r.firstChild);
    }
    setTimeout(() => {
      (r.style.transform = ""),
        (r.style.transition = "transform 0.5s ease-in-out"),
        k && M();
    }, 50),
      setTimeout(() => {
        (r.style.transition = "none"), (h = !1), m || B();
      }, 500);
  }
  function $() {
    if (m || v !== p - 1)
      if (m || !y) {
        if (
          (I(), !(p <= 1 || h) && ((h = !0), (l = v), (v = (v + 1) % p), r))
        ) {
          const e = i[l].offsetWidth + f;
          if (A) {
            const e = i[l].offsetHeight + f;
            r.style.transform = `translateY(-${e}px)`;
          } else r.style.transform = `translateX(-${e}px)`;
          (r.style.transition = "transform 0.5s ease-in-out"),
            setTimeout(() => {
              r.appendChild(i[l]),
                (r.style.transition = "none"),
                (r.style.transform = ""),
                (h = !1),
                m || B(),
                k && M();
            }, 500);
        }
      } else B();
  }
  if (
    (i.forEach((e, t) => {
      e.dataset.slideIndex = t;
    }),
    m &&
      p > 1 &&
      (i.forEach((e, t) => {
        const n = e.cloneNode(!0);
        r.appendChild(n), i.push(n), (p = i.length);
      }),
      (l = v = 0)),
    window.addEventListener("resize", () => {
      I();
    }),
    window.addEventListener("load", () => {
      I();
    }),
    k)
  ) {
    function H(e) {
      const t = document.createElement("span");
      t.classList.add("dot"),
        t.addEventListener("click", () => {
          h ||
            (function (e) {
              if (h || e === v) return;
              const t = e - v;
              t > 0 ? $() : t < 0 && R();
              L && q && T();
            })(e);
        }),
        u.appendChild(t);
    }
    function M() {
      const e = u.querySelector(".active-dot");
      e && e.classList.remove("active-dot");
      let t = v % (p / 2);
      t < 0 && !m && (t += p / 2);
      const n = u.children[t];
      n && n.classList.add("active-dot");
    }
    (u = document.createElement("div")).classList.add("dots-container"),
      r.parentNode.insertBefore(u, r.nextSibling),
      i.forEach((e, t) => {
        t >= p / 2 || H(t);
      }),
      M();
  }
  function T() {
    clearInterval(D), F();
  }
  let D;
  function F() {
    clearInterval(D),
      (D = setInterval(() => {
        $();
      }, S));
  }
  E &&
    c &&
    a &&
    (c.addEventListener("click", () => {
      R(), L && q && T();
    }),
    a.addEventListener("click", () => {
      $(), L && q && T();
    })),
    w &&
      document.addEventListener("keydown", (e) => {
        h ||
          ((function (e) {
            "ArrowLeft" === e.key ? R() : "ArrowRight" === e.key && $();
          })(e),
          L && q && T());
      }),
    x &&
      (function () {
        let e = !1,
          t = 0,
          n = 0;
        r &&
          (r.addEventListener(
            "mousedown",
            function (n) {
              (e = !1),
                (t = n.clientX),
                i.forEach((e) => {
                  const t = e.querySelectorAll("img");
                  t.length > 0
                    ? t.forEach((e) => {
                        e &&
                          ((e.style.pointerEvents = "none"),
                          (e.style.userSelect = "none"));
                      })
                    : (e.style.userSelect = "none");
                });
            },
            { passive: !0 }
          ),
          r.addEventListener(
            "mousemove",
            function (s) {
              e || (Math.abs(s.clientX - t) > 10 && (e = !0)),
                e && (n = s.clientX);
            },
            { passive: !0 }
          ),
          r.addEventListener(
            "mouseup",
            function () {
              if (!e) return;
              if (
                ((e = !1),
                i.forEach((e) => {
                  e.querySelectorAll("img").forEach((e) => {
                    e &&
                      ((e.style.pointerEvents = "auto"),
                      (e.style.userSelect = "default"));
                  }),
                    (e.style.cursor = "grab");
                }),
                h)
              )
                return;
              const s = n - t;
              s > 0 ? R() : s < 0 && $(), L && q && T();
            },
            { passive: !0 }
          ),
          r.addEventListener(
            "touchstart",
            function (n) {
              (e = !1), (t = n.touches[0].clientX);
            },
            { passive: !0 }
          ),
          r.addEventListener(
            "touchmove",
            function (s) {
              e || (Math.abs(s.touches[0].clientX - t) > 10 && (e = !0)),
                e && (n = s.touches[0].clientX);
            },
            { passive: !0 }
          ),
          r.addEventListener(
            "touchend",
            function () {
              if (!e) return;
              if (((e = !1), h)) return;
              const s = n - t;
              s > 0 ? R() : s < 0 && $(), L && q && T();
            },
            { passive: !0 }
          ));
      })(),
    g &&
      (function () {
        let e = !1,
          t = 0,
          n = 0;
        r &&
          (r.addEventListener(
            "touchstart",
            function (n) {
              (e = !1), (t = n.touches[0].clientX);
            },
            { passive: !0 }
          ),
          r.addEventListener(
            "touchmove",
            function (s) {
              e || (Math.abs(s.touches[0].clientX - t) > 10 && (e = !0)),
                e && (n = s.touches[0].clientX);
            },
            { passive: !0 }
          ),
          r.addEventListener(
            "touchend",
            function () {
              if (!e) return;
              if (((e = !1), h)) return;
              const s = n - t;
              s > 0 ? R() : s < 0 && $(), L && q && T();
            },
            { passive: !0 }
          ));
      })(),
    X &&
      (function () {
        if (r) {
          const e = r.getBoundingClientRect().width / 2;
          let t = null;
          r.addEventListener("mousemove", function (n) {
            const s = n.pageX - r.offsetLeft;
            this.classList.remove("cursor-prev", "cursor-next"),
              t && r.removeEventListener("click", t, !1),
              s > e
                ? (this.classList.add("cursor-next"), (t = $))
                : (this.classList.add("cursor-prev"), (t = R)),
              r.addEventListener("click", t, !1),
              L && q && T();
          });
        }
      })(),
    C &&
      (function () {
        const e = r.getBoundingClientRect().width / 2;
        r.addEventListener("mousemove", function (t) {
          const n = t.pageX - r.offsetLeft;
          this.classList.remove("cursor-prev", "cursor-next"),
            n > e
              ? (this.classList.add("cursor-next"), $(), L && q && T())
              : (this.classList.add("cursor-prev"), R(), L && q && T());
        });
      })(),
    b &&
      r &&
      (r.addEventListener("mouseover", function () {
        clearInterval(D);
      }),
      r.addEventListener("mouseout", F)),
    L && F();
}
