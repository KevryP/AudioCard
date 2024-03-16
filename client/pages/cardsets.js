import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';

const Cardset_Page = () => {
    const [allCardsets, setAllCardsets] = useState([]);
    const [displayedCardsets, setDisplayedCardsets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCardset, setSelectedCardset] = useState(null);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [userData, setUserData] = useState(null);

    const pageSize = 4;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser || JSON.parse(sessionStorage.getItem('currentUser'));
                if (user) {
                    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+'/api/users/getuser',  {params: { firebaseId: user.uid}});
                    const userData = response.data.user;
                    setUserData(userData);
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
            } catch (error) {
                console.error('Error fetching user', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData) {
            fetchCardsets();
        }
    }, [userData]);

    const fetchCardsets = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userData.id}/cardsets`, { params: { userId: userData.id } });
            const cardsetsData = response.data.cardsets;
            setAllCardsets(cardsetsData);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    }



    useEffect(() => {
        updateDisplayedCardsets();
    }, [allCardsets, currentPage]);

    const updateDisplayedCardsets =  async () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setDisplayedCardsets(allCardsets.slice(startIndex, endIndex));
    }

    const handleNextPage = async () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(allCardsets.length / pageSize)));
    }

    const handlePrevPage = async  () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    }

    const fetchFlashCards = async (cardset) => {
        try{
            const response = await axios.get(
                process.env.NEXT_PUBLIC_SERVER_URL + `/api/cardsets/${cardset.id}/flashcards`
              );
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch(error) {
            console.error('Error fetching flashcards:', error);
        }
    }
    const selectCardset = async(cardset) => {
        setSelectedCardset(cardset);
        fetchFlashCards(cardset);
    }

    return (
        <div className="container">
            <div className="cardsetsContainer">
                <h2 className="heading">Your Cardsets</h2>
                <div className="row">
                    <div className="col-2 d-flex justify-content-center">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}><span>&#8592;</span></button>
                    </div>
                    <div className="col-8">
                            <div className='cardsetRow'>
                                {displayedCardsets.map((cardset, index) => (
                                    <div key={index} className="cardsetItem"  onClick={()=> selectCardset(cardset)}>{cardset.title}</div>
                                ))}
                            </div>
                        </div>
                    <div className="col-2 d-flex justify-content-center">
                        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(allCardsets.length / pageSize)}><span>&#8594;</span></button>
                    </div>
                </div>
            </div>
            
            <div className='setViewContainer'>
                <div className='row'>
                    <div className='col'>
                        {selectedCardset && (
                            <div className="cardsetTitleContainer">
                                <h1>Flashcard Set: {selectedCardset.title}</h1>
                                <div> Subject: {selectedCardset.subject} </div>
                                <div> {currentCardsetData.length} flashcards </div>
                            </div>
                        )}
                    </div>
                    <div className='col d-flex justify-content-end align-items-center'>
                        <button className="btn btn-secondary editButton">Edit Set</button>
                    </div>
                </div>
                <div className="flashcardContainer">
                    {currentCardsetData.map(flashcard => (
                        <div key={flashcard.id} className="flashcard">
                            <div>Question: {flashcard.term}</div>
                            <div>Answer: {flashcard.definition}</div>
                        </div>
                    ))}
                </div>
            </div>

            
            <style jsx>{`
                .heading{
                    margin-top: 20px;
                }
                .cardsetRow {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                }

                .cardsetItem {
                    width: calc(25% - 10px); /* Adjust the width as needed */
                    display: flex; 
                    justify-content: center;
                    margin-bottom: 10px;
                    background-color: #f0f0f0;
                    padding: 50px;
                    border-radius: 5px;
                }

                .pagination {
                    margin-top: 20px;
                }

                .pagination button {
                    margin-right: 10px;
                }
                .flashcardContainer {
                    display: grid;
                    grid-gap: 20px; 
                }

                .flashcard {
                    background-color: #f0f0f0; 
                    padding: 20px; 
                    border-radius: 8px; 
                }
            `}</style>
        </div>
    );
};

export default Cardset_Page;
