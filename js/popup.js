// UI creation
!function() {

	"use strict";

	/*|================================================================|*/
	/*|                          UI creation                           |*/
	/*|================================================================|*/
	var initSectionByBgColorFromTemplate = function (sectionNodeTemplate, bgColorCode, wordGroupsDict) {
		var sectionNode = sectionNodeTemplate.cloneNode(true);
		var handlingIndex = 0;
		var classNames = ["pure-toggle-checkbox", "pure-toggle", "color-header", "remove-group-button", "highlight-words"];

		var toggleCheckbox = sectionNode.getElementsByClassName(classNames[handlingIndex])[0];
		toggleCheckbox.id = classNames[handlingIndex].concat("-", bgColorCode);
		toggleCheckbox.dataset.bgColor = bgColorCode;
		toggleCheckbox.checked = wordGroupsDict[bgColorCode].isOn;
		toggleCheckbox.addEventListener("change", wordGroupToogleHandlerFactory(wordGroupsDict));
		handlingIndex++;

		var toggleLabel = sectionNode.getElementsByClassName(classNames[handlingIndex])[0];
		toggleLabel.id = classNames[handlingIndex].concat("-", bgColorCode);
		toggleLabel.htmlFor = toggleCheckbox.id;
		handlingIndex++;

		var header = sectionNode.getElementsByClassName(classNames[handlingIndex])[0];
		header.style.backgroundColor = "#".concat(bgColorCode);
		header.textContent = bgColorCode;
		handlingIndex++;

		var removeButton = sectionNode.getElementsByClassName(classNames[handlingIndex])[0];
		removeButton.dataset.bgColorCode = bgColorCode;
		removeButton.addEventListener("click", removeGroupHandlerFactory(wordGroupsDict, sectionNode));
		handlingIndex++;

		var textarea = sectionNode.getElementsByClassName(classNames[handlingIndex])[0];
		textarea.id = classNames[handlingIndex].concat("-", bgColorCode);
		textarea.dataset.bgColor = bgColorCode;
		textarea.value = wordGroupsDict[bgColorCode].words.join(" ");
		textarea.addEventListener("blur", wordListChangeHandlerFactory(wordGroupsDict));
		handlingIndex++;

		return sectionNode;
	};

	var mainBlock = document.getElementById("mainBlock");
	var sessionTemplate = mainBlock.getElementsByTagName("section")[0];
	var newGroupForm = document.getElementById("new-group-form");
	var colorInputBox = document.getElementById("new-group-color");

	/*|================================================================|*/
	/*|                 load UI data and event binding                 |*/
	/*|================================================================|*/
	var getDefaultWordGroup = function (groupName) {
		return {
			groupName: groupName,
			isOn: false,
			words: []
		};
	};
	var createNewGroupInDict = function (wordGroupsDict, groupName) {
		var wordGroup = wordGroupsDict[groupName];

		if (!wordGroup) {
			wordGroup = getDefaultWordGroup(groupName);
			wordGroupsDict[groupName] = wordGroup;
		}
	};
	var saveAndSendMsg = function (wordGroupsDict) {
		chrome.storage.sync.set({
			wordGroupsDict: wordGroupsDict
		}, function () {
			// console.log("wordGroupsDict saved");
		});

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var messageBody = wordGroupsDict;
			chrome.tabs.sendMessage(tabs[0].id, messageBody, function(response) {
				// console.log(response.content);
			});
		});
	};
	var wordGroupToogleHandlerFactory = function (wordGroupsDict) {
		return function (event) {
			var groupName = event.target.dataset.bgColor;
			var wordGroup = wordGroupsDict[groupName];
			wordGroup.isOn = event.target.checked;

			saveAndSendMsg(wordGroupsDict);
		};
	};
	var wordListChangeHandlerFactory = function (wordGroupsDict) {
		return function (event) {
			var groupName = event.target.dataset.bgColor;
			var wordGroup = wordGroupsDict[groupName];
			wordGroup.words = event.target.value.match(/[^\s]+/g) || [];

			saveAndSendMsg(wordGroupsDict);
		};
	};
	var removeGroupHandlerFactory = function (wordGroupsDict, sectionNode) {
		return function (event) {
			sectionNode.parentElement.removeChild(sectionNode);
			delete wordGroupsDict[event.target.dataset.bgColorCode];

			saveAndSendMsg(wordGroupsDict);
		};
	};

	/*|================================================================|*/
	/*|                    load extension settings                     |*/
	/*|================================================================|*/
	chrome.storage.sync.get('wordGroupsDict', function (wordGroupsDict) {

		// I just dont know how chrome.storage.sync works...
		// + nothing inside, return {}
		// + find the key, return {key: value}
		wordGroupsDict = wordGroupsDict.wordGroupsDict || wordGroupsDict;


		/*|================================================================|*/
		/*|                   popup UI and event binding                   |*/
		/*|================================================================|*/
		// use default for 1st time
		var colorGroups = Object.keys(wordGroupsDict);
		if (colorGroups.length === 0) {
			colorGroups = ["C72E04", "FA9507", "CACF44", "27AB99"].slice(1);
			colorGroups.forEach( colorGroup => createNewGroupInDict(wordGroupsDict, colorGroup) );
		}

		// remove template and append initialized sections
		mainBlock.removeChild(sessionTemplate);
		colorGroups.forEach(function (bgc) {
			mainBlock.appendChild(initSectionByBgColorFromTemplate(sessionTemplate, bgc, wordGroupsDict));
		});
		newGroupForm.addEventListener("submit", function (event) {
			event.preventDefault();
			if (colorInputBox.value && colorInputBox.value.length > 0 && colorInputBox.checkValidity()) {
				console.log("submit OK");
				createNewGroupInDict(wordGroupsDict, colorInputBox.value);
				mainBlock.appendChild(initSectionByBgColorFromTemplate(sessionTemplate, colorInputBox.value, wordGroupsDict));
			}
			console.log("submit");
		});
		colorInputBox.addEventListener("keyup", function (event) {
			if (event.target.checkValidity()) {
				event.target.style.backgroundColor = "#".concat(event.target.value);
			} else {
				event.target.style.backgroundColor = "white";
			}
		});
	});
}();
