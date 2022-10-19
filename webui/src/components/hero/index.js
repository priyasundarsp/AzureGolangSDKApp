import { h } from 'preact';

const Hero = () => (
    <section className='hero is-medium my-6' style={"background-image: linear-gradient(45deg, #00cdac 38%, #8ddad5 70%); border-raduis: 19px!important;"}>
        <div className='hero-body is-flex-direction-column is-justify-content-center is-align-items-center'>
            <p className='title is-family-sans-serif has-text-weight-normal has-text-centered'>
                Simple Azure Resource Management
            </p>
            <p className='subtitle has-text-centered'>
                A sample Golang SDK application to manage Azure resources
            </p>
            <div className='container is-flex-direction-row is-justify-content-center is-align-items-center is-flex mt-6'>
                <p className='has-text-centered' style={{ maxWidth: "550px" }}>
                    This Sample App provides basic interface to list, create and delete the CosmosDB database accounts, storage accounts, VNet's and static web apps.
                </p>
            </div>
        </div>
    </section>
)

export default Hero;