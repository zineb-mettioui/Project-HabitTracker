const emojiButton = document.getElementById("selectEmojiBtn");
const popup = document.getElementById("emojiPopup");
const days = document.querySelectorAll(".day");
let selectedDay = null; 


function selectDay(day) {
	days.forEach((d) => d.classList.remove("clicked"));
	day.classList.add("clicked");
	selectedDay = day;
	const dateNumber = parseInt(day.querySelector(".date").innerText);
	const savedEmoji = localStorage.getItem(`day-emoji-${dateNumber}`);

	emojiButton.innerText = savedEmoji ? savedEmoji : "⨁";
}


window.addEventListener("load", () => {
	const today = new Date();
	const todayDate = today.getDate();
	let foundToday = false;

	days.forEach((day) => {
		const dateNumber = parseInt(day.querySelector(".date").innerText);
		const savedEmoji = localStorage.getItem(`day-emoji-${dateNumber}`);
		if (dateNumber === todayDate) {
			selectDay(day);
			foundToday = true;
		}
	});

});


days.forEach((day) => {
	day.addEventListener("click", () => {
		selectDay(day);
	});
});


document.getElementById("selectEmojiBtn").addEventListener("click", () => {
	if (selectedDay) {
		popup.style.display = "flex";
	}
});


const emojis = document.querySelectorAll(".popup-emoji");
emojis.forEach((emoji) => {
	emoji.addEventListener("click", () => {
		if (selectedDay) {
			const emojiChar = emoji.innerText;
		
			emojiButton.innerText = emojiChar;

			const dateNumber = parseInt(selectedDay.querySelector(".date").innerText);
			localStorage.setItem(`day-emoji-${dateNumber}`, emojiChar);
	
			popup.style.display = "none";
		}
	});
});

const habitTypeSelection = document.getElementById("habitTypeSelection");
console.log("DEBUG: habitTypeSelection element is:", habitTypeSelection);

const habitChoiceButtons = habitTypeSelection.querySelectorAll(".habit-choice-btn");
console.log("DEBUG: habitChoiceButtons NodeList is:", habitChoiceButtons);

habitChoiceButtons.forEach((button) => {});

const waterQuantityInput = document.getElementById("waterQuantity");

const sportConfigDiv = document.getElementById("sportConfig");
const sportHoursInput = document.getElementById("sportHours");
const studyConfigDiv = document.getElementById("studyConfig");
const studyHoursInput = document.getElementById("studyHours");
const walkConfigDiv = document.getElementById("walkConfig");
const walkHoursInput = document.getElementById("walkHours");

const habitListContainer = document.getElementById("habitListContainer");

let currentSelectedHabitType = null;

addHabitFixedBtn.addEventListener("click", () => {
	if (!selectedDay) {
		alert("Please select a day from the calendar first!");
		return;
	}
	addHabitModal.style.display = "flex";
	resetHabitModal();
});

cancelNewHabitBtn.addEventListener("click", () => {
	addHabitModal.style.display = "none";
});

addHabitModal.addEventListener("click", (event) => {
	if (event.target === addHabitModal) {
		addHabitModal.style.display = "none";
	}
});

function resetHabitModal() {
	currentSelectedHabitType = null;
	habitChoiceButtons.forEach((btn) => btn.classList.remove("selected"));
	waterConfigDiv.style.display = "none";
	waterQuantityInput.value = "1";
	sportConfigDiv.style.display = "none";
	sportHoursInput.value = "1";
	studyConfigDiv.style.display = "none";
	studyHoursInput.value = "1";
	walkConfigDiv.style.display = "none";
	walkHoursInput.value = "1";
}

habitChoiceButtons.forEach((button) => {
	button.addEventListener("click", () => {
		habitChoiceButtons.forEach((btn) => btn.classList.remove("selected"));
		button.classList.add("selected");
		currentSelectedHabitType = button.dataset.habit;

		waterConfigDiv.style.display = "none";
		sportConfigDiv.style.display = "none";
		studyConfigDiv.style.display = "none";
		walkConfigDiv.style.display = "none";

		if (currentSelectedHabitType === "Water") {
			waterConfigDiv.style.display = "block";
		} else if (currentSelectedHabitType === "Sport") {
			sportConfigDiv.style.display = "block";
		} else if (currentSelectedHabitType === "Study") {
			studyConfigDiv.style.display = "block";
		} else if (currentSelectedHabitType === "Walk") {
			walkConfigDiv.style.display = "block";
		}
	});
});

