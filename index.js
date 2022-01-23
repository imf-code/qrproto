const jsqr = require('jsqr');
const pngjs = require('pngjs');
const fs = require('fs');
const path = require('path');

(async () => {
    const kuva = fs.createReadStream(path.join(__dirname, 'qrtest.png'));
    kuva.pipe(
        new pngjs.PNG({
            filterType: 4
        })
    ).on('parsed', function () {
        const parsed = jsqr(this.data, this.width, this.height);
        console.log(parsed.data);
    });
})();