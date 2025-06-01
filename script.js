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
