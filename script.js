// Highlight today's date
document.addEventListener("DOMContentLoaded", () => {
	const days = document.querySelectorAll(".day");
	const today = new Date();
	const todayDate = today.getDate();

	console.log("Today's date:", todayDate);

	days.forEach((day) => {
		const dateSpan = day.querySelector(".date");
		const dateNumber = parseInt(dateSpan.innerText);
		console.log("Calendar date:", dateNumber);

		if (dateNumber === todayDate) {
			day.classList.add("clicked");
		}

		day.addEventListener("click", () => {
			days.forEach((d) => d.classList.remove("clicked"));
			day.classList.add("clicked");
		});
	});
});
