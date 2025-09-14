import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getAllCategoriesDataForDropDown } from '../_request';

const useGetCategoriesForDropDown = () => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_ALL_CATEGORIES,], () => getAllCategoriesDataForDropDown(),
        {
            keepPreviousData: true,
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { allCategoriesData: data?.data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useGetCategoriesForDropDown;