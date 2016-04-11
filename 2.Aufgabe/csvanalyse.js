// REQUIRED MODULES
fs = require('fs');

// HILFSFUNKTIONEN
function writeToFile(filename, data) {
	var err = fs.appendFileSync(filename, data)

	if(err) {
		console.log("Error writing to file " + filename + "!");
		throw err;
	}
}

function resetFiles() {
	fs.writeFileSync("exemplar.csv", "");
	fs.writeFileSync("error.log", "");
	fs.writeFileSync("EinmalExemplar.txt", "");
	fs.writeFileSync("DoppelteExemplare.txt", "");
	fs.writeFileSync("DoppelterBarcode.txt", "");
	fs.writeFileSync("EinmalBarcode.txt", "");
}

function output(data) {
	writeToFile("exemplar.csv", data);
}

function outputExemplare(data) {
	writeToFile("EinmalExemplar.txt", data);
}

function outputDExemplare(data) {
	writeToFile("DoppelteExemplare.txt", data);
}

function outputDBarcode(data) {
	writeToFile("DoppelteBarcode.txt", data);
}

function outputBarcode(data) {
	writeToFile("EinmalBarcode.txt", data);
}


function error(data) {
	writeToFile("error.log", data);
}

function checkPPN(ppn) {

	var optimizedPPN = ppn;

	if(ppn.length == 9) {
		return ppn;
	} else if(ppn.length < 9) {
		while(optimizedPPN.length < 9) {
			optimizedPPN = "0" + optimizedPPN;
		}

		return optimizedPPN;
	}
};

function checkExemplar(data){
	var exemplare = [];
	var einfacheExemplare = [];
	var doppelteExemplare = [];

// Nur Exemplare in Array speichern
	for(var i = 0; i < data.length; i++){
			exemplare.push(data[i].exemplar);

	}

	for(var i = 0; i < exemplare.length; i++){
		if(einfacheExemplare.indexOf(exemplare[i]) == -1){
			einfacheExemplare.push(exemplare[i]);
		}else{
			doppelteExemplare.push(exemplare[i]);
		}
	}
	outputDExemplare(JSON.stringify(doppelteExemplare));
	outputExemplare(JSON.stringify(einfacheExemplare));

console.log("Exemplarnummern die einmal vorkommen: " + (einfacheExemplare.length));
}

function countSignatur(data){
	var allSignatur = [];
	var eindeutigeSignatur = [];

	// Nur Exemplare in Array speichern
	for(var i = 0; i < data.length; i++){
			allSignatur.push(data[i].signatur);
	}

	for(var i = 0; i < allSignatur.length; i++){
		if(eindeutigeSignatur.indexOf(allSignatur[i]) == -1){
			 eindeutigeSignatur.push(allSignatur[i]);
		}
	}

	console.log("Es gibt " + (eindeutigeSignatur.length) + " verschiedene Signaturen.");
}

function checkBarcode(data){
	var barcodes = [];
	var einfacheBarcode = [];
	var doppelteBarcode = [];

// Nur Exemplare in Array speichern
	for(var i = 0; i < data.length; i++){
			barcodes.push(data[i].barcode);

	}

	for(var i = 0; i < barcodes.length; i++){
		if(einfacheBarcode.indexOf(barcodes[i]) == -1){
			einfacheBarcode.push(barcodes[i]);
		}else{
			doppelteBarcode.push(barcodes[i]);
		}
	}
	outputDBarcode(JSON.stringify(doppelteBarcode));
	outputBarcode(JSON.stringify(einfacheBarcode));

console.log("Barcode der einmal vorkommt: " + (einfacheBarcode.length));
}

//SKRIPTSTART

resetFiles();

fs.readFile('Liste_PPN-ExNr_HSHN-libre.csv', 'utf-8', function(err, inhalt) {
	if(err) {
		return console.log(err);
	}
	var lines = inhalt.split(/\r?\n/);
	var result = [];

	for(var i = 1; i < lines.length; i++) {

		var line = lines[i];
		var tokens = line.split(",");

		if (tokens.length != 5) {
			error("Komische Zeile (" + (i+1) + "): " + line);
		} else {

			var exemplar = {
				ppn: checkPPN(tokens[0]),
				exemplar: tokens[1],
				signatur: tokens[2],
				barcode: tokens[3],
				sigel: tokens[4]
			};
			result.push(exemplar);
		}
	}

	output(JSON.stringify(result, null, 2));

	//checkExemplar(result);
	//checkBarcode(result);
	countSignatur(result);
});
