function _typeof(obj) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (obj) {
            return typeof obj;
          }
        : function (obj) {
            return obj &&
              "function" == typeof Symbol &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? "symbol"
              : typeof obj;
          }),
    _typeof(obj)
  );
}
function _regeneratorRuntime() {
  "use strict";
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime =
    function _regeneratorRuntime() {
      return exports;
    };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty =
      Object.defineProperty ||
      function (obj, key, desc) {
        obj[key] = desc.value;
      },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return (
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0,
      }),
      obj[key]
    );
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return (obj[key] = value);
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator =
        outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return (
      defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context),
      }),
      generator
    );
  }
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype &&
    NativeIteratorPrototype !== Op &&
    hasOwn.call(NativeIteratorPrototype, iteratorSymbol) &&
    (IteratorPrototype = NativeIteratorPrototype);
  var Gp =
    (GeneratorFunctionPrototype.prototype =
    Generator.prototype =
      Object.create(IteratorPrototype));
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value &&
          "object" == _typeof(value) &&
          hasOwn.call(value, "__await")
          ? PromiseImpl.resolve(value.__await).then(
              function (value) {
                invoke("next", value, resolve, reject);
              },
              function (err) {
                invoke("throw", err, resolve, reject);
              }
            )
          : PromiseImpl.resolve(value).then(
              function (unwrapped) {
                (result.value = unwrapped), resolve(result);
              },
              function (error) {
                return invoke("throw", error, resolve, reject);
              }
            );
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return (previousPromise = previousPromise
          ? previousPromise.then(
              callInvokeWithMethodAndArg,
              callInvokeWithMethodAndArg
            )
          : callInvokeWithMethodAndArg());
      },
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state)
        throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg; ; ) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method)
          context.sent = context._sent = context.arg;
        else if ("throw" === context.method) {
          if ("suspendedStart" === state)
            throw ((state = "completed"), context.arg);
          context.dispatchException(context.arg);
        } else
          "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (
            ((state = context.done ? "completed" : "suspendedYield"),
            record.arg === ContinueSentinel)
          )
            continue;
          return { value: record.arg, done: context.done };
        }
        "throw" === record.type &&
          ((state = "completed"),
          (context.method = "throw"),
          (context.arg = record.arg));
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method)
      return (
        (context.delegate = null),
        ("throw" === methodName &&
          delegate.iterator["return"] &&
          ((context.method = "return"),
          (context.arg = undefined),
          maybeInvokeDelegate(delegate, context),
          "throw" === context.method)) ||
          ("return" !== methodName &&
            ((context.method = "throw"),
            (context.arg = new TypeError(
              "The iterator does not provide a '" + methodName + "' method"
            )))),
        ContinueSentinel
      );
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type)
      return (
        (context.method = "throw"),
        (context.arg = record.arg),
        (context.delegate = null),
        ContinueSentinel
      );
    var info = record.arg;
    return info
      ? info.done
        ? ((context[delegate.resultName] = info.value),
          (context.next = delegate.nextLoc),
          "return" !== context.method &&
            ((context.method = "next"), (context.arg = undefined)),
          (context.delegate = null),
          ContinueSentinel)
        : info
      : ((context.method = "throw"),
        (context.arg = new TypeError("iterator result is not an object")),
        (context.delegate = null),
        ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };
    1 in locs && (entry.catchLoc = locs[1]),
      2 in locs && ((entry.finallyLoc = locs[2]), (entry.afterLoc = locs[3])),
      this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    (record.type = "normal"), delete record.arg, (entry.completion = record);
  }
  function Context(tryLocsList) {
    (this.tryEntries = [{ tryLoc: "root" }]),
      tryLocsList.forEach(pushTryEntry, this),
      this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length; )
              if (hasOwn.call(iterable, i))
                return (next.value = iterable[i]), (next.done = !1), next;
            return (next.value = undefined), (next.done = !0), next;
          };
        return (next.next = next);
      }
    }
    return { next: doneResult };
  }
  function doneResult() {
    return { value: undefined, done: !0 };
  }
  return (
    (GeneratorFunction.prototype = GeneratorFunctionPrototype),
    defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0,
    }),
    defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0,
    }),
    (GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    )),
    (exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return (
        !!ctor &&
        (ctor === GeneratorFunction ||
          "GeneratorFunction" === (ctor.displayName || ctor.name))
      );
    }),
    (exports.mark = function (genFun) {
      return (
        Object.setPrototypeOf
          ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype)
          : ((genFun.__proto__ = GeneratorFunctionPrototype),
            define(genFun, toStringTagSymbol, "GeneratorFunction")),
        (genFun.prototype = Object.create(Gp)),
        genFun
      );
    }),
    (exports.awrap = function (arg) {
      return { __await: arg };
    }),
    defineIteratorMethods(AsyncIterator.prototype),
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }),
    (exports.AsyncIterator = AsyncIterator),
    (exports.async = function (
      innerFn,
      outerFn,
      self,
      tryLocsList,
      PromiseImpl
    ) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );
      return exports.isGeneratorFunction(outerFn)
        ? iter
        : iter.next().then(function (result) {
            return result.done ? result.value : iter.next();
          });
    }),
    defineIteratorMethods(Gp),
    define(Gp, toStringTagSymbol, "Generator"),
    define(Gp, iteratorSymbol, function () {
      return this;
    }),
    define(Gp, "toString", function () {
      return "[object Generator]";
    }),
    (exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return (
        keys.reverse(),
        function next() {
          for (; keys.length; ) {
            var key = keys.pop();
            if (key in object)
              return (next.value = key), (next.done = !1), next;
          }
          return (next.done = !0), next;
        }
      );
    }),
    (exports.values = values),
    (Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
        if (
          ((this.prev = 0),
          (this.next = 0),
          (this.sent = this._sent = undefined),
          (this.done = !1),
          (this.delegate = null),
          (this.method = "next"),
          (this.arg = undefined),
          this.tryEntries.forEach(resetTryEntry),
          !skipTempReset)
        )
          for (var name in this)
            "t" === name.charAt(0) &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1)) &&
              (this[name] = undefined);
      },
      stop: function stop() {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return (
            (record.type = "throw"),
            (record.arg = exception),
            (context.next = loc),
            caught && ((context.method = "next"), (context.arg = undefined)),
            !!caught
          );
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally)
                throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (
            entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc
          ) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry &&
          ("break" === type || "continue" === type) &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc &&
          (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return (
          (record.type = type),
          (record.arg = arg),
          finallyEntry
            ? ((this.method = "next"),
              (this.next = finallyEntry.finallyLoc),
              ContinueSentinel)
            : this.complete(record)
        );
      },
      complete: function complete(record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return (
          "break" === record.type || "continue" === record.type
            ? (this.next = record.arg)
            : "return" === record.type
            ? ((this.rval = this.arg = record.arg),
              (this.method = "return"),
              (this.next = "end"))
            : "normal" === record.type && afterLoc && (this.next = afterLoc),
          ContinueSentinel
        );
      },
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc)
            return (
              this.complete(entry.completion, entry.afterLoc),
              resetTryEntry(entry),
              ContinueSentinel
            );
        }
      },
      catch: function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        return (
          (this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc,
          }),
          "next" === this.method && (this.arg = undefined),
          ContinueSentinel
        );
      },
    }),
    exports
  );
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}
function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
function _iterableToArrayLimit(arr, i) {
  var _i =
    null == arr
      ? null
      : ("undefined" != typeof Symbol && arr[Symbol.iterator]) ||
        arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (((_x = (_i = _i.call(arr)).next), 0 === i)) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else
        for (
          ;
          !(_n = (_s = _x.call(_i)).done) &&
          (_arr.push(_s.value), _arr.length !== i);
          _n = !0
        );
    } catch (err) {
      (_d = !0), (_e = err);
    } finally {
      try {
        if (
          !_n &&
          null != _i["return"] &&
          ((_r = _i["return"]()), Object(_r) !== _r)
        )
          return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it =
    (typeof Symbol !== "undefined" && o[Symbol.iterator]) || o["@@iterator"];
  if (!it) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e2) {
          throw _e2;
        },
        f: F,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e3) {
      didErr = true;
      err = _e3;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
// huhh???! what you're doing in my source!!
// spoilers ahead!!! easter eggs to be seen!!!!! aaaaaaahhh!!!!!!!
// there's huge amount of easter eggs on this site, by reading source you'll spoiler yourself everything
var spoilers_ahead = "Easter egg spoilers ahead!!!!";

// disable perfomance heavy tasks when slow device
function isMobile() {
  var match = window.matchMedia || window.msMatchMedia;
  if (match) {
    var mq = match("(pointer:coarse)");
    return mq.matches;
  }
  return false;
}
var cookies = {};
document.cookie.split(";").forEach(function (cookie) {
  var _cookie$split = cookie.split("="),
    _cookie$split2 = _slicedToArray(_cookie$split, 2),
    key = _cookie$split2[0],
    value = _cookie$split2[1];
  cookies[key.trim()] = value;
});

function updateNewPhotos() {
  if(!cookies["lastPhoto"]) {
    document.getElementById("new-photos").innerText = "(!)";
    document.getElementById("new-photos").textContent = "(!)";
  } else {
    fetch("https://album.dimden.dev/api/lastphoto").then(function (i) {
      return i.json();
    }).then(function (i) {
      if(i.date > parseInt(cookies["lastPhoto"])) {
        document.getElementById("new-photos").innerText = "(!)";
        document.getElementById("new-photos").textContent = "(!)";
      } else {
        document.getElementById("new-photos").innerText = "";
        document.getElementById("new-photos").textContent = "";
      }
    });
  }
}
updateNewPhotos();
setInterval(updateNewPhotos, 1000 * 60 * 5);

var mobile = isMobile();
var isSlow = mobile;
var fps = 0, cfps = 0;
if (!isSlow) {
  var before = 0,
    now;
  var last25 = new Array(25).fill(35);
  var i25 = 0;
  var fpsElement = document.getElementById("fps");
  if (window.requestAnimationFrame)
    window.requestAnimationFrame(function loop(time) {
      now = time;
      fps = Math.round(1000 / (now - before));
      before = now;
      last25.push(fps);
      if (last25.length > 25) last25.shift();
      if (i25++ > 10) {
        i25 = 0;
        cfps = Math.round(
          last25.reduce(function (a, b) {
            return a + b;
          }, 0) / 25
        );
        if (!isFinite(cfps)) {
          fpsElement.innerText = "";
          fpsElement.textContent = "";
        } else {
          if (fpsElement.innerText != cfps) {
            fpsElement.innerText = cfps;
            fpsElement.textContent = cfps;
          }
        }
      }
      window.requestAnimationFrame(loop);
    });
  setTimeout(function() {
    var perf = setInterval(function () {
      var lp = Math.round(
        last25.reduce(function (a, b) {
          return a + b;
        }, 0) / 25
      );
      if (lp < 30) {
        try {
          if (!rainStopped) {
            rainStopped = true;
            stopRain();
            document.getElementById("debug").innerText =
              "Slow device, disabled rain";
            document.getElementById("debug").textContent =
              "Slow device, disabled rain";
            setTimeout(function () {
              document.getElementById("debug").innerText = "";
              document.getElementById("debug").textContent = "";
            }, 5000);
          }
        } catch (e) {}
      }
      if (lp < 28) {
        clearInterval(perf);
        document.getElementById("debug").innerText =
          "Slow device, disabled effects";
        document.getElementById("debug").textContent =
          "Slow device, disabled effects";
        setTimeout(function () {
          document.getElementById("debug").innerText = "";
          document.getElementById("debug").textContent = "";
        }, 5000);
        // slow
        isSlow = true;
        var root = document.querySelector(":root");
        root.style.setProperty("--body-text-shadow", "none");
        root.style.setProperty("--green-text-shadow", "none");
        root.style.setProperty("--firefox-body-shadow", "none");
        root.style.setProperty("--firefox-green-shadow", "none");
        root.style.setProperty("--letter-shadow", "none");
        kelvin.classList.remove("kelvin-light");
      }
    }, 2500);
  }, 2500);
}
if (isSlow) {
  document.getElementById("cool-sites").style.display = "none";
}

// Random link blinking
var navlinks = document.getElementsByClassName("navlink");
setInterval(function () {
  if (mirror) return;
  var random = Math.floor(Math.random() * navlinks.length);
  navlinks[random].style.color = "#2c9080";
  setTimeout(function () {
    navlinks[random].style.color = "white";
  }, 500);
}, 2000);
var switchOn = true;
var beep = document.createElement("audio");
beep.src = "/sounds/beep.mp3";
beep.style.display = "none";
document.body.appendChild(beep);
document.getElementById("switch").onclick = function () {
  switchOn = !switchOn;
  beep.play();
  if (switchOn) {
    document.getElementById("logo").className = "";
    letters.forEach(function (l) {
      if (fell && l.id === "logo-n") return;
      l.style.filter =
        "brightness(1) drop-shadow(0 0 0.75rem rgba(20, 220, 187, 0.35))";
    });
    document.getElementById("switch").src = "https://dimden.dev/images/electricity_on.png";
  } else {
    letters.forEach(function (l) {
      if (fell && l.id === "logo-n") return;
      l.style.filter = "brightness(0.2)";
    });
    document.getElementById("logo").className = "noanimation";
    document.getElementById("switch").src = "https://dimden.dev/images/electricity_off.png";
  }
};

// logo
var letters = Array.from(document.getElementsByClassName("letter"));
var d = document.getElementById("logo-d");
var n = document.getElementById("logo-n");
var hotel = document.getElementById("hotel");
var fell = false;

// setInterval(() => {
//     let random = Math.random() + 0.65;
//     hotel.style.opacity = random;
//     if(!switchOn) return;
//     letters.forEach(l => {
//         if(fell && l.id === "logo-n") return;
//         l.style.opacity = random;
//     })
// }, 20);

if (!isSlow)
  setInterval(function () {
    if (mirror) return;
    if (isSlow) return;
    var fn = function fn() {
      if (!switchOn) return;
      d.style.filter = "brightness(0)";
      setTimeout(function () {
        return (d.style.filter =
          "brightness(0.9) drop-shadow(0 0 0.75rem rgba(20, 220, 187, 0.35))");
      }, 30);
    };
    var _int = setInterval(fn, 60);
    setTimeout(function () {
      return clearInterval(_int);
    }, 700 + Math.random() * 500);
  }, 7000);
var c = 0,
  c2 = false;
var r = 4;
n.addEventListener("click", function () {
  if (mirror) return;
  if (c2) return;
  n.style.transform = "rotate(".concat(r++, "deg)");
  n.style.webkitTransform = "rotate(".concat(r, "deg)");
  if (c++ > 5) {
    n.style.color = "rgba(100, 100, 100, 0.9)";
    var i = 3;
    var f = 0;
    var f2 = true;
    var f3 = true;
    fell = true;
    n.style.filter = "brightness(0.2)";
    n.classList.add("noanimation");
    var _int2 = setInterval(function () {
      if (i > window.screen.availWidth / 4) {
        clearInterval(_int2);
      }
      n.style.top = "".concat((i += f), "px");
      n.style.transform = "rotate(".concat(r++, "deg)");
      c2 = true;
      if (f2) {
        if (f3) {
          f++;
          f3 = false;
        } else f3 = true;
        f2 = false;
      } else f2 = true;
    }, 5);
  }
});


// Visualizer
window.AudioContext =
  window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var startEqualizer = function startEqualizer(audio) {
  var ctx = new AudioContext();
  var analyser = ctx.createAnalyser();
  var audioSrc = ctx.createMediaElementSource(audio);
  audioSrc.connect(analyser);
  analyser.connect(ctx.destination);
  var canvas = document.getElementById("doom-canvas"),
    cwidth = canvas.width,
    cheight = canvas.height - 2,
    meterWidth = 10,
    capHeight = 2,
    capStyle = "#fff",
    meterNum = 800 / (10 + 2),
    capYPositionArray = [];
  (ctx = canvas.getContext("2d")),
    (gradient = ctx.createLinearGradient(0, 0, 0, 300));
  gradient.addColorStop(1, "#fff");
  gradient.addColorStop(0.8, "#ff0");
  gradient.addColorStop(0.55, "#f00");
  // loop
  function renderFrame() {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var step = Math.round(array.length / meterNum); //sample limited data from the total array
    ctx.clearRect(0, 0, cwidth, cheight);
    for (var i = 0; i < meterNum; i++) {
      var value = array[i * step];
      if (capYPositionArray.length < Math.round(meterNum)) {
        capYPositionArray.push(value);
      }
      ctx.fillStyle = capStyle;
      //draw the cap, with transition effect
      if (value < capYPositionArray[i]) {
        ctx.fillRect(
          i * 12,
          cheight - --capYPositionArray[i],
          meterWidth,
          capHeight
        );
      } else {
        ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
        capYPositionArray[i] = value;
      }
      ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
      ctx.fillRect(
        i * 12 /*meterWidth+gap*/,
        cheight - value + capHeight,
        meterWidth,
        cheight
      ); //the meter
    }

    requestAnimationFrame(renderFrame);
  }
  renderFrame();
};
var text = "";
var pon = false;
var doomPlaying = false;
if (!isSlow)
  document.onkeydown = function (e) {
    if (mirror) return;
    text += e.key.toLowerCase();
    if (text.length > 50) text = text.slice(1);
    if (text.endsWith("polybius")) {
      if (pon) return;
      pon = true;
      var _letters = Array.from(document.getElementsByClassName("letter"));
      _letters.forEach(function (l) {
        l.style.display = "none";
      });
      document.getElementById("wires").style.display = "none";
      document.getElementById("mewo").style.display = "none";
      document.getElementById("switch").style.display = "none";
      var img = document.createElement("img");
      img.src = "/polybius.webp";
      img.height = "80";
      document.getElementById("logo").appendChild(img);
      document.getElementById("copyright").innerText =
        "(c) 1981 SINNESLÖSCHEN INC.";
      document.getElementById("copyright").textContent =
        "(c) 1981 SINNESLÖSCHEN INC.";
    } else if (text.endsWith("lain") && !text.endsWith("explain")) {
      document.body.style.backgroundImage = "url(/images/lain.gif)";
      document.getElementById("bg").src = "/images/lain.gif";
    } else if (
      text.endsWith("sulfur") ||
      text.endsWith("sulphur") ||
      text.endsWith("brimstone")
    ) {
      document.getElementById("brimstone").hidden = false;
    } else if (text.endsWith("doom")) {
      if (doomPlaying) return;
      doomPlaying = true;
      var doom = new Audio("/sounds/theonlythingtheyfearisyou.mp3");
      doom.play();
      startEqualizer(doom);
      doom.onplay = function () {
        setTimeout(function () {
          document.getElementById("dynamic-style").innerHTML =
            ".status-ok{color:#ff6f6f!important;text-shadow:0 0 20px #fd3636!important}\n                    h2, a, .chat-name, #hotel {\n                        transition: 0.3s;\n                        color: red !important;\n                    }\n                    #bg {\n                        filter: hue-rotate(145deg);\n                        animation-name: redfade;\n                        animation-duration: 3s;\n                        animation-iteration-count: infinite;\n                    }\n                    #logo {\n                        filter: hue-rotate(192deg);\n                        transition: 0.3s;\n                    }\n                    #dimdengif {\n                        transition: 0.3s;\n                        filter: brightness(0.1) grayscale(1);\n                    }\n                    .moon-icon {\n                        transition: 0.3s;\n                        filter: hue-rotate(295deg);\n                    }\n                    #pre-ad, #projects-banner img, #pre-moon, #buttons-misc, #buttons-sites, #my-button {\n                        transition: 0.3s;\n                        filter: grayscale(1);\n                    }\n                    #pre-hit {\n                        transition: 0.3s;\n                        filter: hue-rotate(232deg);\n                    }\n                    @keyframes redfade {\n                        0% { backdrop-filter: hue-rotate(145deg) }\n                        50% { backdrop-filter: hue-rotate(145deg) brightness(0.4) }\n                        100% { backdrop-filter: hue-rotate(145deg) }\n                    }\n                    #doom-canvas {\n                        position: sticky !important;\n                        margin-top: -1050px;\n                        transition: 0.5s;\n                        height: unset !important;\n                    }\n                ";
        }, 9500);
      };
      stopRain();
    } else if (
      text.endsWith("gravity") &&
      document.activeElement !== document.getElementById("message")
    ) {
      var script = document.createElement("script");
      script.src = "/js/gravity.js";
      document.body.appendChild(script);
      stopRain();
    }
  };

// fallback font
// (function (document) {
//   var width;
//   var body = document.body;
//   var container = document.createElement('span');
//   container.innerHTML = Array(100).join('wi');
//   container.style.cssText = ['position:absolute', 'width:auto', 'font-size:128px', 'left:-99999px'].join(' !important;');
//   var getWidth = function getWidth(fontFamily) {
//     container.style.fontFamily = fontFamily;
//     body.appendChild(container);
//     width = container.clientWidth;
//     body.removeChild(container);
//     return width;
//   };

//   // Pre compute the widths of monospace, serif & sans-serif
//   // to improve performance.
//   var monoWidth = getWidth('monospace');
//   var serifWidth = getWidth('serif');
//   var sansWidth = getWidth('sans-serif');
//   window.isFontAvailable = function (font) {
//     return monoWidth !== getWidth(font + ',monospace') || sansWidth !== getWidth(font + ',sans-serif') || serifWidth !== getWidth(font + ',serif');
//   };
// })(document);
// var fallbackFont = false;
// setTimeout(function () {
//   if (!isFontAvailable('MS UI Gothic')) {
//     fallbackFont = true;
//     document.body.style.fontFamily = "FallbackMSGothic, Tahoma";
//   }
// }, 10);

// kirby
var kirby = document.getElementById("kirby");
kirby.onclick = function () {
  if (mirror) return;
  kirby.onclick = null;
  var audio = document.createElement("audio");
  audio.src = "/sounds/kirby.mp3";
  audio.style.display = "none";
  document.body.appendChild(audio);
  audio.play();
  var x = 0;
  var _int3 = setInterval(function () {
    x += 2;
    if (x > 250) return clearInterval(_int3);
    var y = -((Math.pow(x - 50, 2) - 1000) / 200);
    kirby.style.left = x + "px";
    kirby.style.top = y + "px";
  }, 10);
};

// hotline animation
var hotline = false;
setInterval(function () {
  if (mirror) return;
  if (hotline) {
    document.getElementById("hotline-previous").innerText = "<--";
    document.getElementById("hotline-previous").textContent = "<--";
    document.getElementById("hotline-next").innerText = "-->";
    document.getElementById("hotline-next").textContent = "-->";
  } else {
    document.getElementById("hotline-previous").innerText = "<-";
    document.getElementById("hotline-previous").textContent = "<-";
    document.getElementById("hotline-next").innerText = "->";
    document.getElementById("hotline-next").textContent = "->";
  }
  hotline = !hotline;
}, 500);

// less glow on firefox
if (!isSlow)
  if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    document.getElementById("moon-iframe").height = "160";
  }

