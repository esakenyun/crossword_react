import React from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import jsonData from "./data/data.json";
import clueData from "./data/clue.json";

class Header extends React.Component {
  render() {
    return (
      <header className="app-header">
        <h1>Crossword Puzzle Informatics</h1>
      </header>
    );
  }
}

class Modal extends React.Component {
  render() {
    const { handleClose, show } = this.props;
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          <span className="close-button" onClick={handleClose}>
            X
          </span>
          <div className="modal-desc">
            <h2 className="title">Welcome To Crossword Puzzle</h2>
            <p>
              Jangan ragu untuk berpetualang dalam dunia teka-teki ini! Ketika Anda menemukan jawaban, tekan tombol 'Check' dan saksikan keajaiban warna yang menghiasi kotak jawaban Anda. Rasakan kegembiraan saat jawaban Anda menjadi cahaya
              yang menerangi tantangan ini. Selamat berpetualang!
            </p>
          </div>
        </section>
      </div>
    );
  }
}

class Crossword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: jsonData,
      clues: clueData,
      activeClueBoxes: clueData["Dn1"].boxes,
      activeClue: ["Dn1"],
      boxInFocus: clueData["Dn1"].boxes[0],
      show: true,
    };

    this.setActiveClueBoxes = this.setActiveClueBoxes.bind(this);
    this.setActiveClue = this.setActiveClue.bind(this);
    this.setBoxInFocus = this.setBoxInFocus.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  setActiveClueBoxes(boxes) {
    this.setState({
      activeClueBoxes: boxes,
    });
  }

  setActiveClue(clue) {
    this.setState({
      activeClue: clue,
    });
  }

  setBoxInFocus(box) {
    this.setState({
      boxInFocus: box,
    });
  }

  componentDidMount() {
    this.showModal();
  }

  render() {
    return (
      <div>
        <Modal show={this.state.show} handleClose={this.hideModal} />
        <Header />
        <div className="crossword">
          <Board
            grid={this.state.grid}
            allClues={this.state.clues}
            clues={this.state.clues}
            setActiveClueBoxes={this.setActiveClueBoxes}
            highlightedBoxes={this.state.activeClueBoxes}
            setActiveClue={this.setActiveClue}
            setBoxInFocus={this.setBoxInFocus}
            boxInFocus={this.state.boxInFocus}
          />
          <Clues clues={this.state.clues} setActiveClueBoxes={this.setActiveClueBoxes} activeClue={this.state.activeClue} setActiveClue={this.setActiveClue} setBoxInFocus={this.setBoxInFocus} grid={this.state.grid} />
        </div>
      </div>
    );
  }
}

class Clues extends React.Component {
  constructor(props) {
    super(props);
    const cluesAcross = [];
    const cluesDown = [];

    for (const key in this.props.clues) {
      const clue = this.props.clues[key];
      clue.id = key;
      if (clue.direction === "across") {
        cluesAcross.push(clue);
      } else {
        cluesDown.push(clue);
      }
    }

    this.state = {
      across: cluesAcross,
      down: cluesDown,
    };
  }

