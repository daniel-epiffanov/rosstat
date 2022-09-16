import axios from 'axios';
import { GqlStatData } from '../../../../sharedTypes/gqlQueries';
import { hostApi } from '../config/host';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

type Props = Readonly<{
	regionNames: ReadonlyArray<string>,
	mainCategory: string
	subCategory: string
	subSubCategory?: string
}>

type StatDataResponse = Readonly<{
	readonly data: {
		[key: string]: GqlStatData
	}
}>

const fetchStatData = async (props: Props) => {
  const {
    regionNames,
    mainCategory,
    subCategory,
    subSubCategory,
  } = props;

  const subSectionChildNamePar = subSubCategory ? `subSubCategory: "${subSubCategory}"` : '';

  const statDataQuery = regionNames.map((regionName, i) => `region_${i}: statData (
		regionName: "${regionName}",
		mainCategory: "${mainCategory}",
		subCategory: "${subCategory}",
		${subSectionChildNamePar}
	) {
		name,
    measure,
    parentMeasure,
    yearValues {
      year,
			value,
      prettyValue,
      percent
    },
    flag,
	}`);

  const query = `query{
		${statDataQuery}
	}`;

  const axiosResponse = await axios.post<StatDataResponse>(hostApi, { query });
  const { data } = axiosResponse.data;

  if (!data || Object.entries(data).length === 0) return null;

  const statDataEntries = Object.entries(data)
    .map(([indexedRegionName, statisticsData], i) => {
      const indexOfRegion = parseInt(indexedRegionName.split('_')[1]);
      return [regionNames[indexOfRegion], statisticsData];
    });

  const statData: Readonly<{
    [key: string]: GqlStatData
}> | null = Object.fromEntries(statDataEntries);

  return statData;
};

export default fetchStatData;