// cursors
function getRects() {
  var b00 = document.getElementById("mainbox").getBoundingClientRect();
  var b01 = document.getElementById("linksdiv").getBoundingClientRect();
  window.rectLeft = b00.left;
  window.rectRight = b01.right;
  window.rectTop = b00.top;
  window.rectWidth = rectRight - rectLeft;
  window.rectHeight = document.body.clientHeight;
}
getRects();
window.addEventListener("resize", getRects, {
  passive: true,
});
window.addEventListener("scroll", getRects, {
  passive: true,
});
setInterval(getRects, 1000);
window.xPercent = 0;
window.yPercent = 0;
var lastSend = Date.now();
document.addEventListener(
  "mousemove",
  function (e) {
    if (cursorHidden || mobile) return;
    var x = e.pageX - rectLeft;
    var y = e.pageY - rectTop - window.scrollY;
    if (Date.now() - lastSend > 25 && client.readyState === WebSocket.OPEN) {
      lastSend = Date.now();
      var ab = new Int16Array(3);
      ab[0] = x;
      ab[1] = y;
      ab[2] = document.body.clientHeight;
      client.send(ab);
    }
  },
  {
    passive: true,
  }
);

// buzz
var elementD = document.getElementById("logo-d");
var elementD0 = document.getElementById("logo-d0");
var elementN = document.getElementById("logo-n");
var buzz = document.createElement("audio");
buzz.id = "buzz";
buzz.src = "/sounds/ElectHum.mp3";
buzz.loop = true;
buzz.volume = 0;
buzz.style.display = "none";
document.body.appendChild(buzz);
var bp = buzz.play();
if (bp && bp.catch) {
  bp["catch"](function (e) {
    document.onclick = function () {
      document.getElementById("debug").innerText = "Sounds ON";
      document.getElementById("debug").textContent = "Sounds ON";
      setTimeout(function () {
        document.getElementById("debug").innerText = "";
        document.getElementById("debug").textContent = "";
      }, 2500);
      buzz.play();
      document.onclick = null;
    };
  });
}
function getOffset(el) {
  var rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
}
function calculateDistance(elem, mouseX, mouseY, isLogo) {
  var offset = getOffset(elem);
  return Math.floor(
    Math.sqrt(
      Math.pow(
        mouseX - (offset.left + (elem.width ? elem.width : 100) / 2),
        2
      ) +
        Math.pow(mouseY - (offset.top + (elem.height ? elem.height : 1) / 2), 2)
    )
  );
}
var lastVolumeEdit = Date.now();
if (!isSlow)
  document.addEventListener("mousemove", function (e) {
    if (lastVolumeEdit + 25 > Date.now()) return;
    lastVolumeEdit = Date.now();
    var mX = e.pageX;
    var mY = e.pageY;
    var distance1 = calculateDistance(elementD, mX, mY, true);
    var distance2 = calculateDistance(elementD0, mX, mY, true);
    var distance3 = calculateDistance(elementN, mX, mY, true);
    var distance4 = calculateDistance(hotel, mX, mY, true);
    if (
      Math.min(distance1, distance2, distance3, distance4) !== distance4 &&
      !switchOn
    ) {
      return (buzz.volume = 0);
    }
    var volume = +(
      (-Math.sqrt(
        50 *
          Math.min(distance1, distance2, fell ? 999999 : distance3, distance4)
      ) +
        100) /
      100
    ).toFixed(3);
    if (volume < 0) volume = 0;
    if (volume > 0.6) volume = 0.6;
    buzz.volume = volume;
  });
