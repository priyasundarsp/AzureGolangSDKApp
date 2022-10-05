import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Hero from './hero';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';
import Storage from '../routes/storage';
import CosmosDB from '../routes/cosmosdb';
import VNet from '../routes/vnet';
import WebApp from '../routes/webapp';

const App = () => (
	<div id="app">
		<Header />
		<Hero />
		<Router>
			<Home path="/" />
			<Storage path="/storage" />
			<CosmosDB path="/cosmosdb" />
			<VNet path="/vnet" />
			<WebApp path="/webapp" />
			<Profile path="/profile/" user="me" />
			<Profile path="/profile/:user" />
		</Router>
	</div>
)

export default App;
