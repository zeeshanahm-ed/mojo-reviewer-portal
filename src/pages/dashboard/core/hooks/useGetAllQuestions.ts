import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getAllQuestions } from '../_request';

const useGetAllQuestions = (params: any) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_ALL_QUESTIONS, params], () => getAllQuestions(params),
        {
            keepPreviousData: true,
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { allQuestionsData: data?.data?.result, pagination: { total: data?.data?.total }, error, isLoading, isError, isSuccess, refetch };
};

export default useGetAllQuestions;