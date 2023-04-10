"use strict";

const charSheetTabIndex = 5;

window.onload = () => Run();
window.onunload = () => CharacterSheet.saveDataToCookie();

async function getJSONData(source) {
	var data = '';
	await fetch(`data/${source}.json`)
		.then((response) => response.json())
		.then((json) => data = json)

	return data
}

function toTitleCase(str) {
	return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

var AllData = {}

var CharacterSheet = {
	currentData: {
		"name": "Name",
		"abilArray": [10, 10, 10, 10, 10, 10],
		"race": "Race",
		"raceSource":"PHB",
		"speed": 30,
		"class": "Class"
	},
	saveDataToCookie: () => {
		document.cookie = 'sheetData=' + JSON.stringify(CharacterSheet.currentData);
	},
	loadDataFromCookie: () => {
		let name = "sheetData=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i <ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			var valueOfCookie = c.substring(name.length, c.length);
			if (c.indexOf(name) == 0 && valueOfCookie !== '') {
				return valueOfCookie
			}
		}
		return "";
	},
	update: {
		all: () => {
			var c = CharacterSheet.update
				c.abilityScores()
				c.name()
				c.proficencies()
				c.speed()	
		},
		abilityScores: () => {
			var abilObjectString = '['
			// var abilNames = ['str', 'dex', 'con', 'int', 'wis', 'cha']
			var inputTotals = CharacterSheet.currentData.abilArray;
		
			for (var i = 0; i < inputTotals.length; i++) {
				abilObjectString += inputTotals[i]
				if (i == charSheetTabIndex) {
					break;
				}
				
				if (i !== inputTotals.length - 1) {
					abilObjectString += ','
				}
			}
		
			abilObjectString += ']'
			var abilArray = JSON.parse(abilObjectString);
			var abilCells = ['.str-cell', '.dex-cell', '.con-cell', '.int-cell', '.wis-cell', '.cha-cell']
		
			for (var i = 0; i < abilCells.length; i++) {
				if (abilArray[i] == 0) abilArray[i] = "\u2014"
				$(abilCells[i]).text(abilArray[i])
			}
		},
		name: () => {
			var charName = CharacterSheet.currentData.name // TODO: Get input from details tab
			var charRace = CharacterSheet.currentData.race
			// Gets selected race's index in race Data // var charIndex = $('.race-select').children('option:selected').prop('index')
			var charClass = CharacterSheet.currentData.class // TODO: Get input from class tab
	
			$('.name-plate').text(`${charName} (${charRace} ${charClass})`)
		},
		proficencies: () => {
			var selectedRaceIndex = $('.race-select').children('option:selected').prop('index');
			var languageProficienciesData = '';
			console.log(AllData.raceData.race[selectedRaceIndex])
			languageProficienciesData = AllData.raceData.race[selectedRaceIndex].languageProficiencies
			var languageProficiencies = []
			if (AllData.raceData.race[selectedRaceIndex].lineage == "VRGR") {
				languageProficiencies.push(toTitleCase('common'), toTitleCase('other'))
			} else {
				for (var i = 0; i < languageProficienciesData.length; i++) {
					for (const [key, val] of Object.entries(languageProficienciesData[i])) {
						if (val == true) languageProficiencies.push(toTitleCase(key))
					}
				}
			}

			$('.proficiency-cell').html(`<h4>Languages</h4>
<p>${languageProficiencies.join(', ')}`)
		},
		speed: () => {
			// Get race index
			var selectedRaceIndex = $('.race-select').children('option:selected').prop('index');

			var speedData = AllData.raceData.race[selectedRaceIndex].speed;
			var speed = CharacterSheet.currentData.speed
			if (typeof(speedData) == 'object') {
				speed = speedData.walk
			} else {
				speed = speedData
			}

			$('.speed-cell').text(`${speed} feet`)
		}
	},
	setup: function () {
		console.log('CharSheet function run!')
	
		$('.sheet-container').html(`<table class="char-sheet">
			<colgroup>
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
				<col span="1" class="col-width">
			</colgroup>
	
			<tbody>
				<tr class="char-sheet-row">
					<td class="char-sheet-cell">Pic</td>
					<td class="char-sheet-cell name-plate" colspan="8">Name (Race Class)</td>
					<td class="char-sheet-cell">Share</td>
					<td class="char-sheet-cell">Short Rest Button</td>
					<td class="char-sheet-cell">Long Rest Button</td>
					<!--- Not needed (I think) -- <td class="char-sheet-cell">Builder?</td> -->
				</tr>
				<tr class="char-sheet-row">
					<td class="char-sheet-cell str-cell">Str</td>
					<td class="char-sheet-cell dex-cell">Dex</td>
					<td class="char-sheet-cell con-cell">Con</td>
					<td class="char-sheet-cell int-cell">Int</td>
					<td class="char-sheet-cell wis-cell">Wis</td>
					<td class="char-sheet-cell cha-cell">Cha</td>
					<td class="char-sheet-cell">PB</td>
					<td class="char-sheet-cell speed-cell">Speed</td>
					<td class="char-sheet-cell">Inspiration</td>
					<td class="char-sheet-cell" colspan="3">HP</td>
				</tr>
				<tr class="char-sheet-row">
					<td class="char-sheet-cell" colspan="3" rowspan="3">Saving Throws</td>
					<td class="char-sheet-cell" colspan="3" rowspan="11">Skills</td>
					<td class="char-sheet-cell">Initiative</td>
					<td class="char-sheet-cell">AC</td>
					<td class="char-sheet-cell" colspan="4">Denfenses/Conditions</td>
				</tr>
				<tr class="char-sheet-row">
					<td class="char-sheet-cell" colspan="6" rowspan="10">Actions</td>
				</tr>
				<tr class="char-sheet-row">
				</tr>
				<tr class="char-sheet-row">
					<td class="char-sheet-cell" colspan="3" rowspan="3">Senses</td>
				</tr>
				<tr class="char-sheet-row"></tr>
				<tr class="char-sheet-row"></tr>
				<tr class="char-sheet-row">
					<td class="char-sheet-cell proficiency-cell" colspan="3" rowspan="5">Proficencies<br>&amp; Languages</td>
				</tr>
				<tr class="char-sheet-row"></tr>
				<tr class="char-sheet-row"></tr>
				<tr class="char-sheet-row"></tr>
			</tbody>
		</table>`)
		CharacterSheet.update.all()
	}
}

