import { h } from 'preact';
import { Link } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { ToastContainer, toast } from 'react-toastify';

const WebApp = () => {

    const [webapps, setWebapps] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [currentWebapp, setCurrentWebapp] = useState({})
    const [isCreateMode, setIsCreateMode] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [appName, setAppName] = useState("")

    const load = () => {
        setIsRefreshing(true)
        fetch("/api/v1/webapp/", {
            method: 'GET',
        }).then(data => {
            if (data.ok) {
                return data.json()
            }
            return data.text().then(text => { throw new Error(text) })
        }).then(list => {
            setWebapps(list.webapps)
            if (list.webapps.length > 0) {
                setCurrentWebapp(list.webapps[0])
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

    const createWebApp = () => {
        setIsCreating(true)
        fetch("/api/v1/webapp/", {
            method: 'PUT',
            body: JSON.stringify({
                app_name: appName
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

    const deleteWebApp = (acctName) => {
        setIsDeleting(true)

        fetch(`/api/v1/webapp/${acctName}`, {
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
                        Web Apps
                    </h3>
                    <div className='is-flex-direction-row'>
                        <button class={`button is-link is-light is-inline mx-2 ${isRefreshing ? "is-loading is-dark" : ""}`} onClick={load}>🔃 Refresh</button>
                        <button class={`button is-primary is-light is-inline mx-2`} onClick={() => { setIsCreateMode(true) }}>⚙️ Create Web App</button>
                        <Link href='/'>
                            <button class={`button is-light is-inline mx-2`}>⬅️ Back</button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className='section'>
                <div className='columns is-justify-content-space-evenly'>
                    <div className='column is-one-third'>
                        {webapps.map((webapp, index) => (
                            <div className='card mb-3' key={`webapp ${index}`} onClick={() => setCurrentWebapp(webapp)}>
                                <div className='card-header'>
                                    <p className='card-header-title'>{webapp.name}</p>
                                    <span className='card-header-icon'>➡️</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(!isCreateMode ? <div className='column is-half'>
                        {((currentWebapp != undefined && currentWebapp != {} && webapps.length > 0) ? <div className='card'>
                            <div className='card-header'>
                                <p className='card-header-title subtitle'>Web App Details</p>
                            </div>
                            <div className='card-content'>
                                <div className='content'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Name: </td>
                                                <td>{currentWebapp.name}</td>
                                            </tr>
                                            <tr>
                                                <td>SKU: </td>
                                                <td>{currentWebapp.sku.tier}</td>
                                            </tr>
                                            <tr>
                                                <td>Location: </td>
                                                <td>{currentWebapp.location}</td>
                                            </tr>
                                            <tr>
                                                <td>Host Name: </td>
                                                <td><a href={`https://${currentWebapp.properties.defaultHostname}`} target="_blank" rel="noopener noreferrer">click to open in new tab</a></td>
                                            </tr>
                                            <tr>
                                                <td>Enterprise Grade CDN Status: </td>
                                                <td>{currentWebapp.properties.enterpriseGradeCdnStatus}</td>
                                            </tr>
                                            <tr>
                                                <td>Content Distribution Endpoint: </td>
                                                <td><a href={`https://${currentWebapp.properties.contentDistributionEndpoint}`} target="_blank" rel="noopener noreferrer">click to open in new tab</a></td>
                                            </tr>
                                            <tr>
                                                <button class={`button is-danger is-light my-4 ${isDeleting ? "is-loading is-outlined" : ""}`} onClick={() => deleteWebApp(currentWebapp.name)}>❌ Delete</button>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> : <></>)}
                    </div> : <div className='column is-two-fifths'>
                        <div className='card is-small'>
                            <div className='card-header'>
                                <p className='card-header-title subtitle'>Create Web App</p>
                            </div>
                            <div className='card-content'>
                                <div className='content'>
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className='field'>
                                            <label className='lable'>Name</label>
                                            <div className='control'>
                                                <input className='input' type='text' placeholder="Web App Name" value={appName} onChange={(e) => setAppName(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className='is-flex-direction-row is-justify-content-space-evenly is-align-items-center'>
                                            <button className={`button is-primary is-light is-inline mr-4 ${isCreating ? "is-loading is-outlined" : ""}`} onClick={createWebApp}>Create</button>
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

export default WebApp;
