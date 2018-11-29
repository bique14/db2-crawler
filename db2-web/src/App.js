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
      countries: []
    }
  }

  componentWillMount() {
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

  getCountry() {
    const { all } = this.state
    // console.log(all.countries)
    var aCountry = []
    all.countries && all.countries.map(i => {
      aCountry.push(i)
    })
    // console.log(aCountry)
    return aCountry
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
            if (index >= 20) {
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

  sortCount() {
    const sortCountr = this.getTopRank() && this.getTopRank().sort((a, b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? - 1 : 0))
    return sortCountr
  }

  createTable() {
    return this.sortCount().map((data, index) => {
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
          data: [mockPeople[9].amount, mockPeople[1].amount, mockPeople[2].amount, mockPeople[3].amount, mockPeople[4].amount, mockPeople[5].amount, mockPeople[6].amount, mockPeople[7].amount, mockPeople[8].amount, mockPeople[9].amount]
        }
      ]
    }

    const people = []
    this.sortCount() && this.sortCount().map(data => {
      people.push(data)
    })

    var graph = {
      labels: [
        people.length && people[0].name,
        people.length && people[1].name,
        people.length && people[2].name,
        people.length && people[3].name,
        people.length && people[4].name,
        people.length && people[5].name,
        people.length && people[6].name,
        people.length && people[7].name,
        people.length && people[8].name,
        people.length && people[9].name
      ],
      datasets: [
        {
          label: "My First dataset",
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,0.8)",
          highlightFill: "rgba(220,220,220,0.75)",
          highlightStroke: "rgba(220,220,220,1)",
          data: [
            people.length && people[0].count,
            people.length && people[1].count,
            people.length && people[2].count,
            people.length && people[3].count,
            people.length && people[4].count,
            people.length && people[5].count,
            people.length && people[6].count,
            people.length && people[7].count,
            people.length && people[8].count,
            people.length && people[9].count
          ],
        }
      ]
    }
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
    this.sortCount()
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

        <ChoroplethExample country={this.getCountry()} />
      </div>
    );
  }
}

export default App;
