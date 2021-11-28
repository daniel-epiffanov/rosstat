import ResponsiveBox, {
	Row, Col, Item, Location,
} from 'devextreme-react/responsive-box'
import React from 'react'
// import ChartWrapper from '../../components/Charts/ChartWrapper'
import DoughnutChart from '../../components/DoughnutChart'
// import MultipleAxesChart from '../../components/MultipleAxesChart'
// import RangeSelector from '../../components/RangeSelector'
import styles from './styles/Home.module.scss'
import VectorMap from './VectorMap'

const Home = () => {
	const [selectedRegion, setSelectedRegion] = React
		.useState(process.env.INITIAL_MAP_VALUE || '')

	const changeSelectedRegion = (newSelectedRegion: string) => {
		setSelectedRegion(newSelectedRegion)
	}

	React.useEffect(() => {
		console.log({ selectedRegion })
	}, [selectedRegion])

	// <ChartWrapper />
	// <VectorMapRComponent changeSelectedRegion={changeSelectedRegion} />

	// return (
	// 	<div>
	// 		<h1>Yo</h1>
	// 	</div>
	// )

	return (
		<ResponsiveBox>
			<Row ratio={1} />
			<Row ratio={1} />
			<Row ratio={0.7} />
			<Col ratio={1} />
			{/* <Col ratio={1} screen="md lg" /> */}
			{/* <Col ratio={0.5} screen="md lg" /> */}

			<Item>
				<Location screen="md lg" row={0} col={0} />
				{/* <Location screen="xs sm" row={0} col={0} /> */}
				<div className="content item">
					<DoughnutChart />
				</div>
			</Item>

			<Item>
				<Location screen="md lg" row={1} col={0} />
				<div className="left-side-bar item">
					<VectorMap />
				</div>
			</Item>

		</ResponsiveBox>
	)
}
export default Home