function onVisibilityChange(callback) {
  var visible = true;
  if (!callback) {
    throw new Error("no callback given");
  }
  function focused() {
    if (!visible) {
      callback((visible = true));
    }
  }
  function unfocused() {
    if (visible) {
      callback((visible = false));
    }
  }

  // Standards:
  if ("hidden" in document) {
    visible = !document.hidden;
    document.addEventListener("visibilitychange", function () {
      (document.hidden ? unfocused : focused)();
    });
  }
  if ("mozHidden" in document) {
    visible = !document.mozHidden;
    document.addEventListener("mozvisibilitychange", function () {
      (document.mozHidden ? unfocused : focused)();
    });
  }
  if ("webkitHidden" in document) {
    visible = !document.webkitHidden;
    document.addEventListener("webkitvisibilitychange", function () {
      (document.webkitHidden ? unfocused : focused)();
    });
  }
  if ("msHidden" in document) {
    visible = !document.msHidden;
    document.addEventListener("msvisibilitychange", function () {
      (document.msHidden ? unfocused : focused)();
    });
  }
  // IE 9 and lower:
  if ("onfocusin" in document) {
    document.onfocusin = focused;
    document.onfocusout = unfocused;
  }
  // All others:
  window.onpageshow = window.onfocus = focused;
  window.onpagehide = window.onblur = unfocused;
}
var isTabFocused = true;
onVisibilityChange(
  /*#__PURE__*/ (function () {
    var _ref = _asyncToGenerator(
      /*#__PURE__*/ _regeneratorRuntime().mark(function _callee(visible) {
        var rects;
        return _regeneratorRuntime().wrap(
          function _callee$(_context) {
            while (1)
              switch ((_context.prev = _context.next)) {
                case 0:
                  isTabFocused = visible;
                  if (visible) {
                    _context.next = 7;
                    break;
                  }
                  buzz.src = "";
                  buzz.remove();
                  if (window.bgm) bgm.volume = 0;
                  _context.next = 25;
                  break;
                case 7:
                  buzz = document.createElement("audio");
                  buzz.src = "/sounds/ElectHum.mp3";
                  buzz.loop = true;
                  buzz.volume = 0;
                  buzz.style.display = "none";
                  _context.prev = 12;
                  _context.next = 15;
                  return buzz.play();
                case 15:
                  _context.next = 19;
                  break;
                case 17:
                  _context.prev = 17;
                  _context.t0 = _context["catch"](12);
                case 19:
                  document.body.appendChild(buzz);
                  if (bgm) bgm.volume = 1;

                  // kelvin pos
                  rects = kelvin.getBoundingClientRect();
                  localStorage.kelvinX = rects.x;
                  localStorage.kelvinY = rects.y;
                  kelvinBus.postMessage({
                    x: rects.x,
                    y: rects.y,
                  });
                case 25:
                case "end":
                  return _context.stop();
              }
          },
          _callee,
          null,
          [[12, 17]]
        );
      })
    );
    return function (_x3) {
      return _ref.apply(this, arguments);
    };
  })()
);

