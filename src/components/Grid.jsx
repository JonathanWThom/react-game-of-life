import React from 'react';
import Cell from "./Cell.jsx";

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: [],
      gameInterval: null,
      gameRunning: false,
      generation: 1
    }
    this.baseState = this.state
  }

  componentWillMount() {
    this.setCells();
  }

  startGame() {
    var gameInterval = setInterval(
      () => this.newGeneration(),
      1000
    );
    this.setState({
      gameInterval: gameInterval,
      gameRunning: true
    })
  }

  stopGame() {
    clearInterval(this.state.gameInterval);
    this.setState({
      gameRunning: false
    })
  }

  setCells() {
    var cells = [];
    var i = 0
    for (let y = 1; y < 31; y++) {
      for (let x = 1; x < 31; x++) {
        let q = i;
        cells.push(<Cell key={i} x={x} y={y} living={false} onClick={() => this.toggleLiving(q)}/>)
        i++
      }
    }
    this.setState({
      cells: cells
    })
  }

  toggleLiving(q) {
    const cells = this.state.cells.slice()
    let x = cells[q].props.x
    let y = cells[q].props.y
    var living;
    if (cells[q].props.living) {
      living = false
    } else {
      living = true
    }
    cells[q] = <Cell key={q} x={x} y={y} living={living} onClick={() => this.toggleLiving(q)}/>
    this.setState({
      cells: cells
    })
  }

  resetGame() {
    this.stopGame();
    this.setState(this.baseState);
    this.setCells();
  }

  newGeneration() {
    var cells = [];
    for (let i = 0; i < this.state.cells.length; i ++) {
      let neighborsCount = this.neighbors(this.state.cells[i])
      let x = this.state.cells[i].props.x
      let y = this.state.cells[i].props.y
      if (this.state.cells[i].props.living && (neighborsCount < 2)) {
        cells.push(<Cell key={i} living={false} x={x} y={y} onClick={() => this.toggleLiving(i)}/>)
      } else if (this.state.cells[i].props.living && (neighborsCount > 3)) {
        cells.push(<Cell key={i} living={false} x={x} y={y} onClick={() => this.toggleLiving(i)}/>)
      } else if (!this.state.cells[i].living && (neighborsCount === 3)) {
        cells.push(<Cell key={i} living={true} x={x} y={y} onClick={() => this.toggleLiving(i)}/>)
      } else {
        let living = this.state.cells[i].props.living
        cells.push(<Cell key={i} living={living} x={x} y={y} onClick={() => this.toggleLiving(i)}/>)
      }
    }
    this.setState({
      cells: cells,
      generation: this.state.generation + 1
    })
  }

  neighbors(currentCell) {
    var neighborsCount = 0;
    this.state.cells.map(function(cell) {
      if (cell.props.living) {
        let cellXY = cell.props.x + cell.props.y
        let currentCellXY = currentCell.props.x + currentCell.props.y
        let lessThanOneAway = Math.abs(cellXY - currentCellXY) === 1
        let xAreEqual = cell.props.x === currentCell.props.x
        let yAreEqual = cell.props.y === currentCell.props.y
        let neighbors = lessThanOneAway && (xAreEqual || yAreEqual)
        if (neighbors) {
          neighborsCount ++
        }
      }
    })
    return neighborsCount;
  }

  setButton() {
    if (this.state.gameRunning) {
      return (
        <button onClick={() => this.stopGame()} className="btn btn-danger">Stop</button>
      )
    } else {
      return (
        <button onClick={() => this.startGame()} className="btn btn-success">Start</button>
      )
    }
  }

  render() {
    let livingCells = this.state.cells.filter(c => c.props.living).length;
    let button = this.setButton();

    return (
      <div className="text-center">
        <h1>Conway's Game of Life</h1>
        <p>Click cells to give them life, then see how well they survive through the generations.</p>
        <h3>Living Cells: {livingCells}</h3>
        <h3>Generation: {this.state.generation}</h3>
        {button}
        <button onClick={() => this.resetGame()} className="btn">Reset</button>
        <div className="grid">
          {this.state.cells}
        </div>
      </div>
    )
  }
}

export default Grid;
