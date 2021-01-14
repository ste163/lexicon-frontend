import React, { useState, createContext } from "react"
// WordProvider is only for the Word table.
    // This is separate from the Recent Words table
    // Handles all the words in each collection and all words for the user

export const WordContext = createContext()

export const WordProvider = props => {

    const userId = parseInt(sessionStorage.getItem("userId"))

    // Words are ALL the words in the database. Different from ThesaurusProvider's word state.
    // That state is for the single word
    const [ words, setWords ] =  useState([])

    // Need getWords, getWordsByCollectionId, addWord deleteWord

    const getWords = userId => {
        return fetch(`http://localhost:8088/words/?userId=${userId}`)
        .then(response => response.json())
        .then(setWords)
    }

    const addWord = word => {
        return fetch("http://localhost:8088/words/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(word)
        })
        .then(() => {
            getWords(word.userId)
        })
    }

    return (
        <WordContext.Provider value={{
            words, getWords, addWord
        }}>
            {props.children}
        </WordContext.Provider>
    )
}