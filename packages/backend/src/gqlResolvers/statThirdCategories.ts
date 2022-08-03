import { StatCategories } from '../../../../sharedTypes/gqlQueries'
import StatisticsModel from '../mongoModels/statistics'
import { ResolverFnAsync } from './types/ResolverFn'
import _ from 'lodash'

type Args = Readonly<{
	firstCategory: string,
	secondCategory: string,
}>

export const getSubCategories = async (firstCategory: string, secondCategory: string) => {
	const mongoRes = await StatisticsModel.aggregate<{ _id: StatCategories[0] }>([
		{ $unwind: "$mainSections" },
		{ $match: { "mainSections.name": firstCategory } },
		{ $project: { "mainSections.subSections.name": 1, "mainSections.subSections.children.name": 1 } },
		{ $project: { subSections: "$mainSections.subSections" } },
		{ $unwind: "$subSections" },
		{ $match: { "subSections.name": secondCategory } },
		{ $unwind: "$subSections.children" },
		{ $group: { _id: "$subSections.children.name" } },
		{ $sort: { _id: 1 } }
	])

	const rawSubSectionNames = mongoRes.map(({ _id }) => {
		return _id
	})

	return rawSubSectionNames
}


const statThirdCategories: ResolverFnAsync<StatCategories | null> = async (
	parent: any,
	args: Args,
) => {
	const { firstCategory, secondCategory } = args

	console.log({firstCategory})

	return await getSubCategories(firstCategory, secondCategory)
}

export default statThirdCategories