// flickering change
// if (!isSlow) {
//   var flickering = setInterval(function () {
//     if (isSlow || mirror) return clearInterval(flickering);
//     var a = [];
//     var t = "";
//     var b = 0;
//     for (var i = 0; i < 50; i++) a.push(+Math.min(Math.random() + 0.35).toFixed(2));
//     for (var j = 0; j <= 50; j += 1) t += "".concat(j, "% { opacity: ").concat(a[b++] ? a[b] : 1, " }; ");
//     document.getElementById("flickering-style").innerHTML = "\n            @keyframes flickering {\n                ".concat(t, "\n            };\n        ");
//   }, 300);
// }


// brimstone
var mirror = false;
var bgm;
var heartbeat = new Audio("/sounds/heartbeat.mp3");
document.getElementById("mute").onclick = function () {
  if (bgm.paused) {
    bgm.play();
    document.getElementById("mute").innerText = "[mute]";
    document.getElementById("mute").textContent = "[mute]";
  } else {
    bgm.pause();
    document.getElementById("mute").innerText = "[play]";
    document.getElementById("mute").textContent = "[play]";
  }
};
document.getElementById("brimstone").onclick = function () {
  if (mirror) return;
  stopRain();
  mirror = true;
  bgm = new Audio("/sounds/YES.mp3");
  bgm.loop = true;
  var noise = new Audio("/sounds/snd_noise.mp3");
  heartbeat.play();
  document.getElementById("hidden-sulphur-1").id = "hidden-sulphur-2";
  document.getElementById("sulphur").style.opacity = "0";
  document.getElementById("dynamic-style").innerHTML =
    "\n        * {\n            transition: 0.5s;\n            color: red !important;\n        }\n    ";
  setTimeout(function () {
    var red = setInterval(function () {
      document.getElementById("dynamic-style").innerHTML = "";
      setTimeout(function () {
        document.getElementById("dynamic-style").innerHTML =
          "\n                    * {\n                        color: red !important;\n                    }\n                ";
      }, 70);
    }, 120);
    setTimeout(function () {
      return clearInterval(red);
    }, 300);
    setTimeout(function () {
      document.getElementById("dynamic-style").innerHTML =
        "\n                * {\n                    transition: 0;\n                }\n                body {\n                    transition: 1s ease-in-out;\n                    filter: grayscale(1);\n                }\n            ";
      setTimeout(function () {
        document.getElementById("dynamic-style").innerHTML =
          "\n                    body {\n                        transition: 3s ease-in-out;\n                        filter: grayscale(0);\n                    }\n                    #container {\n                        transition: transform 3s ease-in-out 0s;\n                        transform: rotateY(180deg);\n                    }\n                    .box {\n                        transition: filter 0s linear 1.5s;\n                        filter: brightness(0.3);\n                    }\n                    div .chat-msg-local, div .chat-name {\n                        transition: color 0s linear 1.5s;\n                        color: transparent !important;\n                    }\n                ";
        setTimeout(function () {
          document.getElementById("dynamic-style").innerHTML +=
            "\n                   * {\n                        transition: color 0s linear 0s;\n                        color: transparent !important;\n                    }\n                    ";
          var imgs = Array.from(document.getElementsByTagName("img"));
          imgs.forEach(function (img) {
            if (img.closest("#backside")) return;
            img.style.filter = "brightness(0.1) grayscale(1)";
          });
          document.getElementById("pre-banner").style.filter = "brightness(0)";
          document.getElementById("pre-moon").style.filter = "brightness(0)";
          document.getElementById("pre-hit").style.filter = "brightness(0)";
          document.getElementById("buttons-misc").style.filter =
            "brightness(0)";
          document.getElementById("buttons-sites").style.filter =
            "brightness(0)";
          document.getElementById("dimdengif").style.filter = "brightness(0)";
          document.getElementById("projects-banner").style.filter =
            "brightness(0)";
          document.getElementById("mewo").style.display = "none";
          document.getElementById("hotel").style.filter = "brightness(0)";
          document.getElementById("message").style.filter = "brightness(0)";
          for (var _i2 in letters) {
            letters[_i2].style.filter = "brightness(0.1) grayscale(1)";
          }
          document.getElementById("flickering-style").innerHTML = "";
          setTimeout(function () {
            noise.play();
            document.body.style.backgroundSize = "10000%";
            document.body.style.backgroundImage = "url(/images/bg_glitch.gif)";
            document.getElementById("dynamic-style").innerHTML +=
              "\n                            footer span {\n                                color: gray !important;\n                            }\n                            footer a {\n                                color: #2c9080 !important;\n                            }\n                            #cool-sites {\n                                color: #5a5a5a !important;\n                            }\n                            body {\n                                transition: 0s;\n                                filter: brightness(0);\n                            }\n                        ";
            setTimeout(function () {
              noise.play();
              document.body.style.backgroundSize = "cover";
              document.getElementById("bg").remove();
              document.getElementById("dynamic-style").innerHTML = document
                .getElementById("dynamic-style")
                .innerHTML.split("\n")
                .slice(0, -5)
                .join("\n");
              bgm.play();
              document.getElementById("backside").hidden = false;
              document.getElementById("backside").style.zIndex = 1;
            }, 400);
          }, 2500);
        }, 1500);
      }, 1000);
    }, 750);
  }, 2000);
};
var butlerClicks = 0;
document.getElementById("butler").onclick = function () {
  if (butlerClicks++ === 3 && !localStorage.punishment) {
    var blood = confirm(
      "MEWO has been very, very bad. Do you want to punish her?"
    );
    if (blood) {
      bgm.src = "/sounds/mewohasbeenveryverybad.mp3";
      bgm.play();
      localStorage.punishment = 1;
    }
  } else {
    alert("Waiting for something to happen?");
  }
};


