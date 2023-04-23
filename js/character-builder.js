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

var AllData = {}

var CharacterSheet = {
	currentData: {
		"name": "Name",
		"abilArray": [{"total": "10", "mod": "0"}, {"total": "10", "mod": "0"}, {"total": "10", "mod": "0"}, {"total": "10", "mod": "0"}, {"total": "10", "mod": "0"}, {"total": "10", "mod": "0"}],
		"raceData": {
			"name": "Race",
			"source": "PHB",
			"page": 0,
			"size": [
				"M"
			],
			"speed": 0,
			"languageProficiencies": [
				{
					"commom": true
				}
			],
			"entries": [
				""
			]
		},
		"class": "Class"
	},
	saveDataToCookie: () => {
		//Minify race
		var race = CharacterSheet.currentData.raceData
		CharacterSheet.currentData.raceSource = race.source
		CharacterSheet.currentData.raceName = race.name
		delete CharacterSheet.currentData.raceData

		//Save Cookie
		document.cookie = 'sheetData=' + JSON.stringify(CharacterSheet.currentData);
	},
	loadDataFromCookie: () => {
		//Load Cookie
		let name = "sheetData=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		var value = CharacterSheet.currentData;
		for(let i = 0; i <ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			var valueOfCookie = c.substring(name.length, c.length);
			if (c.indexOf(name) == 0 && valueOfCookie !== '') {
				value = JSON.parse(valueOfCookie)
			}
		}

		// Expand RaceData
		var foundRace = false
		for (let i = 0; i < AllData.raceData.length; i++) {
			var race = AllData.raceData[i]
			if (race.name == value.raceName && race.source == value.raceSource) {
				value.raceData = race
				foundRace = true
				break;
			}
		}
		// console.log(value)

		if (!foundRace) {
			value.raceData = CharacterSheet.currentData.raceData
		}
		// console.log(value)

		delete value.raceName
		delete value.raceSource

		//Return value
		return value
	},
	update: {
		all: () => {
			console.log('Updated Character Sheet!')
			Statgen.save.all()
			
			var c = CharacterSheet.update
				c.abilityScores()
				c.name()
				c.proficencies()
				c.speed()	
		},
		abilityScores: () => {
			var abilNames = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha']
			var abilArray = CharacterSheet.currentData.abilArray;
			var abilCells = ['.str-cell', '.dex-cell', '.con-cell', '.int-cell', '.wis-cell', '.cha-cell']
		
			for (var i = 0; i < abilCells.length; i++) {
				if (abilArray[i] == 0) abilArray[i] = "\u2014"
				$(abilCells[i]).html(`${abilNames[i]}<br>${abilArray[i].total}<br>${abilArray[i].mod}`)
			}
		},
		name: () => {
			var charName = CharacterSheet.currentData.name // TODO: Get input from details tab
			var charRace = CharacterSheet.currentData.raceData.name
			var charClass = CharacterSheet.currentData.class // TODO: Get input from class tab
	
			$('.name-plate').text(`${charName} (${charRace} ${charClass})`)
		},
		proficencies: () => {
			var languageProficienciesData = '';
			languageProficienciesData = CharacterSheet.currentData.raceData.languageProficiencies
			var languageProficiencies = []
			if (CharacterSheet.currentData.raceData.lineage == "VRGR") {
				languageProficiencies.push('Common', 'Other')
			} else {
				for (var i = 0; i < languageProficienciesData.length; i++) {
					for (const [key, val] of Object.entries(languageProficienciesData[i])) {
						if (val == true) languageProficiencies.push(key.toTitleCase())
					}
				}
			}

			$('.proficiency-cell').html(`<h4>Languages</h4>
<p>${languageProficiencies.join(', ')}`)
		},
		speed: () => {
			var speedData = CharacterSheet.currentData.raceData.speed;
			var isObject = typeof(speedData) == 'object';
			var speed = ''
			if (isObject) {
				speed += `${speedData.walk} feet`
				if (speedData.fly !== undefined) {
					if (speedData.fly == true) {
						speed += `<br>Fly ${speedData.walk} feet`
					} else if (typeof(speedData.fly) == 'number') {
						speed += `<br>Fly ${speedData.fly} feet`
					}
				}
			} else {
				speed += `${speedData} feet`
			}

			$('.speed-cell').html(speed)
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
		
		for (var i = 0; i < AllData.raceData.length; i++) {
			var currentRace = AllData.raceData[i]
			// console.log(CharacterSheet.currentData)
			if (currentRace.name == CharacterSheet.currentData.raceData.name && currentRace.source == CharacterSheet.currentData.raceData.source) {
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
			var selectedRaceIndex = $('.race-select').children('option:selected').prop('index');
			CharacterSheet.currentData.raceData = AllData.raceData[selectedRaceIndex]
		}
	}
}

var Statgen = {
	setup: () => { 
		console.log('Statgen function run!')
		
		// Atatch saving functions to oninput events
		$('body').on('change', '.form-control.input-xs.form-control--minimal.statgen-shared__ipt', () => {
			Statgen.save.all();
		})
	},
	save: {
		all: () => {
			var s = Statgen.save
			s.abilArray()
		},
		abilArray: () => {
			// console.log('Run abilarray Function!')
			var inputTotals = $('.form-control.form-control--minimal.statgen-shared__ipt.text-center')
			for (let i = 0; i < inputTotals.length / 2; i++) {
				CharacterSheet.currentData.abilArray.push({"total": inputTotals[i].value, "mod": inputTotals[i + 6].value})
				if (CharacterSheet.currentData.abilArray.length > 6) CharacterSheet.currentData.abilArray.splice(0, 1)
			}
		}
	}
}

var Classes = {
	setupClasses: () => {
		console.log('Classes function run!')
	},
	save: {
		all: () => {

		}
	}
}

function setupDescription() {
	console.log('Description function run!')
}

function setupEquipment() {
	console.log('Equipment function run!')
}

var _pLoadRaces = async () => {
	return [
		...(await DataUtil.race.loadJSON()).race,
		...((await DataUtil.race.loadPrerelease({isAddBaseRaces: false})).race || []),
		...((await DataUtil.race.loadBrew({isAddBaseRaces: false})).race || []),
	]
		.filter(it => {
			const hash = UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_RACES](it);
			return !ExcludeUtil.isExcluded(hash, "race", it.source);
		});
}

var _pLoadClasses = async () => { //TODO: Figure out how??
	
}

var _pLoadBackgrounds = async () => {
	return [
		...(await DataUtil.loadJSON("data/backgrounds.json")).background,
		...((await PrereleaseUtil.pGetBrewProcessed()).background || []),
		...((await BrewUtil2.pGetBrewProcessed()).background || []),
	]
		.filter(it => {
			const hash = UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_BACKGROUNDS](it);
			return !ExcludeUtil.isExcluded(hash, "background", it.source);
		});
}

