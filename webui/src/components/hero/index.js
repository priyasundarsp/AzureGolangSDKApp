import { h } from 'preact';

const lcols = {
    width: "95%",
    maxWidth: "500px",
    minWidth: "180px"
};

const rcols = {
    width: "95%",
    maxWidth: "550px",
    minWidth: "180px"
};


const Hero = () => (
    <section className='section is-justify-content-center is-align-items-center bg mb-6'>
        <div className='is-flex is-flex-direction-row my-6 is-flex-wrap-wrap is-justify-content-center is-align-items-center'>
            <div className='is-flex' style={lcols}>

                <img src='/assets/gophers.png' style={"max-width: 400px!important; width: 98%; height: auto;"} />
            </div>
            <div className='is-flex is-flex-direction-column my-6 is-justify-content-center' style={rcols}>
                <p className='title is-family-sans-serif has-text-weight-normal has-text-centered'>
                    Simple Azure Resource Management
                </p>
                <p className='subtitle has-text-centered is-family-secondary my-2'>
                    A sample Golang SDK application to manage Azure resources
                </p>
                <div className='container is-flex-direction-row is-justify-content-center is-align-items-center is-flex mt-6'>
                    <p className='has-text-centered is-family-secondary has-text-weight-normal' style={{ maxWidth: "550px" }}>
                        This Sample App provides basic interface to list, create and delete the CosmosDB database accounts, storage accounts, VNet's and static web apps.
                    </p>
                </div>
            </div>
        </div>
    </section>
)

export default Hero;