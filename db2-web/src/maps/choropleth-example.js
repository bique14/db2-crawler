/* global d3 */

import React from 'react';

import Datamap from './datamap';
import Example from './example'

const colors = d3.scale.category10();


export default class ChoroplethExample extends React.Component {

	state = {
		data: {
			USA: { fillKey: 'authorHasTraveledTo' },
			JPN: { fillKey: 'authorHasTraveledTo' },
			ITA: { fillKey: 'authorHasTraveledTo' },
			CRI: { fillKey: 'authorHasTraveledTo' },
			KOR: { fillKey: 'authorHasTraveledTo' },
			DEU: { fillKey: 'authorHasTraveledTo' }
		},
		country: {},
		plot: {
			USA: 0,
			JPN: 0,
			ITA: 0,
			KOR: 0,
			THA: 0,
			CHN: 0, //china
			RUS: 0,
			IND: 0, // india
			ENG: 0, // england
			FRA: 0,
		}
	};

	static getDerivedStateFromProps(props, state) {
		const { country } = props
		if (country !== state.country) {
			return {
				...state,
				country
			}
		} else {
			return state
		}
	}

	componentDidMount() {
		this.update();
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	formatCountryName() {
		const { country } = this.state
		var BreakException = {}
		let bool = false
		try {
			country.map((data, index) => {
				if (data.name === null) {
					bool = true
					throw BreakException
				} else {
					bool = false
					if (data.name.toLowerCase() === "united states" ||
						data.name.toLowerCase() === "united states of america" ||
						data.name.toLowerCase() === "america" ||
						data.name.toLowerCase() === "usa" ||
						data.name.toLowerCase() === "us"
					) {
						this.state.plot.USA += 1
					} else if (data.name.toLowerCase() === "japan" ||
						data.name.toLowerCase() === "jpn"
					) {
						this.state.plot.JPN += 1
					} else if (data.name.toLowerCase() === "italy") {
						this.state.plot.ITA += 1
					} else if (data.name.toLowerCase() === "korea" ||
						data.name.toLowerCase() === "south korea"
					) {
						this.state.plot.KOR += 1
					} else if (data.name.toLowerCase() === "thai" ||
						data.name.toLowerCase() === "thailand" ||
						data.name.toLowerCase() === "siam"
					) {
						this.state.plot.THA += 1
					} else if (data.name.toLowerCase() === "china" ||
						data.name.toLowerCase() === "chinese"
					) {
						this.state.plot.CHA += 1
					} else if (data.name.toLowerCase() === "russia") {
						this.state.plot.RUS += 1
					} else if (data.name.toLowerCase() === "india") {
						this.state.plot.IND += 1
					} else if (data.name.toLowerCase() === "uk" ||
						data.name.toLowerCase() === "united kingdom" ||
						data.name.toLowerCase() === "england" ||
						data.name.toLowerCase() === "britain" ||
						data.name.toLowerCase() === "greate britain"
					) {
						this.state.plot.ENG += 1
					} else if (data.name.toLowerCase() === "france") {
						this.state.plot.FRA += 1
					}
				}
			})
		} catch (e) {
			if (e !== BreakException) throw e
		}
	}

	update() {
		// const chkColor = 
		const dat = []
		const { plot } = this.state
		Object.keys(plot).map(i => {
			dat.push({
				[i]: 0
			})
		})
		console.log(dat)

		// dat.map(i => {
			// console.log(i)
			// this.setState({
			// 	data: {
			// 		[i]: colors(Math.random() * 10)
			// 	}
			// })

		// 	this.setState(prevState => {
		// 		return {
		// 			...prevState,
		// 			data: {
		// 				...prevState.data,
		// 				[i]: '#000000'
		// 			}
		// 		}
		// 	})
		// })

		// console.log(this.state)

		this.setState({
			data: {
				USA: colors(Math.random() * 10),
				RUS: colors(Math.random() * 100),
				AUS: { fillKey: 'authorHasTraveledTo' },
				BRA: colors(Math.random() * 50),
				CAN: colors(Math.random() * 50),
				ZAF: colors(Math.random() * 50),
				IND: colors(Math.random() * 50),
				THA: colors(Math.random() * 100)
			}
		});

	}

	render() {
		this.formatCountryName()

		return (
			<Example label="Graph">
				<Datamap
					responsive
					data={this.state.data}
					fills={{
						defaultFill: '#abdda4',
						authorHasTraveledTo: '#fa0fa0'
					}}
					projection="mercator"
					updateChoroplethOptions={{ reset: false }}
				/>
			</Example>);
	}

}
