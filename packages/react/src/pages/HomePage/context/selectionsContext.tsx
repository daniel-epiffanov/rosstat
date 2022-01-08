import {
	createContext, FC, useContext, useState,
} from 'react'
import {
	ReadonlyStatisticsOfMainSection,
	ReadonlyRegionCoords,
	ReadonlyStatisticsOfRegion,
	ReadonlyStatisticsOfSubSection,
	ReadonlyStatisticsData,
} from '../../../../../../sharedTypes/mongoModels'
import { useSimpleQueriesContext } from '../../../context/simpleQueriesContext'

interface ContextValues {
	selectedRegionName: ReadonlyStatisticsOfRegion['regionName'],
	selectedMainSectionName: ReadonlyStatisticsOfMainSection['name'],
	selectedSubSectionName: ReadonlyStatisticsOfSubSection['name'],

	selectedRegionTypeOnMap: ReadonlyRegionCoords['type'],
	selectedYearOnMap: ReadonlyStatisticsData['year'],

	selectionsHandler: SelectionsHandler,
}

type ReadonlyContextValues = Readonly<ContextValues>

type SelectionsHandler = (newSelections: Partial<ReadonlyStateValues>) => void

type ReadonlyStateValues = Omit<ReadonlyContextValues, 'selectionsHandler'>

const SelectionsContext = createContext<ReadonlyContextValues>({} as ReadonlyContextValues)

export const useSelectionsContext = () => useContext(SelectionsContext)

export const SelectionsProvider: FC = ({ children }) => {
	const { mainSectionNames, regionNames } = useSimpleQueriesContext()

	const [selections, setSelections] = useState<ReadonlyStateValues>({
		selectedRegionName: regionNames[1],
		selectedMainSectionName: mainSectionNames[0],
		selectedSubSectionName: '',
		selectedYearOnMap: 2007,
		selectedRegionTypeOnMap: 'federalDistrict',
	})

	const selectionsHandler: SelectionsHandler = (newSelections) => {
		setSelections(prevSelectionParams => ({ ...prevSelectionParams, ...newSelections }))
	}

	return (
		<SelectionsContext.Provider value={{
			...selections,
			selectionsHandler,
		}}
		>
			{children}
		</SelectionsContext.Provider>
	)
}
