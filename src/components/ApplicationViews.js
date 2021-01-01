import React from "react"
import { Redirect, Route } from "react-router-dom"
import { SettingsProvider } from "./settings/SettingsProvider"
import { Header } from "./header/Header"
import { CollectionView } from "./collection/CollectionView"
import { CommunityView } from "./community/CommunityView"

export const ApplicationViews = () => {
    return (
        <>
            <SettingsProvider>

                <Header />

                <Route exact path="/">
                    <Redirect to="/Collections" />
                </Route>

                <Route exact path="/Collections">
                    <CollectionView />
                </Route>

                <Route exact path="/Community">
                    <CommunityView />
                </Route>
            </SettingsProvider>
        </>
    )
}