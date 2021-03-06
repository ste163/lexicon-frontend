import React, { useEffect, useState, useContext } from "react"
import ListCardCreator from "./ListCardCreator"
import { CollectionContext } from "../../../providers/CollectionProvider"
import ListCardNone from "./ListCardNone"
import ListSearch from "./ListSearch"

const ListColumn = () => {

    const { collections, searchTerms } = useContext(CollectionContext)

    const [ unfiltered, setUnfiltered ] = useState([])
    const [ filtered, setFiltered ] = useState([])


    // Run whenever we enter into the search box
    useEffect(() => {
        if (searchTerms !== "") {
            // Get matching names or descriptions
            const subsetNames = collections.filter(collection => collection.name.toLowerCase().includes(searchTerms.toLowerCase().trim()) || collection.description.toLowerCase().includes(searchTerms.toLowerCase().trim()))
            // We are searching, so empty unfiltered state
            setUnfiltered([])
            setFiltered(subsetNames)
        } else {
            // no terms in search, so display all collections, reset filtered items
            setUnfiltered(collections)
            setFiltered([])
        }
    }, [searchTerms, collections])

    return (
        <section className="column__list">
            {
                !collections.length ? <ListCardNone /> : 
                <>
                    <ListSearch />

                    <ListCardCreator props={unfiltered}/>
                    {
                        // Heading must have a separate check or it will not render properly
                        !filtered.length ? null : <h2 className="card__h2 card__h2--list">Matching collections</h2>
                    }

                    <ListCardCreator props={filtered}/>        
                </>                  
            }
        </section>
    )
}

export default ListColumn