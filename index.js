import fs from 'fs';

const toPromise = fn => (...args) => {
	return new Promise((resolve, reject) => {
		fn(...args, (err, result) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		});
	});
}

const readdir = toPromise(fs.readdir);
const readFile = toPromise(fs.readFile);
const writeFile = toPromise(fs.writeFile);

const stripMimeType = imageData => imageData.replace(/^data:image\/.*;base64,/, '');

const saveFile = (filename, imageData) => writeFile(filename, imageData, 'base64');
const transformFile = async (filename) => {
	saveFile(`img/${filename.replace(/\..*/, '.png')}`, stripMimeType((await readFile(`image-data/${filename}`)).toString()));
};

(async() => {
	(await readdir('image-data')).forEach(transformFile);
})();
