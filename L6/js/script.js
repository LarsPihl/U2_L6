// Globala konstanter och variabler
const roomPrice = [600,800,950];	// Pris för rumstyperna
const extraPrice = [40,80,100];		// Pris för extravalen
var formElem;		// Referens till elementet med hela formuläret
var totalCostElem;	// Referens till elementet för totalpris
// ------------------------------
var i, cityElem, zipcodeElem, telephoneElem, campaignCode;//Egenskapade globala variabler. 
// Initiera globala variabler och koppla funktion till knapp
function init() {
	formElem = document.getElementById("booking");
	totalCostElem = document.getElementById("totalCost");
	cityElem = document.getElementById("city");//Variabel för inmatning av stad.
	zipcodeElem = document.getElementById("zipcode");//Variabel för inmatning av postnummer.
	telephoneElem = document.getElementById("telephone");//Variabel för inmatning av telefonnummer.
	campaignCode = document.getElementById("campaigncode");//Variabel för inmatning av kampanjkod.
	//För enkelhets skull lade jag till ett id för detta element i 'index.html', vilket är det som refereras till.
	
	checkIfFamilyRoom();//Anropar funktionen 'checkIfFamilyRoom' för att undersöka vilken radioknapp som
	//är vald, om 'familjerum' har valts så genomförs några ändringar.

	//Radioknapparna genomsöks, samtliga knappar anropar 'checkIfFamilyRoom' när de väljs, via parentNode 
	//hittas den sista underliggande delen av ett element, vars textinnehåll fylls med motsvarande pris för rummet.
	//Även funktionen 'calculateCost' anropas när en knapp väljs, för beräkning av total kostnad varje gång 
	//en knapp exempelvis byts mot en annan.
	for (i = 0; i < formElem.roomType.length; i++) {
		formElem.roomType[i].addEventListener("click", checkIfFamilyRoom);
		formElem.roomType[i].parentNode.lastChild.textContent += " (" + roomPrice[i] + " kr)";
		formElem.roomType[i].addEventListener("click", calculateCost);
	}

	//Tilläggsalternativen genomsöks. Via parentNode hittas elementens sista underliggande del, var textinnehåll
	//fylls med tilläggets kostnad genom att dess index motsvarar en kostnad i 'extraPrice'.
	//När tilläggen trycks på anropas 'calculateCost', så att utskriften av kostnaden ändras.
	for (i = 0; i < formElem.extra.length; i++) {
		formElem.extra[i].parentNode.lastChild.textContent += " (" + extraPrice[i] + " kr)";
		formElem.extra[i].addEventListener("click", calculateCost);
	}

	formElem.nrOfNights[i].addEventListener("change", calculateCost);//'calculateCost' anropas också när antal nätter
	//ändras, så att utskriften av den totala kostnaden direkt syns.

	calculateCost();//'calculateCost' anropas så att en utskrift utförs när sidan laddas, med kostnaden
	//av de ursprunligt valda alternativen.
	
	// Händelsehanterare för textfält som ska kontrolleras
	
	cityElem.addEventListener("blur", changeCity);//'changeCity' anropas när inmatning av stad släpps ur fokus.
	//Bokstäverna omvandlas då till versaler och skrivs in i inmatningsfältet.
	//Funktionen 'checkField' anropas när fält för telefonnummer och postnummer släpps ur fokus. 
	//Där kontrolleras inmatningarna.
	zipcodeElem.addEventListener("blur", checkField);
	telephoneElem.addEventListener("blur", checkField);
	
	// Händelsehanterare för kampanjkod

	//Kontroll sker av kampanjkod, både när fältet är i fokus och när en tangent tryckts på och sedan åker upp.
	//När detta sker visas en röd bakgrundsfärg om inmatningen ej matchar en kampanjkod. Matchar den visar en grön 
	//färg. När fältet släpps ur fokus nollställs fältets färg och bokstäverna omvandlas till versaler.
	campaignCode.addEventListener("focus", checkCampaign);
	campaignCode.addEventListener("keyup", checkCampaign);
	campaignCode.addEventListener("blur", endCheckCampaign);
	
} // End init
window.addEventListener("load",init);//Funktionen 'init' anropas när sidan laddas.
// ------------------------------

function checkIfFamilyRoom() {//Funktion som söker igenom vilken knapp av rumsalternativen som valts. 
	//Om den sista knappen, för familjerum, valts aktiveras 'persons' vilket innebär att antalet personer i 
	//familjerummet blir valbara. Detta omgivande elementet färgas då svart istället för en annars grå färg.
	//I motsats till detta inaktiveras alternativet för sjöutsikt, och dess färg ändras från svart till grått.
	//if-satsens sista rad ser till att detta tillägg inte är igenkryssat, då det annars kan vara inaktivt och ändå
	//vara valt och därmed kosta pengar.

	if (formElem.roomType[2].checked == true) {
		formElem.persons.disabled = false;
		formElem.persons.parentNode.style.color = "#000";
		formElem.extra[2].disabled = true;
		formElem.extra[2].parentNode.style.color = "#999";
		formElem.extra[2].checked = false;

	}

	else {//I annat fall sker motsatsen med knapparna gällande aktivering och färg. Användaren kan nu själv
		//kryssa för tillägget för sjöutsikt.
		formElem.persons.disabled = true;
		formElem.persons.parentNode.style.color = "#999";
		formElem.extra[2].disabled = false;
		formElem.extra[2].parentNode.style.color = "#000";
	}
}

