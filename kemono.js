var observer;
var domSelector = 'img, a, figure, div';

function createObserver () {
   return new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0 ) {
                mutation.addedNodes.forEach(function (node) {
                    if (node) {
                        replaceImages(domSelector, node);
                    }
                });
            }
        });

        observer.disconnect();
        runObserver();
    });
}

function runObserver () {
    // kemono
    chrome.runtime.sendMessage({msg: 'getDisabled'}, function(response) {
        if (!response.disabled) {
            replaceImages(domSelector);
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            observer = createObserver();
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });
};
runObserver();

function replaceImages(selector, node) {
    var objects;
    if (node) {
        if (node.querySelectorAll) {
            objects = [ node, ...node.querySelectorAll(selector) ];
        } else {
            objects = [ node ];
        }
    } else {
        objects = document.querySelectorAll(selector);
    }
    var imagePrefix = 'https://pbs.twimg.com/media/';
    var imageSrcs = [
        'C46fOL7VcAAM4H-.jpg', 'C5cdRXyUoAEQ8HK.jpg', 'C7rkymbVwAAE11F.jpg', 'C7HmZy4VAAETPGR.jpg',
        'C7Hmew-UwAEOBox.jpg', 'C6ispvmVwAAKLvZ.jpg', 'C6issRcV0AIXjll.jpg', 'C5-jiooUsAAmOJy.jpg',
        'C5-jlo2UYAAIVcT.jpg', 'C5atYAoUwAAoEBz.jpg', 'C5atflpUYAADBbS.jpg', 'C5atg0BUoAA_zNu.jpg',
        'C42iwUAUoAAY8HV.jpg', 'C42iyZtUcAAof4R.jpg', 'C42i0tqUEAEOffq.jpg', 'C4nf2a-VcAMGy-3.jpg',
        'C3t7WvCVcAAsBoo.jpg', 'C3t7a5LVYAAl2Kd.jpg', 'C3KH9iQVMAIIgda.jpg', 'C2h5KX4UcAID-Fe.jpg',
        'C2h5WoJUcAA-qF_.jpg', 'C2h5XxQUQAALHkl.jpg', 'C7HmdfMV0AARKV5.jpg', 'C7HmfteVwAARQPd.jpg',
        'C6isrAgU8AMoyOI.jpg', 'C6istZoVsAAu6-b.jpg', 'C5-jhrYU4AIF92w.jpg', 'C5-jjhqVMAAKEmx.jpg',
        'C5atahqUoAAtgXX.jpg', 'C5W4dj2VYAE6Zmi.jpg', 'C42i2F9UYAA5O47.jpg', 'C4Sf2yrUkAAOKAh.jpg',
        'C4Sf2yuVYAAjLo1.jpg', 'C4Sf2yoUoAA0mgW.jpg', 'C4SgCzyVcAAdOXz.jpg', 'C3t7Y8EUkAAoQfW.jpg',
        'C3t7a5JUYAA9B7r.jpg', 'C3KH7vZUMAAXV13.jpg', 'C3KH9iRVcAAi6Bd.jpg', 'C3KH9iRVYAc-lh5.jpg',
        'C3Gjis2VYAEVgY_.jpg', 'C3Gjn9_UMAAdHEr.jpg', 'C3Gj6RJVYAAglcP.jpg', 'C3Gj841VMAA5D0c.jpg',
        'C2h5VHZUcAAHR6j.jpg', 'C2B3A6xUAAEKTb6.jpg', 'C2B3DkwUkAE9vnB.jpg', 'C2B3DkxVEAQhmwl.jpg',
        'C2B3HBZUkAAEF3B.jpg'
    ];
    for (var i = 0; i < objects.length; i++) {
        var imgSrc = imagePrefix + imageSrcs[Math.floor(Math.random()*imageSrcs.length)];
        var object = objects[i];

        if (object.classList && object.classList.contains('kemono-injected')) {
            continue;
        }

        if (object.src && 'IMG' === object.tagName) {
            // adjust width & height before replace it
            if (object.srcset) {
                object.removeAttribute('srcset');
            }
            if (object.getAttribute('ori-src')) {
                object.removeAttribute('ori-src');
            }
            if (object.getAttribute('data-original')) {
                object.removeAttribute('data-original');
            }
            if (object.getAttribute('data-orig-file')) {
                object.removeAttribute('data-orig-file');
            }
            if (object.style) {
                if (!object.outerHTML.match('width=')) {
                    if (object.clientWidth > 1) {
                        object.style.width = object.clientWidth + 'px';
                    } else {
                        if (!object.style.width) {
                            object.style.maxWidth = '100%';
                        }
                    }
                } else {
                    if (object.width > 2) {
                        object.style.width = object.width + 'px';
                    }
                }
                if (!object.outerHTML.match('height=')) {
                    if (object.clientHeight > 1) {
                        object.style.height = object.clientHeight + 'px';
                    } else {
                        if (!object.style.height) {
                            object.style.height = 'auto';
                        }
                    }
                } else {
                    if (object.width > 2) {
                        object.style.height = object.height + 'px';
                    }
                }
                if (!object.style.objectFit) {
                    object.style.objectFit = 'cover';
                }
            }
            object.setAttribute('kemono-orig-src', object.src);
            object.setAttribute('kemono-src', imgSrc);
            object.onmouseover = function () {
                this.src = this.getAttribute('kemono-orig-src');
            };
            object.onmouseout = function () {
                this.src = this.getAttribute('kemono-src');
            };
            object.src = object.getAttribute('kemono-src');
            object.classList.add('kemono-injected');
        } else if (object.style && undefined !== object.style.backgroundImage && '' !== object.style.backgroundImage) {
            object.setAttribute('kemono-orig-bgimg', object.style.backgroundImage);
            object.setAttribute('kemono-orig-bgpos', object.style.backgrounPosition);
            object.setAttribute('kemono-bgimg', "url('" + imgSrc + "')");
            object.setAttribute('kemono-bgpos', 'center');
            object.onmouseover = function () {
                this.style.backgroundImage = this.getAttribute('kemono-orig-bgimg');
                this.style.backgroundImage = this.getAttribute('kemono-orig-bgpos');
            };
            object.onmouseout = function () {
                this.style.backgroundImage = this.getAttribute('kemono-bgimg');
                this.style.backgroundImage = this.getAttribute('kemono-bgpos');
            };
            object.style.backgroundImage = object.getAttribute('kemono-bgimg');
            object.style.backgroundImage = object.getAttribute('kemono-bgpos');
            object.classList.add('kemono-injected');
        }
    }
}