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

  createTable() {
    return mockPeople.map((data, index) => {
      return (
        <Table.Row>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{data.name}</Table.Cell>
          <Table.Cell>{data.email}</Table.Cell>
          <Table.Cell>Affi</Table.Cell>
          <Table.Cell>{data.amount}</Table.Cell>
        </Table.Row>
      )
    });
  }

  render() {
    return (
      <div className="App">
        <Form style={{ width: "60%", margin: "auto" }}>
          <Form.Field>
            <label>Type a keyword</label>
            <input placeholder="e.g. database" />
          </Form.Field>

          <Button type="submit">Submit</Button>
        </Form>
        <div style={{ marginBottom: "30px", marginTop: "30px", "textAlign": "center" }}>
          <BarChart data={data} options={chartOptions} width="1500" height="500" />
        </div>

        <Table singleLine style={{ width: "70%", margin: "auto" }}>
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
