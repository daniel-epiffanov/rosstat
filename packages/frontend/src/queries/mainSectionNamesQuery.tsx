import axios from 'axios'
import { MainSectionNamesQuery } from '../../../../sharedTypes/gqlQueries'

import { hostApi } from '../helpers/host'
import GqlResponse from './@types/gqlResponse'

type Response = GqlResponse<{ mainSectionNames: MainSectionNamesQuery }>

type mainSectionNamesQueryFn = () => Promise<MainSectionNamesQuery | null>

const mainSectionNamesQuery: mainSectionNamesQueryFn = async () => {
	const query = `
	query {
		mainSectionNames
	}`

	const axiosResponse = await axios.post<Response>(hostApi, { query })
	console.log({ axiosResponse })
	const mainSectionNames = axiosResponse.data.data.mainSectionNames
	if (!mainSectionNames) return null
	return mainSectionNames
}

export default mainSectionNamesQuery
