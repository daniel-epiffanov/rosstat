/* eslint-disable import/extensions */
import React from 'react'
import axios from 'axios'
// import { LoadPanel } from 'devextreme-react/load-panel'
import { LoadIndicator } from 'devextreme-react/load-indicator'
import VectorMap, {
	Layer,
	Tooltip,
	Border,
	Font,
} from 'devextreme-react/vector-map'
// @ts-ignore
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js'
import { ClickEvent as MapClickEvent } from 'devextreme/viz/vector_map'
import { GqlResponse, MultipleRegionsCoords } from '../../../../../@types/gqlResolvers'
import styles from './styles/VectorMap.module.scss'

// @ts-ignore
// import MapToolbar from './MapToolbar'

interface PropsInterface {
	// changeSelectedRegion: (newSelectedRegion: string) => void
}

type Response = GqlResponse<{ multipleRegionsCoords: MultipleRegionsCoords }>

const bounds = [71, 97, 45, 26]

// function customizeLayer(elements: any) {
// 	elements.forEach((element: any) => {
// 		// console.log(element.attribute('name_ru'))
// 		// const country = countries[element.attribute('name')]
// 		// if (country) {
// 		element.applySettings({
// 			color: '#004a8c61',
// 			hoveredColor: '#002e8324',
// 			selectedColor: '#004a8c61',
// 		})
// 		// }
// 	})
// }

// console.log({ testData })

const VectorMapRComponent = (props: PropsInterface) => {
	// const { changeSelectedRegion } = props

	const [mapCoords, setMapCoords] = React.useState<MultipleRegionsCoords>([])

	// const getCoords = () => ({
	// 	type: 'FeatureCollection',
	// 	features: mapCoords,
	// })

	React.useEffect(() => {
		console.log('process.env.REACT_APP_API_URL: ', process.env.REACT_APP_API_URL)
		if (process.env.REACT_APP_API_URL) {
			const query = `
			query {
				multipleRegionsCoords(type: "federalDistrict") {
					type,
					geometry {
						type,
						coordinates
					},
					properties {
						name_en
						name_ru
					}
				},
				
			}`

			axios
				.post<Response>(process.env.REACT_APP_API_URL, { query })
				.then((res) => {
					const { multipleRegionsCoords } = res.data.data
					// console.log({ data })
					// console.log({ res })
					// console.log(data.data.mapCoords)
					// const changedData = data.data.mapCoords
					setMapCoords(multipleRegionsCoords)
					// eslint-disable-next-line no-debugger
					// debugger
					// if (Array.isArray(res.data)) scndTopLvlData(data)
				})
		}
	}, [])

	React.useEffect(() => {
		console.log({ mapCoords })
	}, [mapCoords])

	// const onSelectionChangedHandler = (e: any) => {
	// 	// @ts-ignore
	// 	const selectedObject = mapCoords.features[e.target.index]
	// 	const selectedObjectNameRu = selectedObject.properties.name_ru

	// 	console.log({ selectedObjectNameRu })
	// 	// changeSelectedRegion(selectedObjectNameRu)
	// }

	function onMapClick(e: MapClickEvent) {
		console.log({ e })
		// @ts-ignore
		const attributes = e.target.attribute()
		console.log({ attributes })
		// if (a.target && mapCoords[target.attribute('name_ru')]) {

		e.target.selected(true)
		// }
	}

	return (
		<div style={{ position: 'relative' }}>
			{/* <MapToolbar /> */}

			{/* <LoadIndicator
				id="large-indicator"
				height={20}
				width={20}
				visible={mapCoords.features.length === 0}
				className={styles.LoadIndicator}
			/> */}
			{/* <LoadPanel
				shadingColor="rgba(0,0,0,0.4)"
				// position={position}
				// onHiding={this.hideLoadPanel}
				visible={!mapCoords}
				showIndicator
				shading
				showPane
				closeOnOutsideClick
			/> */}
			<VectorMap
				id="vector-map"
				loadingIndicator={{ enabled: true }}
				bounds={bounds}
				// eslint-disable-next-line react/jsx-no-bind
				onClick={onMapClick}
				maxZoomFactor={4}
			// onSelectionChanged={onSelectionChangedHandler}
			>
				<Layer
					dataSource={{
						type: 'FeatureCollection',
						features: mapCoords,
					}}
				// dataSource={mapsData.world}
				// customize={customizeLayer}
				/>
				{/* <Layer
					dataSource={getCoords()}
					customize={customizeLayer}
				/> */}
				{/* <Tooltip
					enabled
				// customizeTooltip={customizeTooltip}
				>
					<Border visible />
					<Font color="#fff" />
				</Tooltip> */}
			</VectorMap>
		</div>
	)
}

export default VectorMapRComponent
