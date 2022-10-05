import { h } from 'preact';

const Header = () => (

	<nav className='navbar my-5' role="navigation" aria-label="main navigation">
		<div className='container is-flex-direction-row is-justify-content-center is-align-items-center'>
			<div className='columns'>
				<div className='column is-centered'>
					<a class="navbar-item title app_title" href="/">
						Azure Golang Demo App
					</a>
				</div>
			</div>
		</div>
	</nav>
);

export default Header;
