import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

class CaseSummary extends React.Component {
  render () {
    return (<div className="case-summary">
              <header className="header">
                <h1>Donoghue v Stevenson</h1>
              </header>
              <Facts></Facts>
              <Holdings></Holdings>
            </div>);
  }
}

class Facts extends React.Component {
  handleClick(element) {
    var content = element.target.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  }

  render () {
    return (<div className="facts">
              <div className="collapsible" onClick={this.handleClick}>Sub-fact 1</div>
              <div className="collapsible-content">
                <p>Content content content...</p>
              </div>
              <div className="collapsible" onClick={this.handleClick}>Sub-fact 2</div>
              <div className="collapsible-content">
                <p>Content content content...</p>
              </div>
            </div>);
  }
}

class Holdings extends React.Component {
  handleClick(element) {
    var content = element.target.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  }

  render() {
    return (<div className="holding">
              <div className="collapsible" onClick={this.handleClick}>Sub-holding 1</div>
              <div className="collapsible-content">
                <p>Content content content...</p>
              </div>
              <div type="button" className="collapsible" onClick={this.handleClick}>Sub-holding 2</div>
              <div className="collapsible-content">
                <p>Content content content...</p>
              </div>
            </div>);
  }
}


ReactDOM.render(
  <CaseSummary></CaseSummary>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
