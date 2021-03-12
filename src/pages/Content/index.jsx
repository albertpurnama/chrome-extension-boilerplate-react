import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import './content.styles.css';

let body = window.document.body
let appDiv = document.createElement('div');
appDiv.id = `app-chess-container-${Math.random()}`
body.appendChild(appDiv)

const PLAYER_WHITE = 'w';
const PLAYER_BLACK = 'b';
const LOADING_NEXT_MOVE_PLACEHOLDER = '..';

const App = () => {
  const [ playerColor, setPlayerColor] = useState(null);
  const [ nextMove, setNextMove ] = useState("none");
  const [ previousMove, setPreviousMove ] = useState("none");
  const [ opponentMove, setOpponentMove ] = useState(true);

  function getBoardState(document, pTurn, castleState, enpassant, half, full) {
    let state = [
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
    ];
  
    // find the board DOM element
    var pieces = document.getElementsByClassName("piece");
  
    // get the x,y positions of each pair
    var regExp = /square-([^)]+)/;
    var pieceTypeRegex = /(wp)|(wr)|(wn)|(wb)|(wq)|(wk)|(bp)|(br)|(bn)|(bb)|(bq)|(bk)/;
    [].forEach.call(pieces, (element) => {
      var matches = regExp.exec(element.className);
      var pieceType = pieceTypeRegex.exec(element.className);
      var row = parseInt(matches[1].substring(0,1)) - 1;
      var col = parseInt(matches[1].substring(1,2)) - 1;
      // build the board in a state
      state[col][row] = pieceType[0];
    });
  
    // console.log(state);
    let str = "";
    for(let idx = 7; idx >= 0 ; idx--){
      let element = state[idx]
      var empty_num = 0;
      var row = element;
      for(let i = 0; i < 8; i++){
        if(row[i] == null) {
          empty_num++;
        } else {
          if(empty_num != 0){
            // if there are empty squares in between
            str += empty_num.toString();
            if(row[i][0] == 'w') {
              str += row[i][1].toUpperCase();
            } else {
              str += row[i][1];
            }
            empty_num = 0
          } else {
            // if non empty squares found
            if(row[i][0] == 'w') {
              str += row[i][1].toUpperCase();
            } else {
              str += row[i][1];
            }
          }
        }
  
        if(i === 7 && empty_num > 0){
          str += empty_num.toString();
        }
      }
      str += "/"
    }
    str = str.substring(0, str.length-1);
  
    str += " " + pTurn + " " + castleState + " " + enpassant + " " + half + " " + full;
  
    return str;
  }

  useEffect(() => {
    if(!playerColor || nextMove === LOADING_NEXT_MOVE_PLACEHOLDER) return;

    function next(turn, cState, enpass, half, full ){
      setPreviousMove(nextMove);
      setNextMove(LOADING_NEXT_MOVE_PLACEHOLDER);
      setOpponentMove(false);

      fetch("https://chess.apurn.com/nextmove", {
      // fetch("https://localhost:8000/nextmove", {
        method: "POST",
        body: getBoardState(document, turn, cState, enpass, half, full)
      })
        .then((res) => res.text())
        .then((data) => {setNextMove(data)})
        .catch((e) => console.error(e));
    }

    var ChessState = {};
    ChessState.move = "w";
    ChessState.userColor = playerColor.toLowerCase();
    ChessState.cState = "KQkq";
    ChessState.enpassant = '-';
    ChessState.halfMove = 0;
    ChessState.fullMove = 1;
    
    // Select the node that will be observed for mutations
    var targetNode = document.getElementsByClassName('clock-black')[0];
    
    // Options for the observer (which mutations to observe)
    var config = { attributes: true, };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
      for(var mutation of mutationsList) {
          if(mutation.type !== 'attributes' || mutation.attributeName !== 'class') continue;
          let isBlackToMove = mutation.target.className.includes("clock-player-turn");
          
          if(isBlackToMove && ChessState.userColor === PLAYER_BLACK) {
            console.log("Black to move, user is black");
            
            // use timeout to prevent not updated board state
            setTimeout(() => next('b', ChessState.cState, ChessState.enpassant, ChessState.halfMove, ChessState.fullMove), 500);
          } else if (!isBlackToMove && ChessState.userColor === PLAYER_WHITE) {
            console.log("White to move, user is white");

            // use timeout to prevent not updated board state
            setTimeout(() => next('w', ChessState.cState, ChessState.enpassant, ChessState.halfMove, ChessState.fullMove), 500);
          } else {
            setOpponentMove(true)
          }
          console.log(mutation);
          console.log('The ' + mutation.attributeName + ' attribute was modified.');
      }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    if(playerColor === PLAYER_WHITE) setOpponentMove(false);
    
    return () => {
      observer.disconnect();
    }
  }, [nextMove, playerColor]);

  return (
    <div className="fixed top-0 right-0 rounded-lg m-5 bg-gray-500 p-2 z-50 flex flex-row justify-center align-middle" style={{ height: 150, width: 300}}>
      {
        !playerColor ? (
          <div className="place-self-center w-full p-4">
            <div className="text-gray-200 text-2xl mb-8 text-center">Select your piece color</div>
            <div className="flex flex-row justify-around align-middle items-center">
              <button className="px-4 py-2 border-black border rounded-lg text-md text-black" onClick={() => setPlayerColor(PLAYER_BLACK)}>Black</button>
              <button className="px-4 py-2 border-white border rounded-lg text-md text-white" onClick={() => setPlayerColor(PLAYER_WHITE)}>White</button>
            </div>
          </div>
        ): (
          <div className="w-full">
            <div className="flex flex-row justify-end mb-5">
              <button className="px-4 py-2 border-black border rounded-lg text-md text-black" onClick={() => setPlayerColor(null)}>Reset</button>
            </div>
            <div className="flex flex-row justify-around items-center">
              <div className="p-3 border border-red-800 text-red-800 rounded-lg">
                Next Move: {nextMove}
              </div>
              <div className="p-3 border border-gray-700 text-gray-700 rounded-lg">
                Previous: {previousMove}
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

if(body && window.location.hostname === "www.chess.com") {
  console.log("rendered popup");
  render(<App />, appDiv);
}

if (module.hot) module.hot.accept();