var _pLoadFeats = async () => {
	return [
		...(await DataUtil.loadJSON("data/feats.json")).feat,
		...((await PrereleaseUtil.pGetBrewProcessed()).feat || []),
		...((await BrewUtil2.pGetBrewProcessed()).feat || []),
	]
		.filter(it => {
			const hash = UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_FEATS](it);
			return !ExcludeUtil.isExcluded(hash, "feat", it.source);
		});
}

async function Run() {
	// AllData.raceData = await getJSONData('races')
	await Promise.all([
		PrereleaseUtil.pInit(),
		BrewUtil2.pInit(),
	]);
	await ExcludeUtil.pInitialise();
	const [races, classes, backgrounds, feats] = await Promise.all([
		await _pLoadRaces(),
		await _pLoadClasses(),
		await _pLoadBackgrounds(),
		await _pLoadFeats(),
	]);

	AllData.raceData = races
	AllData.classData = classes
	AllData.backgroundData = backgrounds
	AllData.featData = feats

	// console.log(AllData)
	
	var Run = {
		setupCharBuilder: () => {
			Races.setupRaces(),
			Classes.setupClasses(),
			Statgen.setup(),
			setupDescription(),
			setupEquipment(),
			CharacterSheet.setup()
		},
		updateCharSheet: [
			() => Races.save.all(),
			() => {},
			() => Statgen.save.all(),
			() => {},
			() => {},
			() => CharacterSheet.update.all(),
		],
		tabBtnSetup: () => {
			var tabBtns = document.querySelectorAll('.char-builder-tab-btn')
			var tabs = document.querySelectorAll('.char-builder-tab')

			for (let i = 0; i < tabBtns.length; i++) {	
				tabBtns[i].addEventListener('click', () => {
					showActiveTab(tabs, i)
					Run.updateCharSheet[i]();
				})
			}
		}
	}

	CharacterSheet.currentData = CharacterSheet.loadDataFromCookie()
	// console.log(CharacterSheet.currentData)
	Run.tabBtnSetup()
	Run.setupCharBuilder();
}