// moons
var moons = Array.from(document.getElementsByClassName("moon-icon"));
var _loop = function _loop() {
  var moon = moons[_i4];
  moon.onclick = function () {
    if (!moon.style.transform) {
      moon.style.transform = "rotate(90deg)";
    } else {
      moon.style.transform = "rotate(".concat(
        parseInt(moon.style.transform.split("(")[1].split("deg")[0]) + 90,
        "deg)"
      );
    }
  };
};
for (var _i4 in moons) {
  _loop();
}

// kelvin
var kelvin = document.getElementById("kelvin");
var kelvinBus = new BroadcastChannel("kelvin");
if (isSlow) {
  kelvin.classList.remove("kelvin-light");
}
window.addEventListener(
  "scroll",
  function () {
    var rects = kelvin.getBoundingClientRect();
    localStorage.kelvinX = rects.x;
    localStorage.kelvinY = rects.y;
    kelvinBus.postMessage({
      x: rects.x,
      y: rects.y,
    });
  },
  {
    passive: true,
  }
);

// adblock notice
function detectAdblock(callback) {
  fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
    method: "HEAD",
    mode: "no-cors",
  })
    .then(function (response) {
      // If the request is redirected, then the ads are blocked.
      callback(response.redirected);
    })
    ["catch"](function () {
      // If the request fails completely, then the ads are blocked.
      callback(true);
    });
}
if (!localStorage.okblock)
  detectAdblock(function (res) {
    if (res) {
      document.getElementById("blocknotice").hidden = false;
    }
  });
document.getElementById("close-notice").addEventListener("click", function () {
  localStorage.okblock = "1";
  document.getElementById("blocknotice").hidden = true;
});

// blog arrows
var blogArrows = Array.from(document.getElementsByClassName("blog-arrow"));
var blogIndex = 0;
setInterval(function () {
  for (var i = 0; i < blogArrows.length; i++) {
    blogArrows[i].innerText = "-";
    blogArrows[i].textContent = "-";
  }
  blogArrows[blogIndex].innerText = ">";
  blogArrows[blogIndex].textContent = ">";
  blogIndex++;
  if (blogIndex >= blogArrows.length) blogIndex = 0;
}, 1000);


