import React, { Component } from "react";
import "./App.css";
import { Button, Form } from "semantic-ui-react";
import { chartOptions } from "chart.js";
import { Table, TableBody } from "semantic-ui-react";
import ChoroplethExample from './maps/choropleth-example'
import { mockPeople } from './data'

var BarChart = require("react-chartjs").Bar;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyWord: '',
      all: [],
      countries: {}
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
        this.setState(prevState => {
          return {
            ...prevState,
            all: dat,
          }
        })
      })
  }

  // async sortCount() {
  //   const { authors } = this.state.all
  //   console.log(authors)

  //   await authors.sort((a,b) => (a.count > b.count) ? - 1 : ((b.count > a.count) ? 1 : 0))
  //   console.log(authors)
  // }

  getCountry() {
    const { all } = this.state
    console.log(all.countries)
    console.log(typeof all.countries)
    // all.countries.map(i => {
    //   console.log(i)
    // })
    // var BreakException = {}
    // let bool = false
    // try {
    //   Object.keys(all).map(i => {
    //     console.log(i)
    //     if (i === "authors") {
    //       bool = true
    //       throw BreakException
    //     } else {
    //       return all[i].map((data, index) => {
    //         bool = false
    //         console.log(data)
    //       })
    //     }
    //   })
    // } catch (e) {
    //   if (e !== BreakException) throw e
    // }
  }

  getTopRank() {
    const { all } = this.state
    var rows = []
    var BreakException = {}
    let bool = false
    try {
      Object.keys(all).map(i => {
        if (i === "countries") {
          bool = true
          throw BreakException
        } else {
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
        }
      })
    } catch (e) {
      if (e !== BreakException) throw e
    }

    return rows
  }

  createTable() {
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

  createGraph() {
    var graph = {
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
    }

    // this.getTopRank().map((data, index) => {
    //   console.log(data[index])
    //   var graph = {
    //     labels: [data[0].name, data[1].name, data[2].name, data[3].name, data[4].name, data[5].name, data[6].name, data[7].name, data[8].name, data[9].name],
    //     datasets: [
    //       {
    //         label: "My First dataset",
    //         fillColor: "rgba(220,220,220,0.5)",
    //         strokeColor: "rgba(220,220,220,0.8)",
    //         highlightFill: "rgba(220,220,220,0.75)",
    //         highlightStroke: "rgba(220,220,220,1)",
    //         data: [data[0].count, data[1].count, data[2].count, data[3].count, data[4].count, data[5].count, data[6].count, data[7].count, data[8].count, data[9].count]
    //       }
    //     ]
    //   }
    // })

    return graph
  }

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
    const { keyWord } = this.state
    fetch('/filter', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword: keyWord
      })
    }).then(res => res.json())
      .then(dat => {
        this.setState(prevState => {
          return {
            ...prevState,
            all: dat,
          }
        })
      })
  }

  render() {
    this.getCountry()
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
          <BarChart data={this.createGraph()} options={chartOptions} width="1500" height="500" />
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
