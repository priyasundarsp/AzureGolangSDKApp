import { h } from 'preact';

const Hero = () => (
    <section className='section'>
        <div className='is-flex-direction-column is-justify-content-center is-align-items-center'>
            <p className='title is-family-sans-serif has-text-weight-normal has-text-centered'>
                Simple Azure Resource Management
            </p>
            <p className='subtitle has-text-centered mb-6'>
                A sample Golang SDK application to manage Azure resources
            </p>

            <div className='is-flex is-flex-direction-row is-justify-content-center is-align-items-center'>
                <div className='card p-6 is-flex' style={"max-width: fit-content;"}>
                    <div className='card-image'>
                        <figure class="image">
                            <img src='/assets/gophers.png' style={"max-width: 450px!important; width: 98%; height: auto;"} />
                        </figure>
                    </div>
                </div>
            </div>
            <div className='container is-flex-direction-row is-justify-content-center is-align-items-center is-flex mt-6'>
                <p className='has-text-centered' style={{ maxWidth: "550px" }}>
                    This Sample App provides basic interface to list, create and delete the CosmosDB database accounts, storage accounts, VNet's and static web apps.
                </p>
            </div>
        </div>
    </section>
)

export default Hero;