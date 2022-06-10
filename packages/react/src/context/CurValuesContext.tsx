import {
	createContext, FC, useContext, useState,
} from 'react'
import { StatData } from '../../../../sharedTypes/gqlQueries'
import {	MongoRegionCoords,} from '../../../../sharedTypes/mongoModels'
import Message from '../components/Message'
import { usePrefetchedValuesContext } from './PrefetchedValuesContext'

interface ContextValues {
	curRegionTypeOnMap: MongoRegionCoords['type'],
	curRegions: string[],
	curMenuVals: ReadonlyArray<string>,
	curStatData?: Readonly<{
    [key: string]: StatData
	}> | null,

	setCurValues: SetCurValues,
}

type ReadonlyContextValues = Readonly<ContextValues>

type SetCurValues = (newSelections: Partial<ReadonlyStateValues>) => void

type ReadonlyStateValues = Omit<ReadonlyContextValues, 'setCurValues'>

const CurValuesContext = createContext<ReadonlyContextValues>({} as ReadonlyContextValues)

export const useCurValuesContext = () => useContext(CurValuesContext)

export const CurValuesProvider: FC = ({ children }) => {
	// const { statMainSectionNames, statRegionNames, statYears } = useGeneralDataContext()

	
	const [curValuesAcc, setCurValuesAcc] = useState<ReadonlyStateValues>({
		curRegionTypeOnMap: 'region',
		curRegions: [],
		curMenuVals: [],
		curStatData: null,
	})

	const setCurValues: SetCurValues = (newSelections) => {
		setCurValuesAcc(prevSelectionParams => ({ ...prevSelectionParams, ...newSelections }))
	}
	
	return (
		<CurValuesContext.Provider value={{
			...curValuesAcc,
			setCurValues,
		}}
		>
			{children}
		</CurValuesContext.Provider>
	)
}