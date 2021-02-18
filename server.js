const fs = require('fs');

function generateSidebar(){
	let doc = fs.readFileSync('SUMMARY.md', 'utf-8');
	let output = doc.replace("# Table of contents\n","")
					.replace(/\* /g, " * ")
					.replace(/##/g,"*");
	console.log(output);

	fs.writeFileSync('_sidebar.md', output);
	console.log("##################");
	console.log("install: npm i docsify-cli -g")
	console.log("run: docsify serve");
	console.log("##################");
}

generateSidebar();
