import React, { useRef, useState, useContext } from "react"
import { useHistory } from "react-router-dom"
import Modal from "../../components/modal/Modal";
import { SettingsContext } from "../../providers/SettingsProvider"
import ChangeColorMode from "../../utils/ChangeColorMode"
import LexLogo from "../../components/branding/LexLogo"
import LexTitle from "../../components/branding/LexTitle"
import { AuthBorderTop, AuthBorderBottom } from "./AuthBorders"
import "./AuthView.css"

const AuthView = props => {

    // 'Locks' the overflow so the user SVG borders are in correct position
    // This is removed when user lands on main view
    const bodyElement = document.querySelector("body")
    bodyElement.style.setProperty("overflow", "hidden")

    // If logging out with dark mode active, this resets colors to white 
    ChangeColorMode()

    // Get references for all of the elements that will change
    const usernameLogin = useRef()
    const usernameRegister = useRef()
    const loginBtn = useRef()
    const registerBtn = useRef()
    const existDialog = useRef()
    const conflictDialog = useRef()    
    
    const history = useHistory()

    // To allow for the nav underline to move, target it by useRef
    const underline = useRef()
    const [activeBtn, setBtn] = useState(true)

    // Create default settings for user or load user's settings
    const { getSettingsOnLogin, addDefaultSettings } = useContext(SettingsContext)

    // // Fetch for only login field
    const existingUserCheckLogin = () => {
        return fetch(`http://localhost:8088/users?username=${usernameLogin.current.value}`)
            .then(res => res.json())
            .then(user => user.length ? user[0] : false)
    }

    // // Fetch for only register field
    const existingUserCheckRegister = () => {
        return fetch(`http://localhost:8088/users?username=${usernameRegister.current.value}`)
            .then(res => res.json())
            .then(user => user.length ? user[0] : false)
    }
    
    const handleLogin = (e) => {
        e.preventDefault()

        existingUserCheckLogin()
            .then(exists => {
                if (exists) {
                    sessionStorage.setItem("userId", exists.id)
                    getSettingsOnLogin(exists.id)
                    .then(settingsExists => {
                        if (settingsExists) {
                            sessionStorage.setItem("defaultCollection", settingsExists[0].defaultCollection)
                            sessionStorage.setItem("TotalRecentsToStore", settingsExists[0].TotalRecentsToStore)
                            sessionStorage.setItem("addToMultiple", settingsExists[0].addToMultiple)
                            sessionStorage.setItem("colorMode", settingsExists[0].colorMode)
                        }
                        history.push("/")
                    })
                } else {
                    existDialog.current.className = "background__modal modal__active"
                }
            })
    }
    
    const handleRegister = (e) => {
        e.preventDefault()

        existingUserCheckRegister()
        .then((userExists) => {
            if (!userExists) {
                fetch("http://localhost:8088/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: usernameRegister.current.value,
                    })
                })
                    .then(_ => _.json())
                    .then(createdUser => {
                        if (createdUser.hasOwnProperty("id")) {
                            sessionStorage.setItem("userId", createdUser.id)
                            // Should move the actual default settings into the default settings function.
                            addDefaultSettings(createdUser)
                                .then(() => {
                                    sessionStorage.setItem("defaultCollection", 0)
                                    sessionStorage.setItem("TotalRecentsToStore", 6)
                                    sessionStorage.setItem("addToMultiple", true)
                                    sessionStorage.setItem("colorMode", "light")
                                    history.push("/")
                            })
                        }
                    })
            } else {
                conflictDialog.current.className = "background__modal modal__active"
            }
        })
    }
    
    
    // Content for warning modal
    const ExistDialog = () => (
        <>
            <p className="auth__warning">User does not exist.</p>
            <button className="btn"
            onClick={e => existDialog.current.className = "background__modal"}>
                Close
            </button>
        </>
    )

    // Content for warning modal
    const ConflictDialog = () => (
        <>
            <p className="auth__warning">Username has already been taken.</p>
            <button className="btn"
            onClick={e => conflictDialog.current.className = "background__modal"}>
                Close
            </button>
        </>
    )

    return (
        <main className="auth__container">

            <AuthBorderTop />         

            <Modal ref={existDialog} contentFunction={<ExistDialog />} contentHeader={<div className="modal__warning">WARNING</div>}/>
            <Modal ref={conflictDialog} contentFunction={<ConflictDialog />} contentHeader={<div className="modal__warning">WARNING</div>}/>    


            <div className="auth__column--middle">
                <LexLogo location={"logo__login--lex"}/>
                <LexTitle location={"title__login"} />
                <h2 className="subtitle">
                    Create custom word collections<br/>
                    using Merriam-Webster's Collegiate<sup>&#174;</sup> Thesaurus
                </h2>

                <section className="card card__color--white card__auth">
                    <ul  className="auth__btns">
                        
                        <li className="btns__li">
                            <button
                            className={activeBtn ? "auth__btn auth__btn--active" : "auth__btn"}
                            onClick={e => {
                                setBtn(true)
                                if (usernameRegister.current !== undefined && usernameRegister.current !== null) {
                                    usernameRegister.current.value = ""
                                }
                            }}
                            onMouseEnter={e => underline.current.className = "auth__line line__login--active"}
                            onMouseLeave={e => underline.current.className = `auth__line ${activeBtn ? "line__login--active" : "line__register--active"}`}>
                                Log in
                            </button>
                        </li>
                        
                        <li className="btns__li">
                            <button
                            className={activeBtn ? "auth__btn" : "auth__btn auth__btn--active"}
                            onClick={e => {
                                setBtn(false)
                                if (usernameLogin.current !== undefined  && usernameLogin.current !== null) {
                                    usernameLogin.current.value = ""
                                }
                            }}
                            onMouseEnter={e => underline.current.className = "auth__line line__register--active"}
                            onMouseLeave={e => underline.current.className = `auth__line ${activeBtn ? "line__login--active" : "line__register--active"}`}>
                                Register
                            </button>
                        </li>
                        
                        <div ref={underline} className={`auth__line ${activeBtn ? "line__login--active" : "line__register--active"}`}></div>
                    
                    </ul>

                    <section>
                        <form className="form"
                        onSubmit={activeBtn ? handleLogin : handleRegister}>

                            <fieldset>
                                {/* Need to change type to email in final version, along with renaming the labels */}
                                <label htmlFor={activeBtn ? "usernameLogin" : "usernameRegister"}>Email</label>
                                <input className="input--auth" ref={activeBtn ? usernameLogin : usernameRegister} type="text"
                                    id={activeBtn ? "usernameLogin" : "usernameRegister"}
                                    placeholder="user@email.com"
                                    required autoFocus />
                            </fieldset>
                            
                            {/* Password field here */}

                            <fieldset className="fieldset__btn">
                                <button 
                                ref={loginBtn}
                                className={`btn btn--green btn__authSubmit ${activeBtn ? "login__active" : " login__inactive"}`}
                                type="submit">Login</button>
                                <button
                                ref={registerBtn} 
                                className={`btn btn--green btn__authSubmit ${activeBtn ? "register__inactive" : "register__active"}`}
                                type="submit">Register</button>
                            </fieldset>

                        </form>
                    </section>
                </section>
            </div>

            <AuthBorderBottom />

        </main>
    )
}

export default AuthView