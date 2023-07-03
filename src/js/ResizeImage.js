export class ResizeImage{
    constructor() {

    }

    resizeImage(dat, callback) {
        const file = dat;

        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function(e){
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;

            imgElement.onload = function(e){
                const canvas = document.createElement('canvas');

                const maxWidth = 300;
                canvas.width = maxWidth;
                canvas.height = maxWidth;

                const context = canvas.getContext('2d');
                context.drawImage(e.target, 0, 0, canvas.width, canvas.height);

                const srcEncoded = context.canvas.toDataURL(e.target, 'image/png');

                function urltoFile(url, filename, mimeType){
                    return (fetch(url)
                            .then(function(res){return res.arrayBuffer();})
                            .then(function(buf){return new File([buf], filename,{type:mimeType});})
                    );
                }

                //Usage example:
                urltoFile(srcEncoded, 'image','image/jpeg')
                    .then(function(file){
                        callback(file)
                    });
            }
        }
    }
}