function calculateCost() {//Funktion som beräknar total kostnad av rumsbokningar.
	let price, nrOfNights = formElem.nrOfNights.value;//Lokala variabler, där 'nrOfNights' var det valda värdet
	//av antal nätter i formuläret. 'price' innehåller dagspriset för alla val.

	for (i = 0; i < formElem.roomType.length; i++) {//Radioknapparna för rumsval söks igenom, det rum som valts
		//motsvarar variabeln 'price' aktuella pris genom att radioknappens index motsvarar ett pris på samma index 
		//i arrayen "roomPrice".
		if (formElem.roomType[i].checked == true) {
			price = roomPrice[i]; 
			break;//Funktionen avbryts då endast en knapp kan vara vald, och en vidare sökning ej behövs när den
			//valda knappen hittats.
		}
	}
	
	for (i = 0; i < formElem.extra.length; i++) {//De valbara tilläggen genomsöks, om någon av dem är vald
		//läggs deras kostnad till på totalpriset genom att deras index motsvarar en kostnad i 'extraPrice'.
		if (formElem.extra[i].checked == true) price += extraPrice[i];
	}

	totalCostElem.innerHTML = price * nrOfNights; //Det span-element som ger en utskrift av totalpriset fylls med
	//det totala priset multiplicerat med antal nätter.
}

function changeCity() {//Funktion som omvandlar inmatad stad till versaler.
	let city; //Lokal variabel som fylls med inmatning omvandlat till versaler.
	city = this.value.toUpperCase();
	cityElem.value = city;//Inmatningsfältet fylls med den lokala variabelns innehåll, alltså stadsnamntet med stora bokstäver.
}

function checkField () {//Postnummer och telefonnummer kontrolleras. De läggs i en array och deras index motsvarar
	//en array med reguljära uttryck för de olika fälten.
	const fieldNames = ["zipcode", "telephone"];
	const re = [/^\d{3} ?\d{2}$/,//Postnummer kan bestå av 5 siffror, ett mellanrum efter de 3 första siffrorna godkänns.
				/^0\d{1,3}[-/ ]?\d{5,8}$/ //Telnummer börjar med en nolla och kan ha ett bindessträck efter 1-3 siffror.
				//Efter detta följer ytterliggare 5-8 siffror.
	];

	const errMsg = [//Array med felmeddelanden. Dess index motsvarar index för postnummer eller telefonnummer,
	//samt det reguljära uttryck som gäller i det aktuella fallet.
		"Postnummret måste bestå av fem siffror.", "Telnr måste börja med en 0:a och följas av 6-11 siffror."
	];

	let ix = fieldNames.indexOf(this.name);//Postnummer eller telefonnummer hittas genom att inmatningsfältens namn används.
	//Det fält som anropade funktionens namn används och hittar då ett index i 'fieldNames'. 
	//Nästa underliggande del av elementet ansvarar för utskrift av ett eventuellt felmeddelande.
	let errMsgElem = this.nextElementSibling;
	errMsgElem.innerHTML = "";

	if (!re[ix].test(this.value)) {//Om inmatningen ej matchar det reguljära utrycket med samma index i 're' som
		//hittades med hjälp av inmatningsfältets namn skrivs motsvarande felmeddelande med detta index ut.
		errMsgElem.innerHTML = errMsg[ix];
		return false;//Funktionen bryts då ett fel hittas i inmatningarna.
	}

	else return true;//Inmatningarna är godkända.
}

function checkCampaign () {//Funktion som kontrollerar kampanjkoden.
	let re;//Variabel för det reguljära utryck som används för kampanjkoder.
	re = /^[a-zA-Z]{3}-\d{2}\-[a-zA-Z]\d$/;//Utrycket gäller 3 tecken med stora eller små bokstäver,
	//följt av ett bindestreck och sedan 2 siffror. Ett ytterliggare bindestreck följer, följt av en 
	//stor eller liten bokstav samt en siffra. Det avslutande dollartecknet visar att inga fler tecken godtas.

	//Om kampanjkoden matchar det reguljära utrycket ändras bakgrundfärgen vid fokus till grönt.
	if (this.value.match(re)) this.style.backgroundColor = "#6F9";

	//I annat fall färgas bakgrunden röd.
	else this.style.backgroundColor = "#F99";
}

//När fältet släpps ur fokus nollställs bakgrundsfärgen och inmatningen omvandlas till stora bokstäver.
function endCheckCampaign () {
	this.style.backgroundColor = "";
	this.value = this.value.toUpperCase();
}