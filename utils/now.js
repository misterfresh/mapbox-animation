'use strict';
export default function now(){
    if (window && window.performance &&
        window.performance.now) {
        return window.performance.now();
    } else {
        return Date.now();
    }
}