  render() {
    return (
      <div className="clue-lists">
        <div className="clue-list-wrapper">
          <h2>Across</h2>
          <ol className="clue-list">
            {this.state.across.map((clueData) => (
              <Clue
                id={clueData.id}
                key={clueData.id}
                clueID={clueData.id}
                clueText={clueData.clue}
                clueNumber={clueData.number}
                clueBoxes={clueData.boxes}
                setActiveClueBoxes={this.props.setActiveClueBoxes}
                setActiveClue={this.props.setActiveClue}
                isActive={this.props.activeClue.indexOf(clueData.id) > -1}
                setBoxInFocus={this.props.setBoxInFocus}
                clues={this.props.clues}
                grid={this.props.grid}
              />
            ))}
          </ol>
        </div>
        <div className="clue-list-wrapper">
          <h2>Down</h2>
          <ol className="clue-list">
            {this.state.down.map((clueData) => (
              <Clue
                id={clueData.id}
                key={clueData.id}
                clueID={clueData.id}
                clueText={clueData.clue}
                clueNumber={clueData.number}
                clueBoxes={clueData.boxes}
                setActiveClueBoxes={this.props.setActiveClueBoxes}
                setActiveClue={this.props.setActiveClue}
                isActive={this.props.activeClue.indexOf(clueData.id) > -1}
                setBoxInFocus={this.props.setBoxInFocus}
                clues={this.props.clues}
                grid={this.props.grid}
              />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

class Clue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: jsonData,
      clues: clueData,
      activeClueBoxes: clueData["Dn1"].boxes,
      activeClue: ["Dn1"],
      boxInFocus: clueData["Dn1"].boxes[0],
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleCheckAnswer = this.handleCheckAnswer.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isActive !== this.props.isActive) {
      this.setState({
        active: this.props.isActive,
      });
    }
  }

  handleClick() {
    const activeClue = [];
    activeClue.push(this.props.clueID);
    this.props.setActiveClueBoxes(this.props.clueBoxes);
    this.props.setActiveClue(activeClue);
    this.props.setBoxInFocus(this.props.clueBoxes[0]);
  }

  handleCheckAnswer() {
    const { clueID, clues, grid } = this.props;
    const currentClue = clues[clueID];

    if (currentClue) {
      const answer = currentClue.answer.toLowerCase();

      const inputValue = currentClue.boxes.map((boxId) => {
        const box = grid.find((item) => item.id === boxId);

        return box ? document.querySelector(`#${box.id}`).value : "";
      });

      const joinedInputValue = inputValue.join("").toLowerCase();

      if (joinedInputValue === answer) {
        alert("Correct answer");

        const clueTextElement = document.querySelector(`#${clueID}`);

        if (clueTextElement) {
          clueTextElement.classList.add("text-correct");
        }

        currentClue.boxes.forEach((boxId) => {
          const boxElement = document.querySelector(`#${boxId}`);
          if (boxElement) {
            boxElement.style.background = "#A2C579";
          }
        });
      } else {
        alert("Incorrect answer");
        currentClue.boxes.forEach((boxId) => {
          const boxElement = document.querySelector(`#${boxId}`);
          if (boxElement) {
            boxElement.style.background = "red";
          }
        });

        setTimeout(() => {
          currentClue.boxes.forEach((boxId) => {
            const boxElement = document.querySelector(`#${boxId}`);
            if (boxElement) {
              boxElement.style.background = "";
            }
          });
        }, 1000);
      }
    } else {
      alert("Clue not found for ID:", clueID);
    }
  }

  render() {
    return (
      <li className={`clue ${this.state.active ? "active" : ""}`}>
        <button className="clue-button" onClick={this.handleClick}>
          <span className="clue-number">{this.props.clueNumber}.</span>
          <span id={this.props.clueID} className="clue-text">
            {this.props.clueText}
          </span>
        </button>
        <button className="check-answer-button" onClick={() => this.handleCheckAnswer(this.props.clueID)}>
          Check
        </button>
      </li>
    );
  }
}

class Board extends React.Component {
  render() {
    return (
      <div className="crossword-board">
        {this.props.grid.map((box) => {
          const { id, letter, clues, label } = box;

          return (
            <Box
              key={id}
              id={id}
              letter={letter}
              boxClues={clues}
              label={label}
              allClues={this.props.allClues}
              isHighlighted={this.props.highlightedBoxes.indexOf(id) > -1}
              setActiveClueBoxes={this.props.setActiveClueBoxes}
              setActiveClue={this.props.setActiveClue}
              setBoxInFocus={this.props.setBoxInFocus}
              isInFocus={this.props.boxInFocus === id}
            />
          );
        })}
      </div>
    );
  }
}

class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlight: props.isHighlighted,
      isInFocus: props.isInFocus,
    };

    this.handleFocus = this.handleFocus.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      highlight: newProps.isHighlighted,
      isInFocus: newProps.isInFocus,
    });
  }

  componentDidUpdate() {
    if (this.state.isInFocus) {
      this.textInput.focus();
    }
  }

  handleFocus(event) {
    this.props.setActiveClue(this.props.boxClues);
    let boxesToHighlight = [];

    for (const clue of this.props.boxClues) {
      boxesToHighlight = boxesToHighlight.concat(this.props.allClues[clue].boxes);
    }

    this.props.setActiveClueBoxes(boxesToHighlight);
    this.props.setBoxInFocus(event.target.id);
  }

  render() {
    let visibleLabel;
    let input;

    if (this.props.label) {
      visibleLabel = <span className="box-label">{this.props.label}</span>;
    }

    if (this.props.letter) {
      input = (
        <input
          id={this.props.id}
          type="text"
          maxLength="1"
          className={`box-input ${this.state.highlight ? "highlight" : ""}`}
          onFocus={this.handleFocus}
          ref={(input) => {
            this.textInput = input;
          }}
        />
      );
    }

    return (
      <div className={`box ${!this.props.letter ? " blank" : ""}`}>
        {visibleLabel}
        {input}
      </div>
    );
  }
}

const root = createRoot(document.querySelector("#CrosswordApp"));
root.render(<Crossword />);
