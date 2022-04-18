import { ApolloServer } from "apollo-server-express"
import { StatRegionNames } from "../../../../../../sharedTypes/gqlQueries"

type Props = Readonly<{
	testServer: ApolloServer
}>

const statRegionNames = async (props: Props) => {
	const { testServer } = props

	const response = await testServer.executeOperation({
		query: 'query { statRegionNames }',
	})

	const statRegionNames: StatRegionNames | undefined = response.data?.statRegionNames

	if (!statRegionNames) throw new Error('statisticsRegionNames is falsy')

	return statRegionNames
}

export default statRegionNames