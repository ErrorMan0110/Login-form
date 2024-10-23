const signUpButton = document.querySelector(".sign-up-button");
const loginButton = document.querySelector(".login-button");
const wrap = document.querySelector(".wrapper");

function showPopUp(status) {
	const wrap = document.querySelector(".wrapper");
	let popUpWindow = wrap.querySelector(".popup-window");

	if (!popUpWindow) {
		popUpWindow = document.createElement("div");
		popUpWindow.classList.add("popup-window");

		if (status === "success") {
			popUpWindow.classList.add("success-popup-window");
			popUpWindow.textContent = "You have been successfully registered!";
		} else if (status === "failure") {
			popUpWindow.classList.add("failure-popup-window");
			popUpWindow.textContent = "Something went wrong!";
		} else {
			console.error("Wrong argument! Expected value is 'success' or 'failure'");
			return;
		}
		wrap.append(popUpWindow);
	} else {
		popUpWindow.classList.remove("hidden");
	}
}

function hidePopup() {
	const wrap = document.querySelector(".wrapper");
	const popUpWindow = wrap.querySelector(".popup-window");

	if (popUpWindow) {
		setTimeout(() => {
			popUpWindow.classList.add("hidden");
			wrap.removeChild(popUpWindow);
		}, 5000);
	}
}

function changeDotsColor() {
	const passwordRequirements = document.querySelectorAll("li");
	password.addEventListener("change", (event) => {
		const inputValue = event.target.value;
		if (inputValue.length === 0) {
			for (const marker of passwordRequirements) {
				marker.classList.add("red-marker");
			}
		} else if (inputValue.length > 0) {
			for (const marker of passwordRequirements) {
				marker.classList.add("green-marker");
			}
		}
	});
}

function changeSVG() {
	const closedLockSVG = document.querySelector(".closed-lock");
	const openedLockSVG = document.querySelector(".opened-lock");
	let isClicked = false;
	closedLockSVG.style.display = "none";
	wrap.addEventListener("click", () => {
		if (isClicked) {
			closedLockSVG.style.display = "none";
			openedLockSVG.style.display = "block";
		} else {
			closedLockSVG.style.display = "block";
			openedLockSVG.style.display = "none";
		}
		isClicked = !isClicked;
	});
}

function validateLoginForm() {
	const email = document.querySelector("input[type=email]");
	const password = document.querySelector("input[type=password]");
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	let valid = true;

	if (!email.value) {
		valid = false;
	} else if (!emailRegex.test(email.value)) {
		valid = false;
	}

	if (!password.value) {
		valid = false;
	} else if (password.value.length < 8) {
		valid = false;
	}

	return { valid, email, password };
}

function validateSignUpForm() {
	const email = document.querySelector("input[type=email]");
	const password = document.querySelector("input[type=password]");
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	let valid = true;

	if (!email.value) {
		valid = false;
	} else if (!emailRegex.test(email.value)) {
		valid = false;
	} else {
		console.log("Ok");
	}

	if (!password.value) {
		valid = false;
	} else if (password.value.length < 8 && !passwordRegex.test(password.value)) {
		valid = false;
	}

	return { valid, email, password };
}

function fetchData(validator) {
	const form = document.querySelector("form");
	const formData = {
		email: validator.email.value,
		password: validator.password.value,
	};
	if (validator.valid) {
		form.addEventListener("submit", (event) => {
			event.preventDefault();
			fetch("../index.js", {
				method: "POST",
				body: JSON.stringify(formData),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("Ответ от сервера:", data);
					showPopUp("success");
					hidePopup();
				})
				.catch((error) => {
					console.error("Ошибка при отправке данных:", error);
					showPopUp("failure");
					hidePopup();
				});
		});
	} else {
		return !validator.valid;
	}
}

fetchData(validateLoginForm);
