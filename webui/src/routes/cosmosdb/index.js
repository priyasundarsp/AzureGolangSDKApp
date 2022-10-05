import { h } from 'preact';
import { Link } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { ToastContainer, toast } from 'react-toastify';

const CosmosDB = () => {

    const [accounts, setAccounts] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [currentAccount, setCurrentAccount] = useState({})
    const [isCreateMode, setIsCreateMode] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [accountName, setAccountName] = useState("")

    const load = () => {
        setIsRefreshing(true)
        fetch("/api/v1/cosmosdb/accounts/", {
            method: 'GET',
        }).then(data => {
            if (data.ok) {
                return data.json()
            }
            return data.text().then(text => { throw new Error(text) })
        }).then(list => {
            setAccounts(list.accounts)
            if (list.accounts.length > 0) {
                setCurrentAccount(list.accounts[0])
            }
            toast("🔄️ Refreshed", {
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

    const createAccount = () => {
        setIsCreating(true)
        fetch("/api/v1/cosmosdb/accounts/", {
            method: 'PUT',
            body: JSON.stringify({
                database_account_name: accountName
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

    const deleteAccount = (acctName) => {
        setIsDeleting(true)

        fetch(`/api/v1/cosmosdb/accounts/${acctName}`, {
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
                        Database Accounts
                    </h3>
                    <div className='is-flex-direction-row'>
                        <button class={`button is-link is-light is-inline mx-2 ${isRefreshing ? "is-loading is-dark" : ""}`} onClick={load}>🔄️ Refresh</button>
                        <button class={`button is-primary is-light is-inline mx-2`} onClick={() => { setIsCreateMode(true) }}>⚙️ Create Account</button>
                        <Link href='/'>
                            <button class={`button is-light is-inline mx-2`}>⬅️ Back</button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className='section'>
                <div className='columns is-justify-content-space-evenly'>
                    <div className='column is-one-third'>
                        {accounts.map((account, index) => (
                            <div className='card mb-3' key={`dbaccount ${index}`} onClick={() => setCurrentAccount(account)}>
                                <div className='card-header'>
                                    <p className='card-header-title'>{account.name}</p>
                                    <span className='card-header-icon'>➡️</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(!isCreateMode ? <div className='column is-half'>
                        {((currentAccount != undefined && currentAccount != {} && accounts.length > 0) ? <div className='card'>
                            <div className='card-header'>
                                <p className='card-header-title subtitle'>Database Account Details</p>
                            </div>
                            <div className='card-content'>
                                <div className='content'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Name: </td>
                                                <td>{currentAccount.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Serverless: </td>
                                                <td>{currentAccount.properties.capabilities[0].name === "EnableServerless" ? "yes" : "no"}</td>
                                            </tr>
                                            <tr>
                                                <td>Location: </td>
                                                <td>{currentAccount.properties.locations[0].locationName}</td>
                                            </tr>
                                            <tr>
                                                <td>Document Endpoint: </td>
                                                <td><a href={currentAccount.properties.documentEndpoint}>click to open the url</a></td>
                                            </tr>
                                            <tr>
                                                <td>Write Location: </td>
                                                <td>{currentAccount.properties.writeLocations[0].locationName}</td>
                                            </tr>
                                            <tr>
                                                <button class={`button is-danger is-light my-4 ${isDeleting ? "is-loading is-outlined" : ""}`} onClick={() => deleteAccount(currentAccount.name)}>❌ Delete</button>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> : <></>)}
                    </div> : <div className='column is-two-fifths'>
                        <div className='card is-small'>
                            <div className='card-header'>
                                <p className='card-header-title subtitle'>Create Database Account</p>
                            </div>
                            <div className='card-content'>
                                <div className='content'>
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className='field'>
                                            <label className='lable'>Name</label>
                                            <div className='control'>
                                                <input className='input' type='text' placeholder="Database Account Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className='is-flex-direction-row is-justify-content-space-evenly is-align-items-center'>
                                            <button className={`button is-primary is-light is-inline mr-4 ${isCreating ? "is-loading is-outlined" : ""}`} onClick={createAccount}>Create</button>
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

export default CosmosDB;
