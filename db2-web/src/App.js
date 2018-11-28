import React, { Component } from "react";
import "./App.css";
import { Button, Form } from "semantic-ui-react";
import { chartOptions } from "chart.js";
import { Table, TableBody } from "semantic-ui-react";
import ChoroplethExample from './maps/choropleth-example'
import { mockPeople } from './data'


var data = {
  labels: [mockPeople[0].name, mockPeople[1].name, mockPeople[2].name, mockPeople[3].name, mockPeople[4].name, mockPeople[5].name, mockPeople[6].name, mockPeople[7].name, mockPeople[8].name, mockPeople[9].name],
  datasets: [
    {
      label: "My First dataset",
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: [mockPeople[0].amount, mockPeople[1].amount, mockPeople[2].amount, mockPeople[3].amount, mockPeople[4].amount, mockPeople[5].amount, mockPeople[6].amount, mockPeople[7].amount, mockPeople[8].amount, mockPeople[9].amount]
    }
  ]
};

var BarChart = require("react-chartjs").Bar;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyWord: '',
      all: [],

      data: {
        labels: [],
        datasets: [
          {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: []
          }
        ]
      }
    }
  }

  componentDidMount() {
    fetch('/filter', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword: ''
      })
    }).then(res => res.json())
      .then(dat => {
        // arr.push(data)
        this.setState(prevState => {
          return {
            ...prevState,
            all: dat,
          }
        })
        // this.setState({
        //   all: dat,
        //   data: 
        // }, () => console.log(this.state.all))
      })
  }

  // async sortCount() {
  //   const { authors } = this.state.all
  //   console.log(authors)

  //   await authors.sort((a,b) => (a.count > b.count) ? - 1 : ((b.count > a.count) ? 1 : 0))
  //   console.log(authors)
  // }

  getTopRank() {
    const { all } = this.state
    var rows = []
    var BreakException = {}
    let bool = false
    try {
      Object.keys(all).map(i => {
        return all[i].map((data, index) => {
          if (index >= 10) {
            bool = true
            throw BreakException
          }
          else {
            bool = false
            rows.push(data)
          }
        })
      })
    } catch (e) {
      if (e !== BreakException) throw e
    }

    return rows
  }

  createTable() {
    // const { all } = this.state
    // const rows = 
    // var BreakException = {}
    // let bool = false
    // try {
    //   Object.keys(all).map(i => {
    //     return all[i].map((data, index) => {
    //       if (index >= 10) {
    //         bool = true
    //         throw BreakException
    //       }
    //       else {
    //         bool = false
    //         rows.push(data)
    //       }
    //     })
    //   })
    // } catch (e) {
    //   if (e !== BreakException) throw e
    // }

    return this.getTopRank().map((data, index) => {
      const { name, email, count, affiliation } = data
      return (
        <Table.Row className="rows" key={index}>
          <Table.Cell className="ellipsis rank">{index + 1}</Table.Cell>
          <Table.Cell className="ellipsis name">{name}</Table.Cell>
          <Table.Cell className="ellipsis email">{email === null ? 'Not Found' : email}</Table.Cell>
          <Table.Cell className="ellipsis aff"><span>{affiliation}</span></Table.Cell>
          <Table.Cell className="ellipsis amount">{count}</Table.Cell>
        </Table.Row>
      )
    })
  }

  // createGraph() {
  //   const { all } = this.state
  //   var BreakException = {}
  //   let bool = false
  //   try {
  //     Object.keys(all).map(i => {
  //       return all[i].map((data, index) => {
  //         if (index >= 10) {
  //           bool = true
  //           throw BreakException
  //         }
  //         else {
  //           bool = false
  //           rows.push(data)
  //         }
  //       })
  //     })
  //   } catch (e) {
  //     if (e !== BreakException) throw e
  //   }

  // }

  onKeyWordChange(event) {
    const { value } = event.target
    this.setState(prevState => {
      return {
        ...prevState,
        keyWord: value,
      }
    })
  }

  onSubmit() {
    console.log(this.state.keyWord)
    // fetch('/filter', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'cache-control': 'no-cache',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     keyword: 'DRB'
    //   })
    // }).then(res => res.json())
    //   .then(data => {
    //     console.log(data)
    //   })
  }

  render() {
    return (
      <div className="App">
        <Form style={{ width: "60%", margin: "auto" }}>
          <Form.Field>
            <label for="keyword">Type a keyword</label>
            <input id="keyword"
              placeholder="e.g. database"
              onChange={this.onKeyWordChange.bind(this)}
            />
          </Form.Field>
          <Button type="submit"
            onClick={this.onSubmit.bind(this)}
          >
            Submit
          </Button>
        </Form>
        <div style={{ marginBottom: "30px", marginTop: "30px", textAlign: "center" }}>
          <BarChart data={data} options={chartOptions} width="1500" height="500" />
        </div>

        <Table singleLine
          className="table"
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Rank</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>E-mail address</Table.HeaderCell>
              <Table.HeaderCell>Affiliation</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <TableBody>
            {this.createTable()}
          </TableBody>
        </Table>

        <ChoroplethExample />
      </div>
    );
  }
}

export default App;
