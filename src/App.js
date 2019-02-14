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
      score: 0,
      stillTry: 0,
      help: 0
    }
    this.alphabets = null
    this.expressions = null
    this.currentExpression = null
    this.historyExps = []
    this.progressDraw = 0
    this.messageState = null
    this.drawSteps = 6
    this.progressDrawStep = 1
  }

  componentWillMount(){
    this.alphabets = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')
    // this.expressions = ['Jansfsdfsdfs']
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
        disabled: false,
        correct: null
      }
    })
  }

  // Arrow fx for binding
  newGame = () => {

    this.messageState = 'default'
    this.progressDraw = 0
    if (this.expressions.length === 0) {
      this.expressions = this.historyExps
      this.historyExps = []
    }

    // get random expression
    const randExpression = this.expressions[Math.floor(Math.random() * this.expressions.length)];
    // save random expression
    this.historyExps.push(randExpression)
    // remove random expression from expressions array to avoid choose it again
    this.expressions = this.expressions.filter((value) => value !== randExpression)

    this.currentExpression = randExpression
    // split expression as array of objects letters + states for better handling
    const expression = randExpression.toUpperCase().split('').map((letter) => {
      return {
        letter: letter,
        hidden: letter === ' ' ? false : true,
        class: letter === ' ' ? 'space' : 'lettre-hide',
        style: { color: '#FFF' }
      }
    })

    // const stillTry = expression.length + 2
    const stillTry = Math.floor(expression.length / 2)
    // this.progressDraw = stillTry < drawSteps ? drawSteps - stillTry : 0
    this.progressDrawStep = stillTry < this.drawSteps ? 1 : Math.floor(stillTry / this.drawSteps)

    const help = Math.floor(expression.length / 3)

    // Update the state
    this.setState({
      letters: this.initLetters(),
      expression,
      nbrTry: 0,
      isCompleted: false,
      score: 0,
      stillTry,
      help
    })
  }

  letterClick(letter) {  
    // default value
    let correctLetter = false,
        isCompleted = false

    // Show letter found
    const expression = this.state.expression.map( (row) => {
      if (letter === row.letter) {
        row.hidden = false
        correctLetter = true
      }
      return row
    })

    // Disable the clicked button 
    const letters = this.state.letters.map( (row) => {
      if (letter === row.letter) {
        row.disabled = true 
        row.correct = correctLetter
      }
      return row
    })

    // score
    const score = correctLetter ? 2 : -1

    let nbrTry = this.state.nbrTry

    if (this.isCompleted(expression)) {
      isCompleted = true
      this.messageState = 'succes'
    }
    else if (!correctLetter) {
      nbrTry = this.state.nbrTry + 1
      
      if (nbrTry >= this.state.stillTry) { 
        this.progressDraw = this.drawSteps; 
        isCompleted = true
        this.messageState = 'failed'
        this.showExpression()
      } else if (nbrTry % this.progressDrawStep === 0 && this.progressDraw + 1 < this.drawSteps) this.progressDraw++;
      // && this.state.stillTry < (this.progressDrawStep * this.drawSteps) + nbrTry
    }

    // Update the state
    this.setState({
      letters,
      expression,
      nbrTry,
      score: this.state.score + score,
      isCompleted
      // isCompleted: this.isCompleted(expression) // Check if the expression is completely found
    })
  }

  //#d40012
  showExpression(){
    return this.state.expression.map((row) => {
      if (row.hidden) {
        row.style = { color:'#d40012' }
        row.hidden = false
      }
      return row
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
    return this.state.letters.map((row, index) => {
      const className = 'btn btn-letter ' + (row.disabled ? 'btn-disabled ' : '') + (row.correct === null ? '' : (row.correct ? 'btn-correct' : 'btn-wrong'))
      return <button 
        className={className}
        key={index}
        disabled={row.disabled}
        onClick={() => this.letterClick(row.letter)} >{row.letter}</button>
    })
  }

  /**
   * return JXS code : bouton pour rejouer
   */
  getBtnNewGame(){
    return <button className="btn btn-control" onClick={this.newGame}> REJOUER </button >
  }

  // like vuejs computed fucntion 
  getScore(){
    return this.state.score + 2
  }

  getHelp() {
    let expression = this.state.expression.filter(row => row.hidden)
    const randRow = expression[Math.floor(Math.random() * expression.length)]

    expression = this.state.expression.map((row) => {
      if (row === randRow) row.hidden = false
      return row
    })

    // console.log(expression);
    
    // let first = true
    // const expression = this.state.expression.map((row) => {
    //   if (row.hidden && first) {
    //     row.hidden = false
    //     first = false
    //   }
    //   return row
    // })

    this.setState({
      score: this.state.score - 1,
      help: this.state.help - 1,
      expression,
      isCompleted: this.isCompleted(expression)
    })
  }

  getProgressDwar(){
    return {
      backgroundPosition: `${this.progressDraw * -200}px`
    }
  }

  message() {
    switch (this.messageState) {
      case 'failed':
        return `Malheureusement, vous avez échoué, l'expression c'était: ${this.currentExpression}`;
      case 'succes':
        return 'Bravo, vous avez réussi';
      default:
        return 'Bon courage, que la force soit avec vous.';
    }
  }

  render() {
    const { help, stillTry, nbrTry, score, expression, isCompleted } = this.state
    return (
      <div className="App">
        <div className="head-container">
          <button disabled={!help} className={(!help ? 'stop-help' : '') + ' btn btn-control' } onClick={() => this.getHelp()}>Help = -1 score</button>
          <p> Nombre d'essais : {nbrTry} </p>
          <p> You have {stillTry} wrong attempt </p>
          <p> Votre score : {score} </p>
          {/* <p> test score : { this.getScore() } </p> */}
        </div>
        <div className="draw-container">
          <div className="draw-img-progress" style={this.getProgressDwar()}>
          </div>
        </div>
        <div className="word-container">
          {
            expression.map((row, index) => (
              <div style={row.style} className={row.class}
                   key={index}>{ row.hidden === true ? '_' : row.letter }</div>
            ))
          }
        </div>
        <div className="letters-container">
          {
            isCompleted === true ? this.getBtnNewGame() : this.getKeyboard()
          }
        </div>
        { /* <p>{ isCompleted === true ? 'Bravo, vous avez réussi' : 'Bon courage, que la force soit avec vous.'}</p> */ }
        <p>{ this.message() }</p>
      </div>
    );
  }
}

export default App;