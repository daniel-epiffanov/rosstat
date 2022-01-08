/* eslint-disable import/extensions */
import React, { FC, useEffect, useState } from 'react'
import VectorMap, {
	Layer,
	Tooltip,
	Border,
	Legend,
	Source,
	LoadingIndicator,
	Font,
} from 'devextreme-react/vector-map'
import dxVectorMap, { ClickEvent as MapClickEvent } from 'devextreme/viz/vector_map'
import styles from './styles/index.module.scss'
import useVectorMapCoordsQuery from './hooks/useVectorMapCoordsQuery'
import Message from '../../../components/Message'
import useComponentInstance from '../../../hooks/useComponentInstance'
import { useSimpleQueriesContext } from '../../../context/simpleQueriesContext'
import { useSelectionsContext } from '../context/selectionsContext'
import useStatisticsDataQuery from './hooks/useStatisticsDataQuery'

type Props = Readonly<{}>

const BOUNDS = [71, 97, 45, 26]

const customizeText = (args: any) => {
	console.log()
	return 'yo'
}

const VectorMapRComponent: FC<Props> = (props) => {
	const {
		selectedRegionName,
		selectionsHandler,
		selectedMainSectionName,
		selectedSubSectionName,
		selectedYearOnMap,
	} = useSelectionsContext()
	const { regionNames } = useSimpleQueriesContext()
	const isRegionNameInStatistics = (regionName: string) => regionNames.includes(regionName)

	// graphql response
	const { loading, error, data } = useVectorMapCoordsQuery()
	const coordsByRegionType = data?.coordsByRegionType || []
	const getRegionNamesOnMapAndStatistics = () => {
		const regionNamesOnMap = coordsByRegionType
			.map(coordsByRegionTypeItem => coordsByRegionTypeItem.properties.name_ru)

		return regionNamesOnMap.filter(regionNameOnMap => regionNames.includes(regionNameOnMap))
	}
	const { statisticsByYear } = useStatisticsDataQuery(getRegionNamesOnMapAndStatistics())
	console.log({ statisticsByYear })

	// mapSetups
	const { instance, onInitialized } = useComponentInstance<dxVectorMap>()
	const [colorGroups, setColorGroups] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

	useEffect(() => {
		if (!selectedMainSectionName
			|| !selectedSubSectionName
			|| !instance
			|| Object.keys(statisticsByYear).length === 0) return

		const elements = instance.getLayers()[0].getElements()

		// let values: number[] = []

		elements.forEach((element) => {
			const regionName = element.attribute('name_ru')
			element.attribute('value', Math.floor(Math.random() * 10))
			if (isRegionNameInStatistics(regionName)) {
				// debugger
				// element.attribute('value', statisticsByYear[regionName].value)
				// element.attribute('value', `${Math.floor(Math.random())}`)
			}
		})

		// values = values.sort((a, b) => a - b)

		// if (values.length === 2) values.push(values[1] / 2)
		// if (values.length > 5) {
		// 	values = [
		// 		values[0],
		// 		Math.round(values[values.length - 1] / 2),
		// 		Math.round(values[values.length - 1] / 3),
		// 		Math.round(values[values.length - 1] / 4),
		// 		Math.round(values[values.length - 1] / 5),
		// 		values[values.length - 1],
		// 	]
		// }
		// const sortedValues = values.sort((a, b) => a - b)
		// setColorGroups([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
	}, [instance, selectedMainSectionName, selectedSubSectionName,
		selectedMainSectionName, statisticsByYear])

	async function customizeLayer(elements: any) {
		elements.map(async (element: any, i: number) => {
			const regionName: string = element.attribute('name_ru')
			if (regionName === selectedRegionName) element.selected(true)

			if (!isRegionNameInStatistics(regionName)) {
				element.applySettings({ opacity: 0.2 })
			}

			// if (!mainSectionName || !subSectionTitle) return

			element.attribute('value', Math.floor(Math.random() * 10))

			// const statisticsData = await statisticsByYearsQuery(queryOptions)
			// if (!statisticsData) return
			// const value = parseFloat(statisticsData[0].value)
			// element.attribute('value', value)
		})
	}

	function onMapClick(e: MapClickEvent) {
		if (!e.target) return
		const regionName = e.target.attribute('name_ru')
		const value = e.target.attribute('value')
		console.log({ value })
		if (!isRegionNameInStatistics(regionName)) return

		selectionsHandler({ selectedRegionName: regionName })
	}

	// if (loading) return <Message message="Загрузка карты..." />
	// if (error) {
	// 	console.error({ error })
	// 	return <Message message="Произошла ошибка.
	// Мы не можем получить координаты для карты с сервера." type="error" />
	// }

	function customizeTooltip(element: any) {
		console.log(element.attribute('value'))
		return {
			text: `${element.attribute('name_ru')} ${element.attribute('value')}`,
		}
	}

	return (
		<div style={{ position: 'relative' }}>
			<VectorMap
				id="vectorMap"
				bounds={BOUNDS}
				onClick={onMapClick}
				// onSelectionChanged={onSelectionChanged}
				onInitialized={onInitialized}
			>
				<Layer
					dataSource={{
						type: 'FeatureCollection',
						features: coordsByRegionType,
					}}
					type="area"
					customize={customizeLayer}
					selectionMode="single"
					name="regions"
					palette="Violet"
					colorGroupingField="value"
					colorGroups={colorGroups}
					label={{
						enabled: true,
						dataField: 'name_ru',
						font: {
							size: 10,
						},
					}}
				/>

				<Tooltip
					enabled
					customizeTooltip={customizeTooltip}
				>
					<Border visible />
					<Font color="#fff" />
				</Tooltip>

				<Legend customizeText={customizeText}>
					<Source layer="regions" grouping="color" />
				</Legend>

			</VectorMap>
		</div>
	)
}

export default VectorMapRComponent
