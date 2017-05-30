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

  renderCell(i, x, y, living, q) {
    return (
      <Cell key={i} x={x} y={y} living={living} onClick={() => this.toggleLiving(q)}/>
    )
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
        cells.push(this.renderCell(i, x, y, false, q))
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
    cells[q] = this.renderCell(q, x, y, living, q)
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
    var newCells = [];
    var newCellValues = [];
    for (let i = 0; i < this.state.cells.length; i ++) {
      let neighborsCount = this.neighbors(this.state.cells[i]);
      let x = this.state.cells[i].props.x;
      let y = this.state.cells[i].props.y;
      let livingState = this.state.cells[i].props.living;

      if (livingState && (neighborsCount === 2 || neighborsCount === 3)) {
        newCellValues.push(true)
        newCells.push(this.renderCell(i, x, y, true, i))
      } else if (!livingState && neighborsCount === 3) {
        newCellValues.push(true)
        newCells.push(this.renderCell(i, x, y, true, i))
      } else {
        newCellValues.push(false)
        newCells.push(this.renderCell(i, x, y, false, i))
      }
    }

    this.setState({
      cells: newCells,
      generation: this.state.generation + 1
    })
  }

  neighbors(currentCell) {
    var neighborsCount = 0;
    this.state.cells.map(function(cell) {
      if (cell.props.living) {
        //neighbors are also on diagonals
        let cellXY = cell.props.x + cell.props.y
        let currentCellXY = currentCell.props.x + currentCell.props.y
        // let xDiffPositive = (cell.props.x - currentCell.props.x) === 1
        // let yDiffPositive = (cell.props.y - currentCell.props.y) === 1
        // let xDiffNegative = (currentCell.props.x - cell.props.x) === 1
        // let yDiffNegative = (currentCell.props.y - cell.props.y) === 1
        let lessThanOneAway = Math.abs(cellXY - currentCellXY) === 1
        // let positiveDiff = xDiffPositive && yDiffPositive
        // let negativeDiff = xDiffNegative && yDiffNegative
        let xAreEqual = cell.props.x === currentCell.props.x
        let yAreEqual = cell.props.y === currentCell.props.y
        let neighbors = lessThanOneAway && (xAreEqual || yAreEqual)
        // let diagonalNeighbors = cellXY === currentCellXY
        if (neighbors) {
          neighborsCount ++
        }
        // let topLeft = ((currentCell.props.x - cell.props.x) === 1) && ((currentCell.props.y - cell.props.y) === 1)
        // let topCenter = (currentCell.props.x === cell.props.x) && ((currentCell.props.y - cell.props.y) === 1)
        // let topRight = ((currentCell.props.x - cell.props.x) === -1) && ((currentCell.props.y - cell.props.y) === 1)
        // let middleLeft = ((currentCell.props.x - cell.props.x) === 1) && (currentCell.props.y === cell.props.y)
        // let middleRight = ((currentCell.props.x - cell.props.x) === -1) && (currentCell.props.y === cell.props.y)
        // let bottomLeft = ((currentCell.props.x - cell.props.x) === 1) && ((currentCell.props.y === cell.props.y) === -1)
        // let bottomCenter = (currentCell.props.x === cell.props.x) && ((currentCell.props.y === cell.props.y) === -1)
        // let bottomRight = ((currentCell.props.x === cell.props.x) === -1) && ((currentCell.props.y === cell.props.y) === -1)
        // if (topLeft || topCenter || topRight || middleLeft || middleRight || bottomLeft || bottomCenter || bottomRight) {
        //   neighborsCount++
        // }
      }
    })
    return neighborsCount;
  }

  //top left




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