function showActiveTab(tabs, index) {
	for (var j = 0; j < tabs.length; j++) {
		tabs[j].classList.add('hide')
	}

	tabs[index].classList.remove('hide')
}

var Races = {
	setupRaces: () => {
		console.log('Races function run!')

		// Setup race selection
		var raceHTML = `<select name="raceSelect" class="race-select race-tab-choice">`
		
		for (var i = 0; i < AllData.raceData.race.length; i++) {
			var currentRace = AllData.raceData.race[i]
			if (currentRace.name == CharacterSheet.currentData.race && currentRace.source == CharacterSheet.currentData.raceSource) {
				var selected = ` selected="true"`
			} else {
				var selected = ''
			}
			var newRaceOption = `<option index="${i}"${selected}>${currentRace.name} [${currentRace.source}]</option>
			`;
			raceHTML += newRaceOption
		}
		raceHTML += `</select>`

		$('.race-container').html(raceHTML)

		// Atatch save functions to oninput of choices
		$('body').on('input', '.race-tab-choice', () => {
			Races.save.all();
		})
	},
	save: {
		all: () => {
			var s = Races.save
			s.race()
		},
		race: () => {
			CharacterSheet.currentData.race = $('.race-select').val().replace(/ \[.*\]/, '')
			CharacterSheet.currentData.raceSource = $('.race-select').val().replace(/.*\[(.*)\]/, '$1')
		}
	}
}

var Statgen = {
	setup: () => { 
		console.log('Statgen function run!')
		
		// Atatch saving functions to oninput events
		$('body').on('input', '.form-control.input-xs.form-control--minimal.statgen-shared__ipt.statgen-shared__ipt--sel', () => {
			Statgen.save.all();
		})
	},
	save: {
		all: () => {
			var s = Statgen.save
			s.abilArray()
		},
		abilArray: () => {
			console.log('Check!')
			var abilObjectString = '['
			var inputTotals = $('.form-control.form-control--minimal.statgen-shared__ipt.text-center')
			for (var i = 0; i < inputTotals.length; i++) {
				abilObjectString += inputTotals[i].value
				if (i == 5) {
					break;
				}
				
				if (i !== inputTotals.length - 1) {
					abilObjectString += ','
				}
			}
		
			abilObjectString += ']'
			CharacterSheet.currentData.abilArray = JSON.parse(abilObjectString);
			console.log(abilObjectString)
		}
	}
}

function setupClasses() {
	console.log('Classes function run!')
}

function setupDescription() {
	console.log('Description function run!')
}

function setupEquipment() {
	console.log('Equipment function run!')
}

async function Run() {
	AllData.raceData = await getJSONData('races')
	
	var Run = {
		setupCharBuilder: () => {
			Races.setupRaces(),
			setupClasses(),
			Statgen.setup(),
			setupDescription(),
			setupEquipment(),
			CharacterSheet.setup()
		},
		updateCharBuilder: [
			() => Races.save.all(),
			() => {},
			() => Statgen.save.all(),
			() => {},
			() => {},
			() => CharacterSheet.update.all()
		],
		tabBtnSetup: () => {
			var tabBtns = document.querySelectorAll('.char-builder-tab-btn')
			var tabs = document.querySelectorAll('.char-builder-tab')

			for (let i = 0; i < tabBtns.length; i++) {	
				tabBtns[i].addEventListener('click', () => {
					showActiveTab(tabs, i)
					Run.updateCharBuilder[i]();
				})
			}
		}
	}

	CharacterSheet.currentData = JSON.parse(CharacterSheet.loadDataFromCookie())
	Run.tabBtnSetup()
	Run.setupCharBuilder();
}