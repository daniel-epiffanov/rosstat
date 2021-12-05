/* eslint-disable import/extensions */
import React, {
	FC, useEffect, useRef, useState,
} from 'react'
import axios from 'axios'
// import { LoadPanel } from 'devextreme-react/load-panel'
import { LoadIndicator } from 'devextreme-react/load-indicator'
import VectorMap, {
	Layer,
	Tooltip,
	Border,
	Font,
	Label,
	Legend,
	Source,
} from 'devextreme-react/vector-map'
// @ts-ignore
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js'
import { ClickEvent as MapClickEvent } from 'devextreme/viz/vector_map'
import { GqlResponse, MultipleRegionsCoords, RegionNames } from '../../../../../@types/gqlResolvers'
import styles from './styles/VectorMap.module.scss'
import { SelectedRegion } from '../../@types/states'
import { hostApi } from '../../helpers/host'
import { SelectionMode } from './Home'
import statisticsByYearsQuery from '../../queries/statisticsByYears'

// @ts-ignore
// import MapToolbar from './MapToolbar'

interface Props {
	selectedRegionHandler: (newSelectedRegion: string) => void,
	selectedRegion: SelectedRegion,
	mainSectionName: string,
	subSectionTitle: string,
}

type Response = GqlResponse<{
	multipleRegionsCoords: MultipleRegionsCoords,
	regionNames: RegionNames
}>

const bounds = [71, 97, 45, 26]

// console.log({ testData })

const VectorMapRComponent: FC<Props> = (props) => {
	const {
		selectedRegionHandler, selectedRegion, mainSectionName, subSectionTitle,
	} = props
	const [mapCoords, setMapCoords] = useState<MultipleRegionsCoords>([])
	const [availableRegions, setAvailableRegions] = useState<RegionNames>([])
	const [year, setYear] = useState<number>(2007)

	React.useEffect(() => {
		console.log({ availableRegions })
	}, [availableRegions])

	// const vectorMapRef = useRef(null)

	// useEffect(() => {
	// 	console.log({ selectedRegion })
	// 	console.log({ mainSectionName })
	// 	console.log({ subSectionTitle })
	// }, [selectedRegion, mainSectionName, subSectionTitle])

	function customizeLayer(elements: any) {
		// console.log({ elements })
		elements.forEach((element: any, i: number) => {
			const name_ru: string = element.attribute('name_ru')
			if (name_ru === selectedRegion) element.selected(true)

			if (availableRegions.includes(name_ru)) {
				// element.attribute('population', i * 5)
				// console.log({ vectorMapRef })
				// debugger

				if (!mainSectionName || !subSectionTitle) return

				const queryOptions = {
					selectedRegion: name_ru, mainSectionName, subSectionTitle, startYear: year, endYear: year,
				};
				(async () => {
					element.attribute('value', i * 2)
					const statisticsByYears = await statisticsByYearsQuery(queryOptions)
					if (!statisticsByYears) return
					const value = statisticsByYears[0].value
					console.log({ value })
					element.attribute('value', value)
					// if (!statisticsByYears) return
					// setDataSource(statisticsByYears)
				})()
				return
			}

			element.applySettings({
				opacity: 0.2,
			})
		})
	}

	React.useEffect(() => {
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
				regionNames
				
			}`

		console.log({ hostApi })

		axios
			.post<Response>(hostApi, { query })
			.then((res) => {
				const { multipleRegionsCoords, regionNames } = res.data.data
				setMapCoords(multipleRegionsCoords)
				setAvailableRegions(regionNames)
			})
	}, [])

	function customizeTooltip(element: any) {
		return {
			text: `${element.attribute('name_ru')} ${element.attribute('value')}`,
		}
	}

	function onMapClick(e: MapClickEvent) {
		if (!e.target) return
		const name_ru = e.target.attribute('name_ru')
		if (!availableRegions.includes(name_ru)) return

		e.target.selected(!e.target.selected())

		// selectedRegionHandler(name_ru)
	}

	const onSelectionChanged = (e: MapClickEvent) => {
		if (!e.target) return
		const name_ru: string = e.target.attribute('name_ru')
		selectedRegionHandler(name_ru)
	}

	const colorGroups = [0, 200, 400, 600, 800, 900, 1000]

	return (
		<div style={{ position: 'relative' }}>
			<VectorMap
				bounds={bounds}
				onClick={onMapClick}
				onSelectionChanged={onSelectionChanged}
			// ref={vectorMapRef}
			>
				<Layer
					dataSource={{
						type: 'FeatureCollection',
						features: mapCoords,
					}}
					type="area"
					customize={customizeLayer}
					selectionMode="single"
					name="regions"
					colorGroupingField="value"
					colorGroups={colorGroups}
					palette="Violet"
				>
					<Label enabled dataField="name_ru">
						<Font size={16} />
					</Label>
				</Layer>

				<Tooltip
					enabled
					customizeTooltip={customizeTooltip}
				>
					<Border visible />
					<Font color="#fff" />
				</Tooltip>

				<Legend
					customizeText="yo"
				>
					<Source layer="regions" grouping="color" />
				</Legend>

			</VectorMap>
		</div>
	)
}

export default VectorMapRComponent
