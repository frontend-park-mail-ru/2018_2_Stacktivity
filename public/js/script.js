'use strict'

const root = document.getElementById("root")

function createMenu() {
	root.innerHTML = `<header class="index_header">
		<div class="logo">
            <span class="name">
                Blep
            </span>
		</div>
	</header>

	<nav class="index_nav">
		<div class="circle medium sea_blue" id="about_link">
			<span>About</span>
		</div>

		<a class="circle small green" id="login_link" href="#">
			<span>Log in</span>
		</a>

		<a class="circle big red" id="signin_link" href="#">
			<span>Sign in</span>
		</a>
	</nav>

	<main class="index_content">
		<ul class="main_menu">
			<li>Single
				<div class="circles_place">
					<div class="circle tiny blue inline"></div>
				</div>
			</li>
			<li>Multiplayer<div class="circles_place">
					<div class="circle tiny red second"></div>
					<div class="circle tiny orange"></div>
				</div>

			</li>
			<li class="with_padding">Scoreboard</li>
		</ul>
	</main>`
}

const pages = {
	menu: createMenu,
}

createMenu()