import React, {Component} from 'react';
import $ from 'jquery';
import ScoreBoard from './score-board';
import GameWorld from './game-world';
import * as GameGrid from '../game_grid';
import '../../styles/style.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      health: 100,
      level: 1,
      weapon: 'dagger'
    };
    this.player = {
      x: 10,
      y: 10
    };
    this.keysPressed = {};
    this.movementRate = 1;
    this.calculateNewPosition = this.calculateNewPosition.bind(this);
    this.isAbleToMove = this.isAbleToMove.bind(this);
    this.Grid = GameGrid.createGrid();
    this.enemies = GameGrid.generateEnemies(this.Grid);
    /* console.log(this.enemies); */
  }

  calculateNewPosition(oldValue, direction1, direction2) {
    return parseInt(oldValue, 10)
         - (this.keysPressed[direction1] ? this.movementRate : 0)
         + (this.keysPressed[direction2] ? this.movementRate : 0);
  }

  isAbleToMove(position) {
    // check all 4 corners of player
    const {x,y} = position;
    if (this.Grid[x][y].walkable && this.Grid[x+19][y].walkable && this.Grid[x][y+19].walkable && this.Grid[x+19][y+19].walkable)
      return true;
    return false;
  }

  componentDidMount() {
    // after we've mounted the componnet start listening for keystrokes
    $(window).keydown(event => {
      this.keysPressed[event.which] = true;
    });
    $(window).keyup(event => {
      this.keysPressed[event.which] = false;
    });
    setInterval(() => {
      // every 20 milliseconds update players position on screen and store those values
      // here perform the checks before updating the player position
      let tmp = {x: 10, y: 10};
      tmp.x = this.calculateNewPosition(this.player.x, 37, 39);
      tmp.y = this.calculateNewPosition(this.player.y, 38, 40);
      if (this.isAbleToMove(tmp)) {
        this.player.x = tmp.x;
        this.player.y = tmp.y;
      }
      $('.player').css({
        left: this.player.x,
        top: this.player.y
      });
    }, 20);
  }


  render() {
    return (
      <div>
        <ScoreBoard
          health={this.state.health}
          level={this.state.level}
          weapon={this.state.weapon}/>
        <GameWorld
          enemies={this.enemies}/>
        <button
          onClick={()=> { this.setState({health: this.state.health-1});}}>
          taking damage!
        </button>
        <button
          onClick={() => {this.setState({level: this.state.level+1});}}>
          level up
        </button>
        <button
          onClick={() => {this.setState({weapon: 'sword'});}}>
          gain weapon
        </button>
        <button onClick={() => {console.log(this.player.x,this.player.y);}}>get player location</button>
        <button
          onClick={() => {
              console.log(`left: ${ this.Grid[this.player.x-1][this.player.y].type }`);
              console.log(`top: ${ this.Grid[this.player.x][this.player.y-1].type }`);
            }}>
          Player Surroundings</button>
        <button onClick={() => {GameGrid.locateEveryone(this.Grid, GameGrid.ENEMY);}}>reveal everything</button>
      </div>
    );
  }
}
