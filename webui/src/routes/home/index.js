import { h } from 'preact';
import { Link } from 'preact-router';
import style from "./style.css";

const Home = () => {

	const services = [
		{
			name: "CosmosDB Database Accounts",
			path: "/cosmosdb"
		},
		{
			name: "Storage Accounts",
			path: "/storage"
		},
		{
			name: "Virtual Networks",
			path: "/vnet"
		},
		{
			name: "Static Web Apps",
			path: "/webapp"
		}
	]

	return (

		<section className='container is-vcentered'>
			<div className='columns'>
				{services.map((value, index) => (
					<div key={`${value}-${index}`} className='column'>
						<Link href={value.path}>
							<div class={`card mx-1 ${style.card_hover}`}>
								<header class="card-header">
									<p class={`card-header-title is-centered ${style.title}`}>
										{value.name}
									</p>
								</header>
							</div>
						</Link>
					</div>
				))}
			</div>
		</section >

	)
};

export default Home;