saveNewHabitBtn.addEventListener("click", () => {
	if (!selectedDay) {
		alert("Error: No day selected. Please select a day.");
		return;
	}
	if (!currentSelectedHabitType) {
		alert("Please choose a habit type.");
		return;
	}

	const dateNumber = parseInt(selectedDay.querySelector(".date").innerText);
	let habitName = currentSelectedHabitType;
	let habitGoalText = "";
	let habitDetails = { type: currentSelectedHabitType };

	if (currentSelectedHabitType === "Water") {
		habitGoalText = "1 L";
		habitDetails.quantity = 1;
		habitDetails.unit = "L";
	} else if (currentSelectedHabitType === "Sport") {
		habitGoalText = "1 hour";
		habitDetails.hours = 1;
		habitDetails.unit = "hour";
	} else if (currentSelectedHabitType === "Study") {
		habitGoalText = "1 hour";
		habitDetails.hours = 1;
		habitDetails.unit = "hour";
	} else if (currentSelectedHabitType === "Walk") {
		habitGoalText = "1 hour";
		habitDetails.hours = 1;
		habitDetails.unit = "hour";
	}

	const newHabit = {
		id: `habit-${Date.now()}`,
		name: habitName,
		goal: habitGoalText,
		details: habitDetails,
		completed: false,
	};

	addHabitToStorage(dateNumber, newHabit);
	renderHabits(dateNumber);
	addHabitModal.style.display = "none";
});

function createHabitElement(habit, dateNumber) {
	const habitItem = document.createElement("div");
	habitItem.classList.add("habit-item");
	habitItem.dataset.habitId = habit.id;
	if (habit.completed) {
		habitItem.classList.add("completed");
	}

	const habitInfo = document.createElement("div");
	habitInfo.classList.add("habit-info");

	const nameStrong = document.createElement("strong");
	nameStrong.classList.add("habit-name");
	nameStrong.textContent = habit.name;
	habitInfo.appendChild(nameStrong);

	if (habit.goal) {
		const goalP = document.createElement("p");
		goalP.classList.add("habit-goal");
		goalP.textContent = habit.goal;
		habitInfo.appendChild(goalP);
	}
	habitItem.appendChild(habitInfo);

	const checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.checked = habit.completed;
	checkbox.addEventListener("change", () => {
		toggleHabitCompletion(dateNumber, habit.id);
		habitItem.classList.toggle("completed", checkbox.checked);
	});
	habitItem.appendChild(checkbox);

	return habitItem;
}

function renderHabits(dateNumber) {
	habitListContainer.innerHTML = "";
	const habitsForDay = getHabitsFromStorage(dateNumber);
	habitsForDay.forEach((habit) => {
		const habitElement = createHabitElement(habit, dateNumber);
		habitListContainer.appendChild(habitElement);
	});
}

function getHabitsFromStorage(dateNumber) {
	const habitsJSON = localStorage.getItem(`habits-${dateNumber}`);
	return habitsJSON ? JSON.parse(habitsJSON) : [];
}

function saveHabitsToStorage(dateNumber, habitsArray) {
	localStorage.setItem(`habits-${dateNumber}`, JSON.stringify(habitsArray));
}

function addHabitToStorage(dateNumber, habit) {
	const habits = getHabitsFromStorage(dateNumber);
	habits.push(habit);
	saveHabitsToStorage(dateNumber, habits);
}

function toggleHabitCompletion(dateNumber, habitId) {
	const habits = getHabitsFromStorage(dateNumber);
	const habitIndex = habits.findIndex((h) => h.id === habitId);
	if (habitIndex > -1) {
		habits[habitIndex].completed = !habits[habitIndex].completed;
		saveHabitsToStorage(dateNumber, habits);
		console.log(`Day ${dateNumber}, Habit ${habitId} completion: ${habits[habitIndex].completed}`);
	}
}

const originalSelectDay = window.selectDay;

window.selectDay = function (day) {
	originalSelectDay(day);

	if (selectedDay) {
		const dateNumber = parseInt(selectedDay.querySelector(".date").innerText);
		renderHabits(dateNumber);
	} else {
		habitListContainer.innerHTML = "";
	}
};

const originalWindowLoad = window.onload;
window.addEventListener("load", () => {
	if (selectedDay) {
		const dateNumber = parseInt(selectedDay.querySelector(".date").innerText);
		renderHabits(dateNumber);
	}
});
