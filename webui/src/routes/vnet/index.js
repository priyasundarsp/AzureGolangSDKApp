import { h } from 'preact';
import { Link } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { ToastContainer, toast } from 'react-toastify';

const VNet = () => {

    const [networks, setNetworks] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [currentNetwork, setCurrentNetwork] = useState({})
    const [isCreateMode, setIsCreateMode] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [networkName, setNetworkName] = useState("")
    const [region, setRegion] = useState("westus")
    const [ipRange, setIPRange] = useState("10.0.0.0/16")

    const load = () => {
        setIsRefreshing(true)
        fetch("/api/v1/vnet/", {
            method: 'GET',
        }).then(data => {
            if (data.ok) {
                return data.json()
            }
            return data.text().then(text => { throw new Error(text) })
        }).then(list => {
            setNetworks(list.networks)
            if (list.networks.length > 0) {
                setCurrentNetwork(list.networks[0])
            }
            toast("🔃 Refreshed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'info'
            })
            setIsRefreshing(false)
        }).catch((err) => {
            setIsRefreshing(false)
            toast(err.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            })
            console.log(err);
        })
    }

    const createNetwork = () => {
        setIsCreating(true)
        fetch("/api/v1/vnet/", {
            method: 'PUT',
            body: JSON.stringify({
                vnet_name: networkName,
                region,
                ip_range: ipRange
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => {
            if (data.ok) {
                return data.json()
            }
            return data.text().then(text => { throw new Error(text) })
        }).then(resp => {
            setIsCreating(false)
            setIsCreateMode(false)
            toast(resp.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            })
        }).catch((err) => {
            setIsCreating(false)
            setIsCreateMode(false)
            toast(err.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            })
            console.log(err);
        })
    }

    const deleteNetwork = (vnetName) => {
        setIsDeleting(true)

        fetch(`/api/v1/vnet/${vnetName}`, {
            method: 'DELETE',
        }).then(data => {
            if (data.ok) {
                return data.json()
            }
            return data.text().then(text => { throw new Error(text) })
        }).then(resp => {
            setIsDeleting(false)
            toast(resp.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            })
        }).catch((err) => {
            setIsDeleting(false)
            toast(err.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            })
            console.log(err);
        })
    }

    useEffect(() => load(), [])

    return (
        <div className='container'>
            <ToastContainer />
            <section className='header'>
                <div className=' is-flex is-flex-direction-row is-align-items-center is-justify-content-space-evenly'>
                    <h3 className='title is-inline'>
                        Virtual Networks
                    </h3>
                    <div className='is-flex-direction-row'>
                        <button class={`button is-link is-light is-inline mx-2 ${isRefreshing ? "is-loading is-dark" : ""}`} onClick={load}>🔃 Refresh</button>
                        <button class={`button is-primary is-light is-inline mx-2`} onClick={() => { setIsCreateMode(true) }}>⚙️ Create Virtual Network</button>
                        <Link href='/'>
                            <button class={`button is-light is-inline mx-2`}>⬅️ Back</button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className='section'>
                <div className='columns is-justify-content-space-evenly'>
                    <div className='column is-one-third'>
                        {networks.map((network, index) => (
                            <div className='card mb-3' key={`network ${index}`} onClick={() => setCurrentNetwork(network)}>
                                <div className='card-header'>
                                    <p className='card-header-title'>{network.name}</p>
                                    <span className='card-header-icon'>➡️</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(!isCreateMode ? <div className='column is-half'>
                        {((currentNetwork != undefined && currentNetwork != {} && networks.length > 0) ? <div className='card'>
                            <div className='card-header'>
                                <p className='card-header-title subtitle'>VNet Details</p>
                            </div>
                            <div className='card-content'>
                                <div className='content'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Name: </td>
                                                <td>{currentNetwork.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Location: </td>
                                                <td>{currentNetwork.location}</td>
                                            </tr>
                                            <tr>
                                                <td>Address Space: </td>
                                                <td>{currentNetwork.properties.addressSpace.addressPrefixes[0]}</td>
                                            </tr>
                                            <tr>
                                                <td>DDoS Protection status: </td>
                                                <td>{currentNetwork.properties.enableDdosProtection ? "Enabled" : "Disabled"}</td>
                                            </tr>
                                            <tr>
                                                <button class={`button is-danger is-light my-4 ${isDeleting ? "is-loading is-outlined" : ""}`} onClick={() => deleteNetwork(currentNetwork.name)}>❌ Delete</button>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> : <></>)}
                    </div> : <div className='column is-two-fifths'>
                        <div className='card is-small'>
                            <div className='card-header'>
                                <p className='card-header-title subtitle'>Create Virtual Network</p>
                            </div>
                            <div className='card-content'>
                                <div className='content'>
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className='field'>
                                            <label className='lable'>Name</label>
                                            <div className='control'>
                                                <input className='input' type='text' placeholder="Network Name" value={networkName} onChange={(e) => setNetworkName(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className='field'>
                                            <label className='lable'>Region</label>
                                            <div className='control'>
                                                <input className='input' type='text' placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className='field'>
                                            <label className='lable'>IP Range</label>
                                            <div className='control'>
                                                <input className='input' type='text' placeholder="IP Range" value={ipRange} onChange={(e) => setIPRange(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className='is-flex-direction-row is-justify-content-space-evenly is-align-items-center'>
                                            <button className={`button is-primary is-light is-inline mr-4 ${isCreating ? "is-loading is-outlined" : ""}`} onClick={createNetwork}>Create</button>
                                            <button className='button is-danger is-light is-inline' onClick={() => setIsCreateMode(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>)}
                </div>
            </section>

        </div>
    )
}

export default VNet;
