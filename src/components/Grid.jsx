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
    var all_cells = this.state.cells,
        neighborsCount = 0,
        current_cell_index = all_cells.indexOf(currentCell),
        that = this;

    all_cells.map(function(cell, i) {
      if (that.x_within_one(currentCell, cell) && that.y_within_one(currentCell, cell) && (i !== current_cell_index)) {
        neighborsCount++;
      }
    })

    return neighborsCount;
  }

  x_within_one(currentCell, cell) {
    Math.abs(currentCell.props.x - cell.props.x) <= 1;
  }

  y_within_one(currentCell, cell) {
    Math.abs(currentCell.props.y - cell.props.y) <= 1;
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
