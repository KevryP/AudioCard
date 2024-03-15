import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flashcard } from './Flashcard';
import { CreateFlashcard } from './CreateFlashcard';
import styles from '../styles/CardSet.module.css';

export const CardsetView = ({ userId, cardset }) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);

    useEffect(() => {
        fetchFlashCards();
    }, [cardset]);

    const handleCreateFlashcard = () => {
        fetchFlashCards();
    }

    const fetchFlashCards = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userId}/cardsets/${cardset.id}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }

    const handleDeleteFlashcard = async () => {
        if (currentCardsetData.length === 0) {
            // No flashcards to delete
            return;
        }

        const flashcardIdToDelete = currentCardsetData[currentCardsetData.length - 1].id; // Get the ID of the last flashcard
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets/${cardset.id}/flashcards/${flashcardIdToDelete}`);
            // Refresh the list of flashcards after deletion
            fetchFlashCards();
        } catch (error) {
            console.error('Error deleting flashcard:', error);
        }
    }

    return (
        <div className={styles.setContainer}>
            {/*Form for changing currently viewed cardset */}
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className={styles.setTitle}>Current cardset: {cardset.title}</h1>
                    </div>
                </div>
                {/*Pass all the cards of the cardset to the flashcard component*/}
                <div className="row">
                    <div className='col'>
                        <Flashcard cardData={currentCardsetData} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {/* Form for creating new flashcards */}
                        <CreateFlashcard cardset={cardset} onCreateFlashcard={handleCreateFlashcard} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button onClick={handleDeleteFlashcard}>Delete Flashcard</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
