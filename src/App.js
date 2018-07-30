import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super()
    this.state = {
      letters: [],
      alphabets: [],
      words: [],
      historyWords: [],
      word: [],
      nbrTry: 0,
      isCompleted: false
    }
  }

  componentWillMount(){
    const alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    const words = ['January', 'April', 'March', 'Websites', 'Devices', 'How', 'Mobile'];

    this.setState({
      alphabets,
      words
    }) 
  }

  componentDidMount(){
    this.newGame()
  }

  letterClick(lettre) {

    // Disable the clicked button
    const letters = this.state.letters.map( (row) => {
      if (lettre === row.lettre) row.disabled = true
      return row
    })

    // Show letter found
    const word = this.state.word.map((row) => {
      if (lettre === row.lettre) row.hidden = false
      return row
    })

    // Update the state
    this.setState({
      letters,
      word,
      nbrTry: this.state.nbrTry + 1,
      isCompleted: this.isCompleted(word) // Check if the word is completely found
    })
  }
  
  isCompleted(word) {
    const letterFoundLen = word.filter((row) => row.hidden === false).length
    if (word.length === letterFoundLen) {
      console.log('Completed with success');
      return true
    }
    return false
  }

  // Arrow fx for binding
  newGame = () => {
    const alphabets = this.state.alphabets.map((lettre) => {
      return {
        lettre: lettre,
        disabled: false
      }
    })

    const randWord = this.state.words[Math.floor(Math.random() * this.state.words.length)];
    this.state.historyWords.push(randWord)
    const words = this.state.words.filter((value) => value !== randWord)

    let word = randWord.toUpperCase().split('');
    word = word.map((lettre) => {
      return {
        lettre: lettre,
        hidden: true
      }
    })

    this.setState({
      letters: alphabets,
      words,
      word,
      nbrTry: 0,
      isCompleted: false
    }) 
  }

  getKeyboard(){
    return this.state.letters.map((row, index) => (
      <button className={row.disabled === false ? 'btn btn-letter' : 'btn btn-letter btn-disabled'}
        key={index}
        disabled={row.disabled}
        onClick={() => this.letterClick(row.lettre)} >{row.lettre}</button>
    ))
  }

  getBtnNewGame(){
    return <button className="btn btn-control" onClick={this.newGame}> REJOUER</button >
  }

  render() {
    return (
      <div className="App">
        <div className="head-container">
          <p> Nombre d'essais : { this.state.nbrTry } </p>
        </div>
        <div className="word-container">
          {
            this.state.word.map((row, index) => (
              <div className="lettre-hide"
                   key={index}>{ row.hidden === true ? '_' : row.lettre }</div>
            ))
          }
        </div>
        <div className="letters-container">
          {
            this.state.isCompleted === true ? this.getBtnNewGame() : this.getKeyboard()
          }
        </div>
        <p>Bon courage, que la force soit avec vous.</p>
      </div>
    );
  }
}

export default App;
