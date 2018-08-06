import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      letters: [],
      expression: [],
      nbrTry: 0,
      isCompleted: false,
      score: 0
    }
    this.alphabets = null
    this.expressions = null
    this.historyExps = []
  }

  componentWillMount(){
    this.alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')

    this.expressions = ['January', 'April', 'March', 'Websites', 'Devices', 'How', 'Mobile',
      "NOMBRE", "GEANTE", "CORAUX", "ROULEAU", "EJECTER", "LIVRETS",
      "DIVISION", "LICORNES", "FOURNEAU", "EMPLETTE", "CLEPSYDRE", "INDIGENES",
      "ECLATANTE", "MATERIAUX", "ANAGRAMME", "ULTERIEURE", "FACTORISER",
      "RACCROCHER", "HIPPOPOTAME", "SAUTERELLES", 'JURASSIK PARK',
      'CAPTAIN AMERICA', 'JAMES BOND', 'EVANGELION', 'IL ETAIT UNE FOIS EN CHINE',
      'LE ROI LION', 'LE MARIN DES MERS DE CHINE', 'MATRIX', 'OPEN CLASS ROOMS',
      'STAR WARS', 'INDIANA JONES', 'FAST AND FURIOUS', 'VIDEO GAMES RECORDS',
      'ONE PIECE', 'DRAGON BALL Z', 'NARUTO', 'LA REINE DES NEIGES'];
  }

  componentDidMount(){
    this.newGame()
  }

  /**
   * Réinitialiser l 'etat du lettres clavier
   * @return {Array} 
   */
  initLetters(){
    return this.alphabets.map((letter) => {
      return {
        letter: letter,
        disabled: false
      }
    })
  }

  // Arrow fx for binding
  newGame = () => {
    // get random expression
    const randExpression = this.expressions[Math.floor(Math.random() * this.expressions.length)];
    // save random expression
    this.historyExps.push(randExpression)
    // remove random expression from expressions array to avoid choose it again
    this.expressions = this.expressions.filter((value) => value !== randExpression)

    // split expression as array of objects letters + states for better handling
    const expression = randExpression.toUpperCase().split('').map((letter) => {
      return {
        letter: letter,
        hidden: letter === ' ' ? false : true
      }
    })

    // Update the state
    this.setState({
      letters: this.initLetters(),
      expression,
      nbrTry: 0,
      isCompleted: false,
      score: 0
    })
  }


  letterClick(letter) {  
    // default score  
    let score = -1

    // Disable the clicked button 
    const letters = this.state.letters.map( (row) => {
      if (letter === row.letter) row.disabled = true
      return row
    })

    // Show letter found
    const expression = this.state.expression.map((row) => {
      if (letter === row.letter) {
        row.hidden = false
        score = 2
      }
      return row
    })

    // Update the state
    this.setState({
      letters,
      expression,
      nbrTry: this.state.nbrTry + 1,
      score: this.state.score + score,
      isCompleted: this.isCompleted(expression) // Check if the expression is completely found
    })
  }

  /**
   * Vérifier si l 'expression est complètement devoiler
   * @return {boolean}
   * @param {Array} expression 
   */
  isCompleted(expression) {
    const letterFoundLen = expression.filter((row) => row.hidden === false).length
    if (expression.length === letterFoundLen) {
      console.log('Completed with success');
      return true
    }
    return false
  }

  /**
   * return JXS code : boutons du clavier
   */
  getKeyboard(){
    return this.state.letters.map((row, index) => (
      <button className={row.disabled === false ? 'btn btn-letter' : 'btn btn-letter btn-disabled'}
        key={index}
        disabled={row.disabled}
        onClick={() => this.letterClick(row.letter)} >{row.letter}</button>
    ))
  }

  /**
   * return JXS code : bouton pour rejouer
   */
  getBtnNewGame(){
    return <button className="btn btn-control" onClick={this.newGame}> REJOUER </button >
  }

  render() {
    const { nbrTry, score, expression, isCompleted } = this.state
    return (
      <div className="App">
        <div className="head-container">
          <p> Nombre d'essais : { nbrTry } </p>
          <p> Votre score : { score } </p>
        </div>
        <div className="word-container">
          {
            expression.map((row, index) => (
              <div className={row.letter === ' ' ? 'space' : 'lettre-hide'}
                   key={index}>{ row.hidden === true ? '_' : row.letter }</div>
            ))
          }
        </div>
        <div className="letters-container">
          {
            isCompleted === true ? this.getBtnNewGame() : this.getKeyboard()
          }
        </div>
        <p>{ isCompleted === true ? 'Bravo, vous avez réussi' : 'Bon courage, que la force soit avec vous.'}</p>
      </div>
    );
  }
}

export default App;