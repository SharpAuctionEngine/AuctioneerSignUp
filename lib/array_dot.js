/**
 *  replicates array_dot feature from laravel
 * @link https://github.com/SpaceGazebo/Laravel-Array-Helper-JS/blob/master/functions/laravel/array_dot.js
 */
function array_dot(i, p) {
    var o = {};
    p = p || '';

    if (p) {
        p = p + '.';
    }

    if (typeof i == 'object') {
        for (var k in i) {
            if (i.hasOwnProperty(k)) {
                if (typeof i[k] == 'object') {
                    x = array_dot(i[k], k);
                    for (var l in x) {
                        o[p + l] = x[l];
                    }
                } else {
                    o[p + k] = i[k];
                }
            }
        }
    }
    return o;
}


module.exports = array_dot;