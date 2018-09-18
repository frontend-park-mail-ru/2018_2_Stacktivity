'use strict'

import {NavigationComponent} from "./components/nav/nav.js"

const root = document.getElementById("root")
const navigation = new NavigationComponent({el: root})

let is_logged_in = 0

let user = {
	username: "Silvman",
	avatar: "silvatar.png",
}

function createMenu() {
	let is_page = false

	root.innerHTML = Handlebars.templates["header"]({is_page, desc: "No desc",})

	if (is_logged_in) {
		navigation.data = {
			links: [
				{
					content: "About",
					class: ["medium", "sea_blue"],
					id: "about_link",
					href: "about",
				},
				{
					content: "Logout",
					class: ["small", "grey"],
					id: "logout_link",
					href: "about",
				},
				{
					content: user.username, // вместо аватарки
					class: ["big", "red"],
					id: "profile_link",
					href: "profile",
				},
			]
		}
	} else {
		navigation.data = {
			links: [
				{
					content: "About",
					class: ["medium", "sea_blue"],
					id: "about_link",
					href: "about",
				},
				{
					content: "Login",
					class: ["small", "green"],
					id: "login_link",
					href: "login",
				},
				{
					content: "Sign up",
					class: ["big", "red"],
					id: "signup_link",
					href: "signup",
				},
			]
		}
	}

	navigation.render()

	// аватарка
	if (is_logged_in) {
		document.getElementById("profile_link").innerHTML = "<span><img src=\"../" + user.avatar + "\" class=\"avatar\" /></span>"
	}

	root.innerHTML += Handlebars.templates["menu"]()
}

function createSingUp() {
	let is_page = true

	root.innerHTML = Handlebars.templates["header"]({is_page, desc: "Signing up",})

	navigation.data = {
		links: [
			{
				content: "Login",
				class: ["small", "green", "page"],
				id: "login_link",
				href: "login",
			},
			{
				content: "<-",
				class: ["tiny", "grey"],
				id: "return_link",
				href: "/",
			}
		]
	}
	navigation.render()


	let content = document.createElement("main")
	content.classList.add("page_content")

	let formContext = {
		commonError: "Several fixes is required",
		submitText: "Submit",
		fields: [
			{
				name: "username",
				type: "text",
				placeholder: "Username",
				error: "Username must be bigger than 3 and less than 20 symbols and shouldn't contain anything bad"
			},
			{
				name: "email",
				type: "email",
				placeholder: "E-Mail",
				error: "This is not an e-mail"
			},
			{
				name: "password",
				type: "password",
				placeholder: "Password",
				error: "Password must be bigger than 6 and less than 36 symbols"
			},
			{
				name: "password",
				type: "password",
				placeholder: "Confirm password",
				error: "Passwords do not match"
			},
		]
	}

	// просто загрушка для интерактива,  убрать когда будут жсоны
	content.addEventListener('submit', function (event) {
		event.preventDefault()
		Array.from(document.getElementsByClassName("error")).forEach(function (elem) {
			elem.classList.remove("hidden")
		})
	})

	content.innerHTML = Handlebars.templates.user_form(formContext)

	root.appendChild(content)

}

function createLogin() {
	let is_page = true

	root.innerHTML = Handlebars.templates["header"]({is_page, desc: "Login",})

	navigation.data = {
		links: [
			{
				content: "Sign up",
				class: ["big", "red", "page"],
				id: "signup_link",
				href: "signup",
			},
			{
				content: "<-",
				class: ["tiny", "grey"],
				id: "return_link",
				href: "/",
			}
		]
	}
	navigation.render()

	// компонент меню!

	let content = document.createElement("main")
	content.classList.add("page_content")

	let formContext = {
		commonError: "Wrong user or password",
		submitText: "Login",
		fields: [
			{
				name: "username",
				type: "text",
				placeholder: "Username",
			},
			{
				name: "password",
				type: "password",
				placeholder: "Password",
			}
		]
	}

	// просто загрушка для интерактива, нужно убрать
	content.addEventListener('submit', function (event) {
		event.preventDefault()
		Array.from(document.getElementsByClassName("error")).forEach(function (elem) {
			elem.classList.remove("hidden")
		})
	})

	content.innerHTML = Handlebars.templates.user_form(formContext)

	root.appendChild(content)

}

const pages = {
	menu: createMenu,
	signup: createSingUp,
	login: createLogin,
}

createMenu()

root.addEventListener('click', function (event) {
	console.log(event.target)

	let target = event.target

	if (!(target instanceof HTMLAnchorElement)) {
		target = target.closest('a')

		if (!target) {
			return
		}
	}

	event.preventDefault()
	const link = target

	console.log({
		href: link.href,
		dataHref: link.dataset.href
	})

	root.innerHTML = ''

	if (link.dataset.href !== "/")
		pages[link.dataset.href]()
	else
		pages.menu()
})